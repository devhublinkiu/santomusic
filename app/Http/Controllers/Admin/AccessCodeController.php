<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AccessCodeController extends Controller
{
    public function index()
    {
        $codes = AccessCode::latest()->get();
        return Inertia::render('Admin/AccessCodes/Index', [
            'codes' => $codes
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:access_codes,code|max:10',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if (empty($data['code'])) {
            do {
                $code = strtoupper(Str::random(6));
            } while (AccessCode::where('code', $code)->exists());

            $data['code'] = $code;
        }

        AccessCode::create($data);

        return back()->with('success', 'Código creado correctamente');
    }

    public function update(Request $request, AccessCode $accessCode)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $accessCode->update($data);

        return back()->with('success', 'Código actualizado');
    }

    public function destroy(AccessCode $accessCode)
    {
        $accessCode->delete();
        return back()->with('success', 'Código eliminado');
    }
}
