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
        if (!Schema::hasColumn('site_settings', 'hero_background')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->string('hero_background')->nullable()->after('logo_app');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('site_settings', 'hero_background')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->dropColumn('hero_background');
            });
        }
    }
};
