<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IntegrationsController extends Controller
{
    public function index()
    {
        return redirect()->route('admin.integrations.bold');
    }

    public function bold()
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        return Inertia::render('Admin/Integrations/Bold', [
            'settings' => $settings
        ]);
    }

    public function youtube()
    {
        $settings = SiteSetting::first() ?? new SiteSetting();
        return Inertia::render('Admin/Integrations/YouTube', [
            'settings' => $settings
        ]);
    }

    public function updateBold(Request $request)
    {
        $request->validate([
            'bold_api_key' => 'required|string',
            'bold_environment' => 'required|string|in:sandbox,production',
        ]);

        $settings = SiteSetting::first() ?? new SiteSetting();
        $settings->bold_api_key = $request->bold_api_key;
        $settings->bold_environment = $request->bold_environment;
        $settings->save();

        return back()->with('success', 'Configuración de Bold actualizada correctamente');
    }

    public function updateGeneral(Request $request)
    {
        $request->validate([
            'youtube_url' => 'nullable|url',
            'youtube_channel_id' => 'nullable|string',
        ]);

        $settings = SiteSetting::first() ?? new SiteSetting();
        $settings->youtube_url = $request->youtube_url;
        $settings->youtube_channel_id = $request->youtube_channel_id;
        $settings->save();

        return back()->with('success', 'Configuraciones generales actualizadas');
    }
}
