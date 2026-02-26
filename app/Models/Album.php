<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'cover_image_path',
        'release_year',
        'is_published',
        'external_links',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'external_links' => 'array',
    ];

    public function songs()
    {
        return $this->hasMany(Song::class)->orderBy('order');
    }
}
