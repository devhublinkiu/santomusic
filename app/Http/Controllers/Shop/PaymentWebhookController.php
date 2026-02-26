<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle Bold.co Payment Webhook
     */
    public function handle(Request $request)
    {
        Log::info('Bold Webhook Received:', $request->all());

        $payload = $request->input('data'); // Assuming 'data' contains the transaction
        
        // Bold.co webhook structure might vary, adjust based on actual payload
        // Example: $payload['order_id'] or $payload['id'] for Bold payment link ID
        
        $orderId = $request->input('order_id') ?? ($payload['order_id'] ?? null);
        $boldId = $request->input('id') ?? ($payload['id'] ?? null);
        $status = $request->input('status') ?? ($payload['status'] ?? null);

        $order = null;
        if ($orderId) {
            $order = Order::find($orderId);
        } elseif ($boldId) {
            $order = Order::where('payment_id', $boldId)->first();
        }

        if (!$order) {
            Log::warning('Order not found for Bold Webhook:', $request->all());
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Map Bold status to our status
        // Bold statuses: created, approved, rejected, failed, etc.
        switch ($status) {
            case 'approved':
            case 'paid':
                $order->status = 'paid';
                break;
            case 'rejected':
            case 'failed':
                $order->status = 'failed';
                break;
            case 'cancelled':
                $order->status = 'cancelled';
                break;
        }

        $order->save();

        return response()->json(['message' => 'Webhook processed successfully']);
    }
}
