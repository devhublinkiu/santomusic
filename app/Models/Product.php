<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
    ];
}
