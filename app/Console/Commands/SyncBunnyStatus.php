<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\SiteSetting;
use App\Services\BunnyStreamService;
use Illuminate\Console\Command;

class SyncBunnyStatus extends Command
{
    protected $signature = 'bodas:sync-status';

    protected $description = 'Sincroniza el estado de los videos de Bunny Stream que están procesando (sin depender del webhook).';

    public function handle(BunnyStreamService $stream): int
    {
        if (! $stream->isConfigured()) {
            $this->error('Bunny Stream no está configurado.');
            return self::FAILURE;
        }

        $updated = 0;

        // Proyectos del grid en proceso
        $projects = Project::whereNotNull('video_guid')
            ->where('video_status', 'processing')
            ->get();

        foreach ($projects as $project) {
            $info = $stream->getVideo($project->video_guid);
            if (! $info) {
                continue;
            }
            $status = $stream->mapStatus($info['status'] ?? null);
            if ($status !== $project->video_status) {
                $project->video_status = $status;
                if ($status === 'ready') {
                    $project->video_width = $info['width'] ?? null;
                    $project->video_height = $info['height'] ?? null;
                }
                $project->save();
                $updated++;
            }
        }

        // Video del hero
        $settings = SiteSetting::first();
        if ($settings && $settings->wedding_hero_video_guid && $settings->wedding_hero_video_status === 'processing') {
            $info = $stream->getVideo($settings->wedding_hero_video_guid);
            if ($info) {
                $status = $stream->mapStatus($info['status'] ?? null);
                if ($status !== $settings->wedding_hero_video_status) {
                    $settings->wedding_hero_video_status = $status;
                    if ($status === 'ready') {
                        $settings->wedding_hero_video_width = $info['width'] ?? null;
                        $settings->wedding_hero_video_height = $info['height'] ?? null;
                    }
                    $settings->save();
                    $updated++;
                }
            }
        }

        $this->info("Videos actualizados: {$updated}");

        return self::SUCCESS;
    }
}
