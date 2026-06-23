<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedInteger('thumbnail_time')->nullable()->after('video_height'); // ms del frame elegido
            $table->unsignedInteger('poster_version')->nullable()->after('thumbnail_time'); // cache-busting
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['thumbnail_time', 'poster_version']);
        });
    }
};
