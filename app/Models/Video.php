<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title',
        'youtube_id',
        'description',
        'is_featured',
        'is_published',
    ];
}
