<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BoldService
{
    protected $api_key;
    protected $base_url;

    public function __construct()
    {
        $settings = SiteSetting::first();
        $this->api_key = $settings->bold_api_key ?? config('services.bold.api_key');
        $this->base_url = ($settings->bold_environment ?? 'sandbox') === 'production' 
            ? 'https://integrations.api.bold.co' 
            : 'https://integrations.sandbox.api.bold.co';
    }

    /**
     * Create a payment link via Bold API
     */
    public function createPaymentLink(array $data)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "x-api-key {$this->api_key}",
                'Content-Type' => 'application/json',
            ])->post("{$this->base_url}/online/link/v1", [
                'amount' => $data['total'],
                'currency' => 'COP',
                'description' => $data['description'] ?? 'Pago Santo Music',
                'order_id' => (string) $data['order_id'],
                'notification_url' => route('api.payments.webhook'),
                'redirect_url' => route('checkout.success'),
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Bold API Error:', $response->json());
            return null;
        } catch (\Exception $e) {
            Log::error('Bold Service Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check transaction status
     */
    public function checkTransactionStatus($paymentLinkId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "x-api-key {$this->api_key}",
            ])->get("{$this->base_url}/online/link/v1/{$paymentLinkId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Bold Service Status Exception: ' . $e->getMessage());
            return null;
        }
    }
}
