<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'event_date',
        'video_path',
        'video_guid',
        'video_status',
        'video_width',
        'video_height',
        'external_url',
        'access_code_id',
    ];

    protected $casts = [
        'event_date' => 'date',
        'video_width' => 'integer',
        'video_height' => 'integer',
    ];

    public function accessCode()
    {
        return $this->belongsTo(AccessCode::class);
    }
}
