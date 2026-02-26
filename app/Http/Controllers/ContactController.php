<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

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

        try {
            Mail::to('mrgrafista@gmail.com')->send(new ContactMessage($validated));
            
            return back()->with('success', '¡Gracias por contactarnos! Te responderemos pronto.');
        } catch (\Exception $e) {
            \Log::error('Error sending contact email: ' . $e->getMessage());
            return back()->with('error', 'Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.');
        }
    }
}
