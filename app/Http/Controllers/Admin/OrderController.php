<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with('user')->orderBy('created_at', 'desc');

        // Simple filtering by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Simple search by customer name or email (within JSON)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_info->name', 'like', "%{$search}%")
                  ->orWhere('customer_info->email', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order status manually.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,failed,cancelled,shipped,delivered',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', "Estado del pedido #{$order->id} actualizado a {$request->status}");
    }
}
