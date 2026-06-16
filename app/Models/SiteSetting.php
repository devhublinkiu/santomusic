<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'logo_vertical',
        'logo_home',
        'app_profile',
        'logo_app',
        'hero_background',
        'whatsapp_number',
        'contact_recipient',
        'bold_api_key',
        'bold_environment',
        'youtube_url',
        'youtube_channel_id',
        'menu_visibility',
    ];

    protected $casts = [
        'menu_visibility' => 'array',
    ];
}
