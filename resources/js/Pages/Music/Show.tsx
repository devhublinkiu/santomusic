import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { Music, Play, Pause, Clock, ChevronLeft } from 'lucide-react';
import { useMusic } from '@/Contexts/MusicContext';
import { Button } from '@/Components/ui/button';
import { PlatformIcon } from '@/Components/Music/PlatformIcons';
import { motion } from 'framer-motion';

interface Song {
    id: number;
    title: string;
    audio_path: string;
    duration: number | null;
    order: number;
    external_links?: Record<string, string> | null;
}

interface Album {
    id: number;
    title: string;
    description: string | null;
    cover_image_path: string | null;
    release_year: number | null;
    external_links?: Record<string, string> | null;
    songs: Song[];
}

export default function Show({ album }: { album: Album }) {
    const { playSong, currentSong, isPlaying } = useMusic();

    const handlePlayAll = () => {
        if (album.songs.length > 0) {
            playSong(album.songs[0], album.songs);
        }
    };

    const handlePlaySong = (song: Song) => {
        const songWithAlbum = {
            ...song,
            album: {
                title: album.title,
                cover_image_path: album.cover_image_path
            }
        };
        playSong(songWithAlbum, album.songs);
    };

    const PLATFORMS = [
        { id: 'spotify', label: 'Spotify', color: '#1DB954' },
        { id: 'youtube', label: 'YouTube', color: '#FF0000' },
        { id: 'apple', label: 'Apple Music', color: '#FA243C' },
        { id: 'deezer', label: 'Deezer', color: '#EF5466' },
        { id: 'soundcloud', label: 'SoundCloud', color: '#FF3300' },
        { id: 'tidal', label: 'Tidal', color: '#000000' },
        { id: 'amazon', label: 'Amazon', color: '#00A8E1' },
        { id: 'bandcamp', label: 'Bandcamp', color: '#629AA9' },
    ];

    return (
        <PublicLayout>
            <Head title={`${album.title} - Santo Music`} />

            <div className="py-24 px-6 md:px-12">
                <div className="mx-auto max-w-6xl">
                    {/* Back link */}
                    <Link 
                        href={route('music.index')} 
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest mb-12"
                    >
                        <ChevronLeft className="size-4" />
                        Volver al catálogo
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Left Side: Cover & Info */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="relative max-w-[280px] mx-auto lg:mx-0">
                                <BlurFade>
                                    <div className="relative">
                                        {/* Vinyl Disk Peek Effect */}
                                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 size-[90%] rounded-full bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:right-[-25%] group-hover:rotate-12 overflow-hidden opacity-0 group-hover:opacity-100 hidden md:block">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.03)_41%,_transparent_42%)] opacity-30" />
                                            <div className="absolute inset-x-0 top-0 bottom-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent,_rgba(255,255,255,0.05),_transparent)] opacity-20" />
                                        </div>

                                        {/* Cover Container */}
                                        <motion.div 
                                            whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
                                            className="relative aspect-square overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 z-10 bg-zinc-900 border border-white/10 group"
                                            style={{ perspective: 1000 }}
                                        >
                                            {album.cover_image_path ? (
                                                <img 
                                                    src={album.cover_image_path} 
                                                    alt={album.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Music className="size-24 text-zinc-800" />
                                                </div>
                                            )}
                                            
                                            {/* Plastic Wrap Sheen */}
                                            <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.4)_100%)]" />
                                        </motion.div>
                                    </div>
                                </BlurFade>
                            </div>

                            <BlurFade delay={0.1}>
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 text-white">
                                            {album.title}
                                        </h1>
                                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 tracking-[0.2em] uppercase">
                                            <span>{album.release_year}</span>
                                            <span>•</span>
                                            <span>{album.songs.length} Canciones</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-zinc-400 text-sm leading-relaxed italic border-l-2 border-white/10 pl-4">
                                        {album.description || 'Sin descripción disponible.'}
                                    </p>

                                    <Button 
                                        onClick={handlePlayAll}
                                        className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl"
                                    >
                                        <Play className="mr-2 size-5 fill-current" />
                                        Escuchar álbum completo
                                    </Button>

                                    {/* Album External Links */}
                                    {album.external_links && Object.keys(album.external_links).length > 0 && (
                                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                                            {PLATFORMS.filter(p => album.external_links?.[p.id]).map((platform) => (
                                                <a 
                                                    key={platform.id}
                                                    href={album.external_links?.[platform.id]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/icon flex items-center justify-center size-10 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-300"
                                                    title={`Escuchar en ${platform.label}`}
                                                >
                                                    <PlatformIcon 
                                                        platform={platform.id} 
                                                        size={18} 
                                                        className="grayscale group-hover/icon:grayscale-0 transition-all duration-500"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </BlurFade>
                        </div>

                        {/* Lado derecho: Lista de canciones */}
                        <div className="lg:col-span-8">
                            <BlurFade delay={0.2}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-6 py-4 text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-600 border-b border-white/5 mb-4">
                                        <span>Lista de canciones</span>
                                        <div className="flex items-center gap-4">
                                            <Clock className="size-3" />
                                        </div>
                                    </div>

                                    {album.songs.length === 0 ? (
                                        <div className="text-center py-20 text-zinc-700 italic">
                                            Este álbum aún no tiene canciones cargadas.
                                        </div>
                                    ) : (
                                        album.songs.map((song, idx) => {
                                            const isCurrent = currentSong?.id === song.id;
                                            return (
                                                <div 
                                                    key={song.id}
                                                    onClick={() => handlePlaySong(song)}
                                                    className={`
                                                        group flex items-center justify-between px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300
                                                        ${isCurrent ? 'bg-white/5 border-white/10' : 'hover:bg-white/[0.02] border-transparent'}
                                                        border
                                                    `}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-5 flex items-center justify-center text-zinc-700 font-mono text-[10px] group-hover:text-zinc-500 transition-colors">
                                                            {isCurrent ? (
                                                                <div className="flex items-center gap-0.5 h-3">
                                                                    {[...Array(3)].map((_, i) => (
                                                                        <div 
                                                                            key={i} 
                                                                            className="w-0.5 bg-indigo-500 animate-music-bar" 
                                                                            style={{ 
                                                                                height: '100%',
                                                                                animationDelay: `${i * 0.15}s`,
                                                                                boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                                                                            }} 
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                String(idx + 1).padStart(2, '0')
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-sm font-bold tracking-tight uppercase group-hover:translate-x-1 transition-transform ${isCurrent ? 'text-indigo-400' : 'text-zinc-200'}`}>
                                                                {song.title}
                                                            </h4>
                                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                                                Versión Original
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-5">
                                                        {/* Song External Links */}
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                            {PLATFORMS.filter(p => song.external_links?.[p.id]).map((platform) => (
                                                                <a 
                                                                    key={platform.id}
                                                                    href={song.external_links?.[platform.id]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="size-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    title={`Escuchar en ${platform.label}`}
                                                                >
                                                                    <PlatformIcon 
                                                                        platform={platform.id} 
                                                                        size={12} 
                                                                        className="text-zinc-500 hover:text-white transition-colors"
                                                                    />
                                                                </a>
                                                            ))}
                                                        </div>

                                                        <div className={`size-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${isCurrent ? 'bg-indigo-500 text-white opacity-100' : 'bg-transparent text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black'}`}>
                                                            {isCurrent ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current ml-0.5" />}
                                                        </div>
                                                        
                                                        <div className="w-10 text-right">
                                                            <span className="text-[10px] tabular-nums text-zinc-600 font-medium">
                                                                {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
