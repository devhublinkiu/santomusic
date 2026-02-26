<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Gatekeeper Routes
Route::post('/gatekeeper/verify', [\App\Http\Controllers\GatekeeperController::class , 'verify'])->name('gatekeeper.verify');
Route::post('/gatekeeper/lock', [\App\Http\Controllers\GatekeeperController::class , 'lock'])->name('gatekeeper.lock');

// Public Wedding Route (Access controlled by View)
Route::get('/bodas', [\App\Http\Controllers\WeddingController::class , 'index'])->name('weddings.index');
Route::get('/shop', [\App\Http\Controllers\ShopController::class , 'index'])->name('shop.index');
Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'submit'])->name('contact.submit');
Route::get('/checkout', [\App\Http\Controllers\Shop\CheckoutController::class , 'index'])->name('checkout.index');
Route::post('/checkout/process', [\App\Http\Controllers\Shop\CheckoutController::class , 'process'])->name('checkout.process');
Route::get('/channel', [\App\Http\Controllers\Home\ChannelController::class, 'index'])->name('channel.index');
Route::get('/checkout/success', function () {
    return Inertia::render('Shop/Success');
})->name('checkout.success');
Route::post('/payments/webhook', [\App\Http\Controllers\Shop\PaymentWebhookController::class, 'handle'])->name('api.payments.webhook');

Route::get('/dashboard', function () {
    if (auth()->user()->is_admin) {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class , 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class , 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class , 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\AdminController::class , 'dashboard'])->name('dashboard');
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class , 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class , 'update'])->name('settings.update');
    Route::resource('access-codes', \App\Http\Controllers\Admin\AccessCodeController::class)->except(['create', 'edit', 'show']);
    Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class)->except(['create', 'edit', 'show']);
    Route::resource('products', \App\Http\Controllers\Admin\ProductController::class)->except(['create', 'edit', 'show']);
    Route::resource('albums', \App\Http\Controllers\Admin\AlbumController::class);
    Route::post('albums/{album}/songs', [\App\Http\Controllers\Admin\SongController::class, 'store'])->name('songs.store');
    Route::patch('songs/{song}', [\App\Http\Controllers\Admin\SongController::class, 'update'])->name('songs.update');
    Route::delete('songs/{song}', [\App\Http\Controllers\Admin\SongController::class, 'destroy'])->name('songs.destroy');
    Route::post('albums/{album}/songs/reorder', [\App\Http\Controllers\Admin\SongController::class, 'reorder'])->name('songs.reorder');
    Route::get('/integrations', [\App\Http\Controllers\Admin\IntegrationsController::class, 'index'])->name('integrations.index');
    Route::get('/integrations/bold', [\App\Http\Controllers\Admin\IntegrationsController::class, 'bold'])->name('integrations.bold');
    Route::get('/integrations/youtube', [\App\Http\Controllers\Admin\IntegrationsController::class, 'youtube'])->name('integrations.youtube');
    Route::post('/integrations/bold', [\App\Http\Controllers\Admin\IntegrationsController::class, 'updateBold'])->name('integrations.bold.update');
    Route::post('/integrations/general', [\App\Http\Controllers\Admin\IntegrationsController::class, 'updateGeneral'])->name('integrations.general.update');

    Route::get('/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.status.update');
    // Videos
    Route::post('videos/sync', [\App\Http\Controllers\Admin\VideoController::class, 'sync'])->name('videos.sync');
    Route::resource('videos', \App\Http\Controllers\Admin\VideoController::class)->except(['create', 'edit', 'show']);
});

Route::get('/musica', [\App\Http\Controllers\Home\MusicController::class, 'index'])->name('music.index');
Route::get('/musica/{album}', [\App\Http\Controllers\Home\MusicController::class, 'show'])->name('music.show');

require __DIR__ . '/auth.php';
