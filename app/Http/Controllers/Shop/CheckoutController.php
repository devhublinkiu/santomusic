<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\BoldService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    protected $boldService;

    public function __construct(BoldService $boldService)
    {
        $this->boldService = $boldService;
    }

    public function index()
    {
        return Inertia::render('Shop/Checkout');
    }

    public function process(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'customer_info' => 'required|array',
            'customer_info.email' => 'required|email',
            'customer_info.name' => 'required|string',
            'total' => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Create Order
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'total' => $request->total,
                    'status' => 'pending',
                    'customer_info' => $request->customer_info,
                ]);

                // 2. Create Order Items
                foreach ($request->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                // 3. Initiate Bold Payment Link
                $paymentData = [
                    'order_id' => $order->id,
                    'total' => (int) ($request->total), // Bold might expect integers (cents/pesos)
                    'description' => "Pedido Santo Music #{$order->id}",
                    'payer_email' => $request->customer_info['email'],
                ];

                $paymentLink = $this->boldService->createPaymentLink($paymentData);

                if ($paymentLink && isset($paymentLink['payload']['url'])) {
                    $order->update(['payment_id' => $paymentLink['payload']['id']]);
                    
                    return response()->json([
                        'checkout_url' => $paymentLink['payload']['url'],
                        'order_id' => $order->id
                    ]);
                }

                throw new \Exception('No se pudo generar el link de pago con Bold.');
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
