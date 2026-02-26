<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'event_date',
        'video_path',
        'external_url',
        'access_code_id',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function accessCode()
    {
        return $this->belongsTo(AccessCode::class);
    }
}
