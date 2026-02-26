<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessCode extends Model
{
    protected $fillable = [
        'name',
        'code',
        'expires_at',
        'is_active',
        'uses',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
