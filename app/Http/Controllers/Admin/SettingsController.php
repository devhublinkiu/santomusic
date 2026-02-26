<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        // DEBUG: Logging upload details & Runtime Config
        \Illuminate\Support\Facades\Log::info('Runtime Config:', [
            'php_ini' => php_ini_loaded_file(),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
        ]);

        if ($request->hasFile('hero_background')) {
            $file = $request->file('hero_background');
            \Illuminate\Support\Facades\Log::info('File Detected (Valid):', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ]);
        }
        else {
            // Check raw $_FILES to see if it exists but with error
            \Illuminate\Support\Facades\Log::info('No Valid File detected via Request.');
            \Illuminate\Support\Facades\Log::info('Raw $_FILES:', $_FILES);
            \Illuminate\Support\Facades\Log::info('Raw $_POST Keys:', array_keys($_POST));
        }

        $data = $request->validate([
            'logo_vertical' => 'nullable|image|max:2048',
            'logo_home' => 'nullable|image|max:2048',
            'app_profile' => 'nullable|image|max:2048',
            'logo_app' => 'nullable|image|max:2048',
            'hero_background' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:102400', // 100MB max for video
            'whatsapp_number' => 'nullable|string|max:20',
        ]);

        $settings->whatsapp_number = $request->whatsapp_number;

        foreach (['logo_vertical', 'logo_home', 'app_profile', 'logo_app', 'hero_background'] as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                if ($settings->$field) {
                    Storage::disk('bunny')->delete($settings->$field);
                }

                // Store new file on Bunny.net
                $path = $request->file($field)->store('settings', 'bunny');
                $settings->$field = Storage::disk('bunny')->url($path);
            }
        }

        $settings->save();

        return back()->with('success', 'Configuración actualizada correctamente');
    }
}
