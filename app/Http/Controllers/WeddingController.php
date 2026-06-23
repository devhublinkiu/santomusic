<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\SiteSetting;
use App\Services\BunnyStreamService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeddingController extends Controller
{
    public function index(BunnyStreamService $stream)
    {
        $accessCodeVerified = session('access_code_verified', false);
        $accessCodeId = session('access_code_id');
        $settings = SiteSetting::first();

        // Hero global (independiente del código de acceso). Se muestra solo si tiene portada.
        $hero = null;
        if ($settings && $settings->wedding_hero_poster) {
            $videoReady = $settings->wedding_hero_video_guid
                && $settings->wedding_hero_video_status === 'ready';

            $hero = [
                'poster' => $settings->wedding_hero_poster,
                'hls_url' => $videoReady ? $stream->hlsUrl($settings->wedding_hero_video_guid) : null,
                'width' => $settings->wedding_hero_video_width,
                'height' => $settings->wedding_hero_video_height,
                'ready' => (bool) $videoReady,
            ];
        }

        $projectsByGroup = [];

        if ($accessCodeVerified && $accessCodeId) {
            // Nombres de meses en español
            app()->setLocale('es');

            $mode = $settings?->weddings_grouping_mode ?? 'month';

            $projects = Project::where(function ($query) use ($accessCodeId) {
                $query->where('access_code_id', $accessCodeId)
                    ->orWhereNull('access_code_id');
            })
                ->where('video_status', 'ready')
                ->whereNotNull('video_guid')
                ->orderBy('event_date', 'desc')
                ->get();

            $projectsByGroup = $projects->groupBy(function ($project) use ($mode) {
                // Como vienen ordenados por fecha desc, los grupos quedan del más nuevo al más viejo.
                return $mode === 'year'
                    ? $project->event_date->format('Y')
                    : $project->event_date->translatedFormat('F Y');
            })->map(function ($items, $label) use ($stream) {
                return [
                    'month' => ucfirst((string) $label),
                    'projects' => $items->map(function ($project) use ($stream) {
                        return [
                            'id' => $project->id,
                            'name' => $project->name,
                            'event_date' => $project->event_date->format('d/m/Y'),
                            'hls_url' => $stream->hlsUrl($project->video_guid),
                            'poster_url' => $stream->thumbnailUrl($project->video_guid),
                            'width' => $project->video_width,
                            'height' => $project->video_height,
                            'external_url' => $project->external_url,
                        ];
                    })->values(),
                ];
            })->values();
        }

        return Inertia::render('Weddings/Index', [
            'isVerified' => $accessCodeVerified,
            'projectsByMonth' => $projectsByGroup,
            'hero' => $hero,
        ]);
    }
}
