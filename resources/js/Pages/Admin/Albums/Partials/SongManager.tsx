import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Music, Plus, Trash2, GripVertical, Play, Pause, Loader2, Music4, Link2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { toast } from 'sonner';

interface Song {
    id: number;
    title: string;
    audio_path: string;
    duration: number | null;
    order: number;
    external_links: Record<string, string> | null;
}

interface Album {
    id: number;
    title: string;
    songs?: Song[];
}

export default function SongManager({ album }: { album: Album }) {
    const [uploading, setUploading] = useState(false);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useState<HTMLAudioElement | null>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        audio: null as File | null,
        duration: null as number | null,
    });

    const addSong = (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        post(route('admin.songs.store', album.id), {
            onSuccess: () => {
                toast.success('Canción añadida');
                reset();
                setUploading(false);
            },
            onError: () => setUploading(false),
            preserveScroll: true,
        });
    };

    const deleteSong = (id: number) => {
        if (confirm('¿Eliminar esta canción?')) {
            router.delete(route('admin.songs.destroy', id), {
                onSuccess: () => toast.success('Canción eliminada'),
                preserveScroll: true,
            });
        }
    };

    const togglePlay = (song: Song) => {
        if (playingId === song.id) {
            setPlayingId(null);
        } else {
            setPlayingId(song.id);
        }
    };

    const STREAMING_PLATFORMS = [
        { id: 'spotify', label: 'Spotify' },
        { id: 'youtube', label: 'YouTube Music' },
        { id: 'apple', label: 'Apple Music' },
        { id: 'deezer', label: 'Deezer' },
        { id: 'soundcloud', label: 'SoundCloud' },
        { id: 'tidal', label: 'Tidal' },
        { id: 'amazon', label: 'Amazon Music' },
        { id: 'bandcamp', label: 'Bandcamp' },
    ];

    const updateSongLinks = (song: Song, platformId: string, value: string) => {
        const newLinks = { ...(song.external_links || {}), [platformId]: value };
        router.patch(route('admin.songs.update', song.id), {
            title: song.title,
            order: song.order,
            external_links: newLinks
        }, {
            onSuccess: () => toast.success('Enlaces actualizados'),
            preserveScroll: true
        });
    };

    return (
        <Card className="gap-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Lista de canciones</CardTitle>
                        <CardDescription className="text-xs font-medium text-zinc-500">Gestiona las canciones de este álbum</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                        <Music4 className="size-3" />
                        {album.songs?.length || 0} Canciones
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Upload Form */}
                <form onSubmit={addSong} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 space-y-5 shadow-inner">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="song_title" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Título de la Canción</Label>
                            <Input
                                id="song_title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Nombre de la pista..."
                                className="h-10 bg-white dark:bg-black/50"
                            />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Archivo de Audio</Label>
                            <div 
                                onClick={() => document.getElementById('audio_file')?.click()}
                                className={`
                                    relative cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700 h-10 flex items-center px-3 gap-2 transition-all
                                    ${data.audio ? 'border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-500/10' : 'bg-white dark:bg-black/50 hover:border-zinc-300 dark:hover:border-zinc-600'}
                                `}
                            >
                                <Plus className={`size-3.5 ${data.audio ? 'text-indigo-600' : 'text-zinc-400'}`} />
                                <span className={`text-xs font-medium truncate flex-1 ${data.audio ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-500'}`}>
                                    {data.audio ? data.audio.name : 'Seleccionar MP3...'}
                                </span>
                                <input
                                    id="audio_file"
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('audio', file);
                                        
                                        if (file) {
                                            const audio = new Audio();
                                            audio.src = URL.createObjectURL(file);
                                            audio.onloadedmetadata = () => {
                                                setData(prev => ({
                                                    ...prev,
                                                    audio: file,
                                                    duration: Math.round(audio.duration)
                                                }));
                                                URL.revokeObjectURL(audio.src);
                                            };
                                        }
                                    }}
                                />
                            </div>
                            {errors.audio && <p className="text-xs text-red-500">{errors.audio}</p>}
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={processing || !data.audio || !data.title}
                        className="w-full bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-950 hover:bg-black dark:hover:bg-zinc-200 h-10 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.98]"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin text-indigo-500" />
                                Subiendo a Bunny.net...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 size-4" />
                                Agregar pista
                            </>
                        )}
                    </Button>
                </form>

                {/* Song List */}
                <div className="space-y-2.5">
                    {album.songs?.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
                            <Music className="size-10 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                Lista de reproducción vacía
                            </p>
                        </div>
                    ) : (
                        album.songs?.map((song, idx) => (
                            <div 
                                key={song.id} 
                                className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="text-zinc-300 dark:text-zinc-700 font-mono text-xs w-5 text-center font-bold">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-9 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
                                        onClick={() => togglePlay(song)}
                                    >
                                        {playingId === song.id ? <Pause className="size-4" /> : <Play className="size-4 fill-current ml-0.5" />}
                                    </Button>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{song.title}</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                                                Versión Masterizada
                                            </p>
                                            {song.duration && (
                                                <span className="text-[9px] text-zinc-400 font-bold font-mono">
                                                    {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {playingId === song.id && (
                                        <div className="flex items-center gap-1 h-3.5 px-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-0.5 h-2 bg-indigo-500 animate-music-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-9 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                                            onClick={() => deleteSong(song.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                        
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`size-9 rounded-lg ${Object.keys(song.external_links || {}).length > 0 ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-zinc-400'}`}
                                                >
                                                    <Link2 className="size-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-4 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl mr-4" align="end">
                                                <div className="space-y-3">
                                                    <div className="pb-2 border-b border-zinc-100 dark:border-zinc-900">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Enlaces Streaming</h4>
                                                        <p className="text-[10px] text-zinc-500 mt-0.5">Configura los links para esta canción</p>
                                                    </div>
                                                    <div className="grid gap-3 pt-1 max-h-[300px] overflow-y-auto px-1">
                                                        {STREAMING_PLATFORMS.map((platform) => (
                                                            <div key={platform.id} className="grid gap-1.5">
                                                                <Label htmlFor={`song-${song.id}-link-${platform.id}`} className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                                                                    {platform.label}
                                                                </Label>
                                                                <Input
                                                                    id={`song-${song.id}-link-${platform.id}`}
                                                                    defaultValue={song.external_links?.[platform.id] || ''}
                                                                    className="h-8 text-xs bg-zinc-50 dark:bg-black/40"
                                                                    placeholder="URL de la plataforma..."
                                                                    onBlur={(e) => {
                                                                        if (e.target.value !== (song.external_links?.[platform.id] || '')) {
                                                                            updateSongLinks(song, platform.id, e.target.value);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <div className="cursor-grab active:cursor-grabbing p-2.5 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 transition-colors">
                                            <GripVertical className="size-4.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
