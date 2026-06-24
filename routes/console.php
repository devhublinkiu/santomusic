<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Flip automático de "procesando" -> "listo" sin depender del webhook de Bunny.
Schedule::command('bodas:sync-status')->everyMinute()->withoutOverlapping();
