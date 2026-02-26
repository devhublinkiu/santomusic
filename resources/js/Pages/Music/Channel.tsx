import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { BlurFade } from '@/Components/magicui/blur-fade';
import HeroVideoDialog from '@/Components/magicui/hero-video-dialog';
import { Youtube, Play, Star, LayoutGrid, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

interface Video {
    id: number;
    title: string;
    youtube_id: string;
    description: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
}

export default function Channel({ videos }: { videos: Video[] }) {
    return (
        <PublicLayout>
            <Head title="Channel - Santo Music" />

            {/* Header Content */}
            <div className="relative pt-32 pb-12 px-6 md:px-12 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)] pointer-events-none" />
                
                <div className="relative mx-auto max-w-7xl">
                    <BlurFade>
                        <div className="flex flex-col items-center text-center space-y-4 mb-20">
                            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Explore Content</h2>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                                <Youtube className="size-8 text-red-600" />
                                SANTO CHANNEL
                            </h1>
                            <p className="max-w-xl text-zinc-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold leading-relaxed">
                                Presentaciones en vivo, lanzamientos oficiales y contenido exclusivo.
                            </p>
                        </div>
                    </BlurFade>

                    {/* Video Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-16">
                        <AnimatePresence mode='popLayout'>
                            {videos.map((video, idx) => (
                                <motion.div
                                    key={video.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <div className="space-y-5">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 group-hover:border-white/10 transition-all duration-500 shadow-2xl group-hover:shadow-white/5">
                                            <HeroVideoDialog
                                                animationStyle="from-center"
                                                videoSrc={`https://www.youtube.com/embed/${video.youtube_id}`}
                                                thumbnailSrc={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                                thumbnailAlt={video.title}
                                            />
                                            {video.is_featured && (
                                                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 flex items-center gap-1.5">
                                                    <Star className="size-2.5 text-primary fill-primary" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Destacado</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <h4 className="text-sm md:text-base font-black uppercase tracking-tighter text-white group-hover:text-primary transition-colors italic truncate">
                                                    {video.title}
                                                </h4>
                                                <div className="flex items-center gap-1 text-zinc-600 text-[9px] font-bold uppercase shrink-0">
                                                    <Calendar className="size-2.5" />
                                                    {new Date(video.created_at).getFullYear()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-medium uppercase tracking-widest text-zinc-600 truncate">
                                                    {video.description || 'Santo Music Official'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {videos.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-zinc-700 italic uppercase text-xs font-bold tracking-widest">No se encontraron videos disponibles.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
