<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Inertia\Inertia;

class MusicController extends Controller
{
    public function index()
    {
        return Inertia::render('Music/Index', [
            'albums' => Album::where('is_published', true)->withCount('songs')->latest()->get()
        ]);
    }

    public function show(Album $album)
    {
        if (!$album->is_published && !auth()->check()) {
            abort(404);
        }

        return Inertia::render('Music/Show', [
            'album' => $album->load('songs')
        ]);
    }
}
