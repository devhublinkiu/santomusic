import appleIcon from '../../../images/platforms/apple_Music_icon.svg';
import spotifyIcon from '../../../images/platforms/spotify_icon.svg';
import youtubeIcon from '../../../images/platforms/youtube_Music_icon.svg';
import deezerIcon from '../../../images/platforms/deezer_icon.svg';
import soundcloudIcon from '../../../images/platforms/soundcloud_icon.svg';
import tidalIcon from '../../../images/platforms/tidal_icon.svg';
import amazonIcon from '../../../images/platforms/amazon_music_icon.svg';
import bandcampIcon from '../../../images/platforms/bandcamp_icon.svg';

interface PlatformIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    platform: string;
    size?: number;
}

const PLATFORM_ICONS: Record<string, string> = {
    spotify: spotifyIcon,
    youtube: youtubeIcon,
    apple: appleIcon,
    deezer: deezerIcon,
    soundcloud: soundcloudIcon,
    tidal: tidalIcon,
    amazon: amazonIcon,
    bandcamp: bandcampIcon
};

const PLATFORM_LABELS: Record<string, string> = {
    spotify: "Spotify",
    youtube: "YouTube Music",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    tidal: "Tidal",
    amazon: "Amazon Music",
    bandcamp: "Bandcamp"
};

export function PlatformIcon({ platform, size = 20, className, ...props }: PlatformIconProps) {
    const iconSrc = PLATFORM_ICONS[platform.toLowerCase()];
    
    if (!iconSrc) return null;

    return (
        <img
            src={iconSrc}
            width={size}
            height={size}
            alt={PLATFORM_LABELS[platform.toLowerCase()] || platform}
            className={className}
            {...props}
        />
    );
}
