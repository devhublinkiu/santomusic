<?php

namespace App\Http\Controllers;

use App\Models\Album;

class SitemapController extends Controller
{
    public function index()
    {
        $urls = [
            ['loc' => url('/'), 'priority' => '1.0'],
            ['loc' => route('music.index'), 'priority' => '0.8'],
            ['loc' => route('channel.index'), 'priority' => '0.7'],
            ['loc' => route('shop.index'), 'priority' => '0.8'],
            ['loc' => route('weddings.index'), 'priority' => '0.7'],
            ['loc' => route('contact.index'), 'priority' => '0.6'],
        ];

        foreach (Album::where('is_published', true)->get() as $album) {
            $urls[] = ['loc' => route('music.show', $album), 'priority' => '0.6'];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $u) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1) . "</loc>\n";
            $xml .= "    <priority>{$u['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
