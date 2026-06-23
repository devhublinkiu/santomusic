import { useEffect, RefObject } from 'react';
import Hls from 'hls.js';

interface Props {
    src: string;
    videoRef: RefObject<HTMLVideoElement>;
    poster?: string;
    className?: string;
}

/**
 * Reproductor HLS con hls.js (fallback nativo en Safari).
 * Recibe el ref desde el padre para poder leer currentTime (scrubber de portada).
 */
export default function HlsVideo({ src, videoRef, poster, className }: Props) {
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls: Hls | null = null;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        } else if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            poster={poster}
            controls
            playsInline
            className={className}
        />
    );
}
