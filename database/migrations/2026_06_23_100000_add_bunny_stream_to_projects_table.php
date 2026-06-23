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
            $table->string('video_guid')->nullable()->after('video_path');
            $table->string('video_status')->default('ready')->after('video_guid');
            $table->unsignedInteger('video_width')->nullable()->after('video_status');
            $table->unsignedInteger('video_height')->nullable()->after('video_width');
        });

        // El nuevo pipeline (Bunny Stream) no usa video_path; lo dejamos nullable
        // para que conviva con los registros existentes hasta migrarlos.
        Schema::table('projects', function (Blueprint $table) {
            $table->string('video_path')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['video_guid', 'video_status', 'video_width', 'video_height']);
        });
    }
};
