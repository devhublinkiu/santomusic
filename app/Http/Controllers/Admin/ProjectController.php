<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Services\BunnyStreamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(BunnyStreamService $stream)
    {
        $projects = Project::with('accessCode')->latest()->get()->map(function ($project) use ($stream) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'event_date' => $project->event_date->format('Y-m-d'),
                'video_guid' => $project->video_guid,
                'video_status' => $project->video_status,
                'thumbnail_url' => $project->video_guid ? $stream->thumbnailUrl($project->video_guid) : null,
                'external_url' => $project->external_url,
                'access_code_id' => $project->access_code_id,
                'access_code' => $project->accessCode ? ['name' => $project->accessCode->name] : null,
                'created_at' => $project->created_at,
            ];
        });

        $accessCodes = \App\Models\AccessCode::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::first();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'accessCodes' => $accessCodes,
            'groupingMode' => $settings->weddings_grouping_mode ?? 'month',
        ]);
    }

    /**
     * Crea el proyecto + el objeto de video en Bunny Stream y devuelve la
     * autorización TUS para que el navegador suba el archivo directo a Bunny.
     */
    public function store(Request $request, BunnyStreamService $stream)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'external_url' => 'nullable|url',
            'access_code_id' => 'nullable|exists:access_codes,id',
        ]);

        if (! $stream->isConfigured()) {
            return response()->json(['message' => 'Bunny Stream no está configurado.'], 422);
        }

        $guid = $stream->createVideo($request->name);

        $project = Project::create([
            'name' => $request->name,
            'event_date' => $request->event_date,
            'video_guid' => $guid,
            'video_status' => 'processing',
            'external_url' => $request->external_url,
            'access_code_id' => $request->access_code_id ?: null,
        ]);

        return response()->json([
            'project' => ['id' => $project->id, 'name' => $project->name],
            'upload' => $stream->tusUploadAuth($guid),
        ]);
    }

    /**
     * Actualiza solo la metadata (sin tocar el video).
     */
    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'external_url' => 'nullable|url',
            'access_code_id' => 'nullable|exists:access_codes,id',
        ]);

        $project->update([
            'name' => $request->name,
            'event_date' => $request->event_date,
            'external_url' => $request->external_url,
            'access_code_id' => $request->access_code_id ?: null,
        ]);

        return back()->with('success', 'Proyecto actualizado correctamente.');
    }

    /**
     * Reemplaza el video: crea un nuevo objeto en Bunny Stream, borra el anterior
     * y devuelve la autorización TUS para subir el nuevo archivo.
     */
    public function replaceVideo(Request $request, Project $project, BunnyStreamService $stream)
    {
        if (! $stream->isConfigured()) {
            return response()->json(['message' => 'Bunny Stream no está configurado.'], 422);
        }

        $oldGuid = $project->video_guid;
        $guid = $stream->createVideo($project->name);

        $project->update([
            'video_guid' => $guid,
            'video_status' => 'processing',
            'video_width' => null,
            'video_height' => null,
        ]);

        if ($oldGuid) {
            $stream->deleteVideo($oldGuid);
        }

        return response()->json([
            'upload' => $stream->tusUploadAuth($guid),
        ]);
    }

    /**
     * Consulta manual del estado de transcodificación (botón "Refrescar").
     */
    public function refreshStatus(Project $project, BunnyStreamService $stream)
    {
        if ($project->video_guid) {
            $info = $stream->getVideo($project->video_guid);
            if ($info) {
                $project->video_status = $stream->mapStatus($info['status'] ?? null);
                if ($project->video_status === 'ready') {
                    $project->video_width = $info['width'] ?? null;
                    $project->video_height = $info['height'] ?? null;
                }
                $project->save();
            }
        }

        return back()->with('success', 'Estado actualizado.');
    }

    /**
     * Modo de agrupado de la vista pública (mes | año).
     */
    public function updateGrouping(Request $request)
    {
        $request->validate([
            'mode' => 'required|in:month,year',
        ]);

        $settings = SiteSetting::first() ?? new SiteSetting();
        $settings->weddings_grouping_mode = $request->mode;
        $settings->save();

        return back()->with('success', 'Modo de agrupado actualizado.');
    }

    public function destroy(Project $project, BunnyStreamService $stream)
    {
        if ($project->video_guid) {
            $stream->deleteVideo($project->video_guid);
        }

        // Compatibilidad con registros viejos en Bunny Storage (pre-migración).
        if ($project->video_path) {
            Storage::disk('bunny')->delete($project->video_path);
        }

        $project->delete();

        return back()->with('success', 'Proyecto eliminado.');
    }
}
