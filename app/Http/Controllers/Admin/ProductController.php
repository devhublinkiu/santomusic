<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|max:5120', // 5MB max per image
        ]);

        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'bunny');
                $imageUrls[] = Storage::disk('bunny')->url($path);
            }
        }

        Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'images' => $imageUrls,
        ]);

        return back()->with('success', 'Producto creado correctamente');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:5120',
        ]);

        $data = $request->only(['name', 'description', 'price']);

        if ($request->hasFile('images')) {
            // Delete old images
            if ($product->images) {
                foreach ($product->images as $url) {
                    $path = str_replace(Storage::disk('bunny')->url(''), '', $url);
                    Storage::disk('bunny')->delete($path);
                }
            }

            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'bunny');
                $imageUrls[] = Storage::disk('bunny')->url($path);
            }
            $data['images'] = $imageUrls;
        }

        $product->update($data);

        return back()->with('success', 'Producto actualizado correctamente');
    }

    public function destroy(Product $product)
    {
        if ($product->images) {
            foreach ($product->images as $url) {
                $path = str_replace(Storage::disk('bunny')->url(''), '', $url);
                Storage::disk('bunny')->delete($path);
            }
        }
        $product->delete();

        return back()->with('success', 'Producto eliminado correctamente');
    }
}
