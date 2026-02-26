<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Video;
use Inertia\Inertia;

class ChannelController extends Controller
{
    public function index()
    {
        return Inertia::render('Music/Channel', [
            'videos' => Video::where('is_published', true)
                ->orderBy('is_featured', 'desc')
                ->latest()
                ->get()
        ]);
    }
}
