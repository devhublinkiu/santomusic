<?php

namespace App\Http\Controllers;

use App\Models\AccessCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GatekeeperController extends Controller
{

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = AccessCode::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        if (!$code) {
            return back()->withErrors(['code' => 'Código inválido.']);
        }

        if ($code->expires_at && $code->expires_at->isPast()) {
            return back()->withErrors(['code' => 'Este código ha expirado.']);
        }

        $code->increment('uses');
        session(['access_code_verified' => true, 'access_code_id' => $code->id]);

        return to_route('weddings.index');
    }

    public function lock()
    {
        session()->forget(['access_code_verified', 'access_code_id']);
        return response()->noContent();
    }
}
