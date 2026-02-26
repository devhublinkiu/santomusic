import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Song {
    id: number;
    title: string;
    audio_path: string;
    duration: number | null;
    album?: {
        title: string;
        cover_image_path: string | null;
    };
}

interface MusicContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    playSong: (song: Song, playlist?: Song[]) => void;
    togglePlay: () => void;
    playlist: Song[];
    progress: number;
    duration: number;
    setProgress: (val: number) => void;
    volume: number;
    setVolume: (val: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    isLooping: boolean;
    setIsLooping: (val: boolean) => void;
    isShuffled: boolean;
    setIsShuffled: (val: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1); // Default to full volume
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = () => {
                if (isLooping) {
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                    }
                } else {
                    playNext();
                }
            };
            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    setProgress(audioRef.current.currentTime);
                    setDuration(audioRef.current.duration);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.src = currentSong.audio_path;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playSong = (song: Song, newPlaylist?: Song[]) => {
        setCurrentSong(song);
        if (newPlaylist) setPlaylist(newPlaylist);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const playNext = () => {
        if (playlist.length === 0 || !currentSong) return;
        
        let nextSong;
        if (isShuffled && playlist.length > 1) {
            const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
            const otherSongs = playlist.filter((_, idx) => idx !== currentIndex);
            nextSong = otherSongs[Math.floor(Math.random() * otherSongs.length)];
        } else {
            const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
            const nextIndex = (currentIndex + 1) % playlist.length;
            nextSong = playlist[nextIndex];
        }
        
        setCurrentSong(nextSong);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        if (playlist.length === 0 || !currentSong) return;
        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentSong(playlist[prevIndex]);
        setIsPlaying(true);
    };

    const seek = (val: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = val;
            setProgress(val);
        }
    };

    return (
        <MusicContext.Provider value={{
            currentSong,
            isPlaying,
            playSong,
            togglePlay,
            playlist,
            progress,
            duration,
            setProgress: seek,
            volume,
            setVolume,
            playNext,
            playPrevious,
            isLooping,
            setIsLooping,
            isShuffled,
            setIsShuffled
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within a MusicProvider');
    return context;
};
