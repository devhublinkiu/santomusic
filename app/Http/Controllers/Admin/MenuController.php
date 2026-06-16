<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Items del menú público que se pueden ocultar/mostrar.
     * La clave debe coincidir con la usada en PublicLayout.tsx.
     * "Inicio" no se incluye: siempre es visible.
     */
    public const ITEMS = [
        ['key' => 'music', 'label' => 'Música'],
        ['key' => 'channel', 'label' => 'Canal'],
        ['key' => 'shop', 'label' => 'Tienda'],
        ['key' => 'weddings', 'label' => 'Bodas'],
        ['key' => 'contact', 'label' => 'Contacto'],
    ];

    public function index()
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        $stored = $settings->menu_visibility ?? [];

        // Por defecto todos visibles si no hay valor guardado.
        $items = array_map(function ($item) use ($stored) {
            return [
                'key' => $item['key'],
                'label' => $item['label'],
                'visible' => $stored[$item['key']] ?? true,
            ];
        }, self::ITEMS);

        return Inertia::render('Admin/Menu', [
            'items' => $items,
        ]);
    }

    public function update(Request $request)
    {
        $keys = array_column(self::ITEMS, 'key');

        $rules = [];
        foreach ($keys as $key) {
            $rules["visibility.$key"] = 'required|boolean';
        }

        $validated = $request->validate($rules);

        $settings = SiteSetting::first() ?? new SiteSetting();
        $settings->menu_visibility = $validated['visibility'];
        $settings->save();

        return back()->with('success', 'Menú actualizado correctamente');
    }
}
