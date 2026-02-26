<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('accessCode')->latest()->get();
        $accessCodes = \App\Models\AccessCode::where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'accessCodes' => $accessCodes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'video' => 'required|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:5120000', // 5000MB max
            'external_url' => 'nullable|url',
            'access_code_id' => 'nullable|exists:access_codes,id',
        ]);

        try {
            $path = $request->file('video')->store('projects', 'bunny');

            Project::create([
                'name' => $request->name,
                'event_date' => $request->event_date,
                'video_path' => $path,
                'external_url' => $request->external_url,
                'access_code_id' => $request->access_code_id,
            ]);

            return back()->with('success', 'Proyecto creado correctamente.');
        }
        catch (\Exception $e) {
            return back()->withErrors(['video' => 'Error al subir el video: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:5120000',
            'external_url' => 'nullable|url',
            'access_code_id' => 'nullable|exists:access_codes,id',
        ]);

        $data = [
            'name' => $request->name,
            'event_date' => $request->event_date,
            'external_url' => $request->external_url,
            'access_code_id' => $request->access_code_id,
        ];

        if ($request->hasFile('video')) {
            // Delete old video
            if ($project->video_path) {
                Storage::disk('bunny')->delete($project->video_path);
            }
            // Upload new
            $data['video_path'] = $request->file('video')->store('projects', 'bunny');
        }

        $project->update($data);

        return back()->with('success', 'Proyecto actualizado correctamente.');
    }

    public function destroy(Project $project)
    {
        if ($project->video_path) {
            Storage::disk('bunny')->delete($project->video_path);
        }

        $project->delete();

        return back()->with('success', 'Proyecto eliminado.');
    }
}
