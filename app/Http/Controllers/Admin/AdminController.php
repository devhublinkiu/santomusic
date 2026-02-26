<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Project;
use App\Models\AccessCode;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $serverInfo = [
            'php_version' => PHP_VERSION,
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'max_execution_time' => ini_get('max_execution_time') . 's',
            'memory_limit' => ini_get('memory_limit'),
            'bunny_status' => $this->checkBunnyConnection(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_projects' => Project::count(),
                'total_access_codes' => AccessCode::count(),
                'total_products' => Product::count(),
            ],
            'serverInfo' => $serverInfo,
        ]);
    }

    private function checkBunnyConnection(): string
    {
        try {
            // Just check if we can list the root (or any known path)
            Storage::disk('bunny')->files('/');
            return 'Conectado (Bunny.net)';
        }
        catch (\Exception $e) {
            return 'Desconectado / Error';
        }
    }
}
