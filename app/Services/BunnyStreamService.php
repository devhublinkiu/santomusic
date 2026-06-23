<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BunnyStreamService
{
    protected string $base = 'https://video.bunnycdn.com';
    protected ?string $libraryId;
    protected ?string $apiKey;
    protected ?string $cdnHostname;

    public function __construct()
    {
        $this->libraryId = config('services.bunny_stream.library_id');
        $this->apiKey = config('services.bunny_stream.api_key');
        $this->cdnHostname = config('services.bunny_stream.cdn_hostname');
    }

    public function isConfigured(): bool
    {
        return ! empty($this->libraryId) && ! empty($this->apiKey) && ! empty($this->cdnHostname);
    }

    public function libraryId(): ?string
    {
        return $this->libraryId;
    }

    /**
     * Crea el objeto de video en la library y devuelve su GUID.
     * Opcionalmente importa desde una URL pública (fetch) — usado en la migración.
     */
    public function createVideo(string $title, ?string $fetchUrl = null): string
    {
        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->base}/library/{$this->libraryId}/videos", [
            'title' => $title,
        ])->throw();

        $guid = $response->json('guid');

        if ($fetchUrl) {
            // Importa el archivo directamente desde una URL (no pasa por nuestro server).
            Http::withHeaders([
                'AccessKey' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->base}/library/{$this->libraryId}/videos/{$guid}/fetch", [
                'url' => $fetchUrl,
            ])->throw();
        }

        return $guid;
    }

    /**
     * Firma para la subida resumable (TUS) directa desde el navegador.
     * signature = sha256(libraryId + apiKey + expirationTime + videoId)
     */
    public function tusUploadAuth(string $guid, int $ttlSeconds = 3600): array
    {
        $expire = time() + $ttlSeconds;
        $signature = hash('sha256', $this->libraryId . $this->apiKey . $expire . $guid);

        return [
            'endpoint' => "{$this->base}/tusupload",
            'library_id' => (string) $this->libraryId,
            'video_id' => $guid,
            'signature' => $signature,
            'expire' => $expire,
        ];
    }

    public function getVideo(string $guid): ?array
    {
        $response = Http::withHeaders([
            'AccessKey' => $this->apiKey,
        ])->get("{$this->base}/library/{$this->libraryId}/videos/{$guid}");

        if ($response->failed()) {
            Log::warning('BunnyStream getVideo failed', ['guid' => $guid, 'status' => $response->status()]);
            return null;
        }

        return $response->json();
    }

    public function deleteVideo(string $guid): void
    {
        Http::withHeaders([
            'AccessKey' => $this->apiKey,
        ])->delete("{$this->base}/library/{$this->libraryId}/videos/{$guid}");
    }

    public function hlsUrl(string $guid): string
    {
        return "https://{$this->cdnHostname}/{$guid}/playlist.m3u8";
    }

    public function thumbnailUrl(string $guid): string
    {
        return "https://{$this->cdnHostname}/{$guid}/thumbnail.jpg";
    }

    /**
     * Mapea el status numérico de Bunny a nuestro string.
     * 0 Created, 1 Uploaded, 2 Processing, 3 Transcoding, 4 Finished, 5 Error, 6 UploadFailed
     */
    public function mapStatus(?int $status): string
    {
        return match (true) {
            $status === 4 => 'ready',
            in_array($status, [5, 6], true) => 'error',
            default => 'processing',
        };
    }
}
