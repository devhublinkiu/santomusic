<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\SiteSetting;
use App\Services\BunnyStreamService;
use Illuminate\Http\Request;

class BunnyStreamWebhookController extends Controller
{
    /**
     * Bunny Stream nos avisa cuando cambia el estado de un video.
     * Payload: { VideoLibraryId, VideoGuid, Status }
     */
    public function handle(Request $request, BunnyStreamService $stream)
    {
        // Verificación opcional por token en la URL (?token=...).
        $secret = config('services.bunny_stream.webhook_secret');
        if (! empty($secret) && $request->query('token') !== $secret) {
            abort(403);
        }

        $guid = $request->input('VideoGuid');
        $status = $request->input('Status');

        if (! $guid) {
            return response()->noContent();
        }

        $mapped = $stream->mapStatus($status !== null ? (int) $status : null);

        // ¿Es un video de boda del grid?
        $project = Project::where('video_guid', $guid)->first();
        if ($project) {
            $project->video_status = $mapped;
            if ($mapped === 'ready') {
                $info = $stream->getVideo($guid);
                if ($info) {
                    $project->video_width = $info['width'] ?? null;
                    $project->video_height = $info['height'] ?? null;
                }
            }
            $project->save();
            return response()->noContent();
        }

        // ¿Es el video del hero (guardado en site_settings)?
        $settings = SiteSetting::where('wedding_hero_video_guid', $guid)->first();
        if ($settings) {
            $settings->wedding_hero_video_status = $mapped;
            if ($mapped === 'ready') {
                $info = $stream->getVideo($guid);
                if ($info) {
                    $settings->wedding_hero_video_width = $info['width'] ?? null;
                    $settings->wedding_hero_video_height = $info['height'] ?? null;
                }
            }
            $settings->save();
        }

        return response()->noContent();
    }
}
