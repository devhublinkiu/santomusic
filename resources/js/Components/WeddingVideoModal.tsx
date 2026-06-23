import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import Hls from 'hls.js';

interface Props {
    open: boolean;
    onClose: () => void;
    hlsUrl: string;
    posterUrl?: string;
    width?: number | null;
    height?: number | null;
}

export default function WeddingVideoModal({ open, onClose, hlsUrl, posterUrl, width, height }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!open || !hlsUrl) return;
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        // Safari reproduce HLS de forma nativa; el resto usa hls.js.
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
        } else if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [open, hlsUrl]);

    // El modal respeta el aspect ratio real del video (vertical u horizontal).
    const ar = width && height ? width / height : 16 / 9;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                        style={{ width: `min(92vw, calc(85vh * ${ar}))`, aspectRatio: String(ar) }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-white bg-neutral-900/60 ring-1 ring-white/20 backdrop-blur-md rounded-full p-2 transition-transform hover:scale-110"
                        >
                            <XIcon className="size-5" />
                        </button>
                        <video
                            ref={videoRef}
                            poster={posterUrl}
                            controls
                            autoPlay
                            playsInline
                            className="h-full w-full rounded-2xl border-2 border-white bg-black object-contain"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
