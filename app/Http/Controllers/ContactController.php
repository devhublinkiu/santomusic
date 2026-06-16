<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactMessage;
use App\Models\SiteSetting;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/Index');
    }

    public function submit(Request $request)
    {
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

            return back()->with('success', '¡Gracias por contactarnos! Te responderemos pronto.');
        } catch (\Throwable $e) {
            Log::error('Error sending contact email: ' . $e->getMessage());
            return back()->with('error', 'Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.');
        }
    }
}
