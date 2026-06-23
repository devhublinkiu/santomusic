<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Services\BunnyStreamService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateBodasToStream extends Command
{
    protected $signature = 'bodas:migrate-to-stream {--dry-run : Solo muestra lo que haría, sin tocar nada}';

    protected $description = 'Importa los videos de bodas de Bunny Storage a Bunny Stream (fetch by URL).';

    public function handle(BunnyStreamService $stream): int
    {
        if (! $stream->isConfigured()) {
            $this->error('Bunny Stream no está configurado (revisa BUNNY_STREAM_* en .env).');
            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');

        $pending = Project::whereNotNull('video_path')
            ->whereNull('video_guid')
            ->get();

        if ($pending->isEmpty()) {
            $this->info('No hay proyectos pendientes de migrar.');
            return self::SUCCESS;
        }

        $this->info("Proyectos a migrar: {$pending->count()}" . ($dryRun ? ' (dry-run)' : ''));

        foreach ($pending as $project) {
            $url = Storage::disk('bunny')->url($project->video_path);
            $this->line("#{$project->id}  {$project->name}");
            $this->line("    origen: {$url}");

            if ($dryRun) {
                continue;
            }

            try {
                $guid = $stream->createVideo($project->name, $url);
                $project->update([
                    'video_guid' => $guid,
                    'video_status' => 'processing',
                ]);
                $this->info("    -> creado en Stream: {$guid} (procesando)");
            } catch (\Throwable $e) {
                $this->error("    -> error: {$e->getMessage()}");
            }
        }

        if ($dryRun) {
            $this->comment('Dry-run: no se creó nada. Corre sin --dry-run para ejecutar.');
        } else {
            $this->info('Listo. Bunny transcodificará en segundo plano; el estado pasará a "ready" vía webhook o con el botón Refrescar.');
            $this->comment('Cuando verifiques que todo esté OK, podés borrar los mp4 viejos de Bunny Storage.');
        }

        return self::SUCCESS;
    }
}
