<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\BunnyStreamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(BunnyStreamService $stream)
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        $heroReady = $settings->wedding_hero_video_guid
            && $settings->wedding_hero_video_status === 'ready';

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
            'heroHls' => $heroReady ? $stream->hlsUrl($settings->wedding_hero_video_guid) : null,
            'heroReady' => (bool) $heroReady,
        ]);
    }

    public function update(Request $request)
    {
        $settings = SiteSetting::first() ?? new SiteSetting();

        $data = $request->validate([
            'logo_vertical' => 'nullable|image|max:2048',
            'logo_home' => 'nullable|image|max:2048',
            'app_profile' => 'nullable|image|max:2048',
            'logo_app' => 'nullable|image|max:2048',
            'hero_background' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:102400', // 100MB max for video
            'wedding_hero_poster' => 'nullable|image|max:4096',
            'whatsapp_number' => 'nullable|string|max:20',
            'contact_recipient' => 'nullable|email|max:255',
        ]);

        $settings->whatsapp_number = $request->whatsapp_number;
        $settings->contact_recipient = $request->contact_recipient;

        foreach (['logo_vertical', 'logo_home', 'app_profile', 'logo_app', 'hero_background', 'wedding_hero_poster'] as $field) {
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

    /**
     * Crea el video del hero de bodas en Bunny Stream y devuelve la
     * autorización TUS para que el navegador suba el archivo directo.
     */
    public function heroVideo(Request $request, BunnyStreamService $stream)
    {
        if (! $stream->isConfigured()) {
            return response()->json(['message' => 'Bunny Stream no está configurado.'], 422);
        }

        $settings = SiteSetting::first() ?? new SiteSetting();
        $oldGuid = $settings->wedding_hero_video_guid;

        $guid = $stream->createVideo('Hero Bodas');

        $settings->wedding_hero_video_guid = $guid;
        $settings->wedding_hero_video_status = 'processing';
        $settings->wedding_hero_video_width = null;
        $settings->wedding_hero_video_height = null;
        $settings->save();

        if ($oldGuid) {
            $stream->deleteVideo($oldGuid);
        }

        return response()->json([
            'upload' => $stream->tusUploadAuth($guid),
        ]);
    }

    /**
     * Fija un frame del video del hero como portada (override del thumbnail).
     */
    public function heroThumbnail(Request $request, BunnyStreamService $stream)
    {
        $request->validate(['time_ms' => 'required|integer|min:0']);

        $settings = SiteSetting::first();
        if (! $settings || ! $settings->wedding_hero_video_guid || $settings->wedding_hero_video_status !== 'ready') {
            return response()->json(['message' => 'El video del hero todavía no está listo.'], 422);
        }

        if (! $stream->setThumbnailTime($settings->wedding_hero_video_guid, (int) $request->time_ms)) {
            return response()->json(['message' => 'Bunny no aceptó el cambio de portada.'], 422);
        }

        $settings->wedding_hero_poster_version = (int) ($settings->wedding_hero_poster_version ?? 0) + 1;
        $settings->save();

        return response()->json(['ok' => true]);
    }

    /**
     * Consulta manual del estado de transcodificación del video del hero.
     */
    public function refreshHeroStatus(BunnyStreamService $stream)
    {
        $settings = SiteSetting::first();

        if ($settings && $settings->wedding_hero_video_guid) {
            $info = $stream->getVideo($settings->wedding_hero_video_guid);
            if ($info) {
                $settings->wedding_hero_video_status = $stream->mapStatus($info['status'] ?? null);
                if ($settings->wedding_hero_video_status === 'ready') {
                    $settings->wedding_hero_video_width = $info['width'] ?? null;
                    $settings->wedding_hero_video_height = $info['height'] ?? null;
                }
                $settings->save();
            }
        }

        return back()->with('success', 'Estado del hero actualizado.');
    }
}
