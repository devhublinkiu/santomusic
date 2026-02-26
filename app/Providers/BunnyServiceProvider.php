<?php

namespace App\Providers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use PlatformCommunity\Flysystem\BunnyCDN\BunnyCDNAdapter;
use PlatformCommunity\Flysystem\BunnyCDN\BunnyCDNClient;
use Illuminate\Filesystem\FilesystemAdapter;

class BunnyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Storage::extend('bunnycdn', function ($app, $config) {
            $adapter = new BunnyCDNAdapter(
                new BunnyCDNClient(
                $config['storage_zone'],
                $config['api_key'],
                $config['region']
                ),
                $config['url'] // Pull Zone URL
                );

            return new FilesystemAdapter(
            new Filesystem($adapter, $config),
            $adapter,
            $config
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    //
    }
}
