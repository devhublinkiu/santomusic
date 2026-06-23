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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('wedding_hero_poster')->nullable()->after('weddings_grouping_mode');
            $table->string('wedding_hero_video_guid')->nullable()->after('wedding_hero_poster');
            $table->string('wedding_hero_video_status')->nullable()->after('wedding_hero_video_guid');
            $table->unsignedInteger('wedding_hero_video_width')->nullable()->after('wedding_hero_video_status');
            $table->unsignedInteger('wedding_hero_video_height')->nullable()->after('wedding_hero_video_width');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'wedding_hero_poster',
                'wedding_hero_video_guid',
                'wedding_hero_video_status',
                'wedding_hero_video_width',
                'wedding_hero_video_height',
            ]);
        });
    }
};
