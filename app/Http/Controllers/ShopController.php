<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SiteSetting;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::first();
        return Inertia::render('Shop/Index', [
            'products' => Product::latest()->get(),
            'whatsappNumber' => $settings->whatsapp_number ?? '',
        ]);
    }
}
