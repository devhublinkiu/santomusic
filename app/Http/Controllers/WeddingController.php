<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class WeddingController extends Controller
{
    public function index()
    {
        $accessCodeVerified = session('access_code_verified', false);
        $accessCodeId = session('access_code_id');

        $projectsByMonth = [];

        if ($accessCodeVerified && $accessCodeId) {
            // Set locale to Spanish for month names
            app()->setLocale('es');

            $projects = Project::where(function ($query) use ($accessCodeId) {
                $query->where('access_code_id', $accessCodeId)
                    ->orWhereNull('access_code_id');
            })
                ->orderBy('event_date', 'desc')
                ->get();

            $projectsByMonth = $projects->groupBy(function ($project) {
                return $project->event_date->translatedFormat('F Y');
            })->map(function ($items, $month) {
                return [
                'month' => ucfirst($month),
                'projects' => $items->map(function ($project) {
                        return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'event_date' => $project->event_date->format('d/m/Y'),
                        'video_url' => $project->video_path ?\Illuminate\Support\Facades\Storage::disk('bunny')->url($project->video_path) : null,
                        'external_url' => $project->external_url,
                        ];
                    }
                    ),
                    ];
                })->values();
        }

        return Inertia::render('Weddings/Index', [
            'isVerified' => $accessCodeVerified,
            'projectsByMonth' => $projectsByMonth,
        ]);
    }
}
