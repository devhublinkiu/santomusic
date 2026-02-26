<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SongController extends Controller
{
    public function store(Request $request, Album $album)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'audio' => 'required|file|mimes:mp3,wav,ogg,m4a|max:102400', // 100MB limit
            'duration' => 'nullable|integer',
            'external_links' => 'nullable|array',
        ]);

        $path = $request->file('audio')->store("albums/{$album->id}/songs", 'bunny');
        
        $album->songs()->create([
            'title' => $data['title'],
            'audio_path' => Storage::disk('bunny')->url($path),
            'duration' => $data['duration'] ?? null,
            'external_links' => $data['external_links'] ?? null,
            'order' => $album->songs()->count() + 1
        ]);

        return back()->with('success', 'Canción añadida correctamente');
    }

    public function update(Request $request, Song $song)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'required|integer',
            'external_links' => 'nullable|array',
        ]);

        $song->update($data);

        return back()->with('success', 'Canción actualizada correctamente');
    }

    public function destroy(Song $song)
    {
        if ($song->audio_path) {
            $path = parse_url($song->audio_path, PHP_URL_PATH);
            Storage::disk('bunny')->delete($path);
        }

        $song->delete();

        return back()->with('success', 'Canción eliminada correctamente');
    }

    public function reorder(Request $request, Album $album)
    {
        $request->validate([
            'songs' => 'required|array',
            'songs.*.id' => 'required|exists:songs,id',
            'songs.*.order' => 'required|integer',
        ]);

        foreach ($request->songs as $songData) {
            Song::where('id', $songData['id'])->update(['order' => $songData['order']]);
        }

        return back()->with('success', 'Orden actualizado correctamente');
    }
}
