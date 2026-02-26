<?php

namespace App\Services;

use App\Models\SiteSetting;
use App\Models\Video;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeService
{
    protected $channelId;

    public function __construct()
    {
        $settings = SiteSetting::first();
        $this->channelId = $settings->youtube_channel_id ?? 'UCQ73rZUhda5W8uukeEQwpAg';
        
        if (empty($this->channelId)) {
            $this->channelId = 'UCQ73rZUhda5W8uukeEQwpAg';
        }
    }

    /**
     * Synchronize videos using the YouTube RSS Feed (No API Key required).
     */
    public function syncVideos()
    {
        if (!$this->channelId) {
            return [
                'success' => false,
                'message' => 'Channel ID no configurado.'
            ];
        }

        try {
            // YouTube RSS URL for the channel
            $rssUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" . $this->channelId;
            
            $response = Http::get($rssUrl);

            if ($response->failed()) {
                throw new \Exception('No se pudo acceder al feed de YouTube. Verifica el ID del canal.');
            }

            // Load XML
            $xml = simplexml_load_string($response->body());
            if (!$xml) {
                throw new \Exception('Error al procesar los datos de YouTube.');
            }

            $syncedCount = 0;
            
            // Register namespaces for parsing
            $namespaces = $xml->getNamespaces(true);

            foreach ($xml->entry as $entry) {
                // Get Video ID from yt namespace
                $yt = $entry->children($namespaces['yt']);
                $youtubeId = (string)$yt->videoId;
                
                $title = (string)$entry->title;
                
                // Get description from media namespace (if available)
                $media = $entry->children($namespaces['media']);
                $description = "";
                if (isset($media->group->description)) {
                    $description = (string)$media->group->description;
                }

                // Update or create the video in our database
                $video = Video::updateOrCreate(
                    ['youtube_id' => $youtubeId],
                    [
                        'title' => $title,
                        'description' => $description,
                        'is_published' => true,
                    ]
                );

                if ($video->wasRecentlyCreated || $video->wasChanged()) {
                    $syncedCount++;
                }
            }

            return [
                'success' => true,
                'message' => 'Sincronización completada vía RSS.',
                'synced_count' => $syncedCount,
                'total_found' => count($xml->entry)
            ];

        } catch (\Exception $e) {
            Log::error('YouTube RSS Sync Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
