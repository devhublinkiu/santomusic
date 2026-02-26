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
            $table->string('youtube_api_key')->nullable()->after('youtube_url');
            $table->string('youtube_channel_id')->nullable()->after('youtube_api_key');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['youtube_api_key', 'youtube_channel_id']);
        });
    }
};
