<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Video;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Videos/Index', [
            'videos' => Video::latest()->get()
        ]);
    }

    public function sync(\App\Services\YouTubeService $youtubeService)
    {
        $result = $youtubeService->syncVideos();

        if (!$result['success']) {
            return back()->with('error', $result['message']);
        }

        return back()->with('success', $result['message'] . " ({$result['synced_count']} nuevos/actualizados)");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'youtube_url' => 'required|string',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        // Extract YouTube ID
        $youtubeId = $this->extractYoutubeId($validated['youtube_url']);

        if (!$youtubeId) {
            return back()->withErrors(['youtube_url' => 'No se pudo extraer el ID de YouTube de la URL proporcionada.']);
        }

        Video::create([
            'title' => $validated['title'],
            'youtube_id' => $youtubeId,
            'description' => $validated['description'],
            'is_featured' => $validated['is_featured'],
            'is_published' => $validated['is_published'],
        ]);

        return back()->with('success', 'Video añadido correctamente');
    }

    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'youtube_url' => 'required|string',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        $youtubeId = $this->extractYoutubeId($validated['youtube_url']);

        if (!$youtubeId) {
            return back()->withErrors(['youtube_url' => 'No se pudo extraer el ID de YouTube de la URL proporcionada.']);
        }

        $video->update([
            'title' => $validated['title'],
            'youtube_id' => $youtubeId,
            'description' => $validated['description'],
            'is_featured' => $validated['is_featured'],
            'is_published' => $validated['is_published'],
        ]);

        return back()->with('success', 'Video actualizado correctamente');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return back()->with('success', 'Video eliminado correctamente');
    }

    private function extractYoutubeId($url)
    {
        // Simple regex to extract YT ID
        preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $url, $match);
        return $match[1] ?? (strlen($url) === 11 ? $url : null);
    }
}
