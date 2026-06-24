<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;
use App\Mail\ContactMessage;
use App\Models\SiteSetting;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/Index', [
            // Token firmado con la hora actual para el "time-trap" anti-bots.
            'formToken' => Crypt::encryptString((string) now()->timestamp),
        ]);
    }

    public function submit(Request $request)
    {
        // Mensaje que ve el visitante (real o bot). A los bots les "fingimos" éxito.
        $okMessage = '¡Gracias por contactarnos! Te responderemos pronto.';

        // 1) Honeypot: campo invisible que solo los bots rellenan.
        if (filled($request->input('website'))) {
            return back()->with('success', $okMessage);
        }

        // 2) Time-trap: rechaza envíos demasiado rápidos o con token forjado/vencido.
        if (! $this->passesTimeTrap($request->input('form_token'))) {
            return back()->with('success', $okMessage);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Correo configurado por el admin en Settings; si no hay, usa el de config/.env.
        $recipient = SiteSetting::first()?->contact_recipient ?: config('mail.contact_recipient');

        try {
            Mail::to($recipient)->send(new ContactMessage($validated));

            return back()->with('success', $okMessage);
        } catch (\Throwable $e) {
            Log::error('Error sending contact email: ' . $e->getMessage());
            return back()->with('error', 'Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.');
        }
    }

    /**
     * Válido si pasaron al menos 3s desde que se cargó el form y el token no está vencido (<2h).
     */
    private function passesTimeTrap(?string $token): bool
    {
        if (! $token) {
            return false;
        }

        try {
            $ts = (int) Crypt::decryptString($token);
        } catch (\Throwable $e) {
            return false;
        }

        $elapsed = now()->timestamp - $ts;

        return $elapsed >= 3 && $elapsed <= 7200;
    }
}
