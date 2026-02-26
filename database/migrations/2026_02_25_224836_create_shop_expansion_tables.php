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
        // Update Site Settings
        Schema::table('site_settings', function (Blueprint $table) {
            $table->text('bold_api_key')->nullable();
            $table->string('bold_environment')->default('sandbox');
        });

        // Create Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('total', 15, 2);
            $table->string('status')->default('pending'); // pending, paid, failed, cancelled
            $table->string('payment_id')->nullable();
            $table->json('customer_info')->nullable();
            $table->timestamps();
        });

        // Create Order Items Table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['bold_api_key', 'bold_environment']);
        });
    }
};
