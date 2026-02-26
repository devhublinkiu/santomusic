<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlbumController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Albums/Index', [
            'albums' => Album::withCount('songs')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Albums/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'release_year' => 'nullable|integer',
            'cover_image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
            'external_links' => 'nullable|array',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('albums/covers', 'bunny');
            $data['cover_image_path'] = Storage::disk('bunny')->url($path);
        }

        Album::create($data);

        return redirect()->route('admin.albums.index')->with('success', 'Álbum creado correctamente');
    }

    public function edit(Album $album)
    {
        return Inertia::render('Admin/Albums/Form', [
            'album' => $album->load('songs')
        ]);
    }

    public function update(Request $request, Album $album)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'release_year' => 'nullable|integer',
            'cover_image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
            'external_links' => 'nullable|array',
        ]);

        if ($request->hasFile('cover_image')) {
            // Delete old
            if ($album->cover_image_path) {
                $oldPath = parse_url($album->cover_image_path, PHP_URL_PATH);
                Storage::disk('bunny')->delete($oldPath);
            }
            $path = $request->file('cover_image')->store('albums/covers', 'bunny');
            $data['cover_image_path'] = Storage::disk('bunny')->url($path);
        }

        $album->update($data);

        return redirect()->route('admin.albums.index')->with('success', 'Álbum actualizado correctamente');
    }

    public function destroy(Album $album)
    {
        if ($album->cover_image_path) {
            $oldPath = parse_url($album->cover_image_path, PHP_URL_PATH);
            Storage::disk('bunny')->delete($oldPath);
        }

        // Songs are automatically deleted via cascade migration
        foreach ($album->songs as $song) {
            if ($song->audio_path) {
                $audioPath = parse_url($song->audio_path, PHP_URL_PATH);
                Storage::disk('bunny')->delete($audioPath);
            }
        }

        $album->delete();

        return back()->with('success', 'Álbum eliminado correctamente');
    }
}
