import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { Music, Calendar, Play, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlatformIcon } from '@/Components/Music/PlatformIcons';

interface Album {
    id: number;
    title: string;
    description: string;
    cover_image_path: string;
    release_year: number;
    songs_count: number;
    external_links?: Record<string, string> | null;
}

export default function Index({ albums }: { albums: Album[] }) {
    return (
        <PublicLayout>
            <Head title="Música" />

            <div className="py-24 px-6 md:px-12">
                <div className="mx-auto max-w-7xl">
                    <BlurFade>
                        <header className="mb-16 text-center">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
                                Santo <span className="text-zinc-500 italic">Music</span>
                            </h1>
                        </header>
                    </BlurFade>

                    {albums.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl">
                            <Music className="size-12 text-zinc-800 mx-auto mb-4" />
                            <p className="text-zinc-600 font-medium tracking-widest uppercase text-sm">
                                No se encontraron álbumes publicados.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {albums.map((album, idx) => (
                                <BlurFade key={album.id} delay={idx * 0.1}>
                                    <Link href={route('music.show', album.id)} className="group block">
                                        <div className="relative mb-8">
                                            {/* Vinyl Disk Peek Effect */}
                                            <div className="absolute top-1/2 -right-4 -translate-y-1/2 size-[90%] rounded-full bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:right-[-20%] group-hover:rotate-12 overflow-hidden opacity-0 group-hover:opacity-100 hidden md:block">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.03)_41%,_transparent_42%)] opacity-30" />
                                                <div className="absolute inset-x-0 top-0 bottom-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent,_rgba(255,255,255,0.05),_transparent)] opacity-20" />
                                            </div>

                                            {/* Cover Container */}
                                            <motion.div 
                                                whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
                                                className="relative aspect-square overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 z-10 bg-zinc-900 border border-white/10"
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
                                                        <Music className="size-20 text-zinc-800" />
                                                    </div>
                                                )}
                                                
                                                {/* Plastic Wrap Sheen */}
                                                <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.4)_100%)]" />

                                                {/* Play Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                    <div className="size-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                                        <Play className="size-8 fill-current ml-1" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        
                                        <div className="space-y-3 px-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase leading-tight">
                                                        {album.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                                                            Masterizado {album.release_year}
                                                        </span>
                                                        <span className="size-1 rounded-full bg-zinc-800" />
                                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                            {album.songs_count} Canciones
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Links */}
                                            {album.external_links && Object.keys(album.external_links).length > 0 && (
                                                <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                    {['spotify', 'youtube', 'apple'].filter(id => album.external_links?.[id]).map(id => (
                                                        <div key={id} className="size-6 flex items-center justify-center rounded bg-zinc-900 border border-white/5 hover:border-white/20 transition-all">
                                                            <PlatformIcon platform={id} size={12} className="text-zinc-500 hover:text-white" />
                                                        </div>
                                                    ))}
                                                    <div className="ml-auto flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                                        Ver detalles <ExternalLink className="size-2" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </BlurFade>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
