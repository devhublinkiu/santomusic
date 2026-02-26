import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Badge } from '@/Components/ui/badge';
import { useState } from 'react';
import { Plus, Youtube, Trash2, Edit2, Play, Search, Video, Star, Eye, EyeOff, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface VideoData {
    id: number;
    title: string;
    youtube_id: string;
    description: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
}

export default function VideosIndex({ videos }: { videos: VideoData[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        title: '',
        youtube_url: '',
        description: '',
        is_featured: false,
        is_published: true,
    });

    const handleSync = () => {
        setIsSyncing(true);
        post(route('admin.videos.sync'), {
            onSuccess: () => {
                toast.success('Sincronización completada');
                setIsSyncing(false);
            },
            onError: () => {
                toast.error('Error al sincronizar con YouTube');
                setIsSyncing(false);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVideo) {
            put(route('admin.videos.update', editingVideo.id), {
                onSuccess: () => {
                    toast.success('Video actualizado');
                    setIsAddModalOpen(false);
                    setEditingVideo(null);
                    reset();
                }
            });
        } else {
            post(route('admin.videos.store'), {
                onSuccess: () => {
                    toast.success('Video añadido');
                    setIsAddModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (video: VideoData) => {
        setEditingVideo(video);
        setData({
            title: video.title,
            youtube_url: `https://www.youtube.com/watch?v=${video.youtube_id}`,
            description: video.description || '',
            is_featured: video.is_featured,
            is_published: video.is_published,
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este video?')) {
            destroy(route('admin.videos.destroy', id), {
                onSuccess: () => toast.success('Video eliminado')
            });
        }
    };

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Gestión de Canal</h2>}
        >
            <Head title="Videos - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Youtube className="size-5 text-indigo-500" />
                                    Biblioteca de Videos
                                </CardTitle>
                                <CardDescription>
                                    Gestiona los videos de tu canal de YouTube y sincroniza las novedades.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Canal'}
                                </Button>

                                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                                    setIsAddModalOpen(open);
                                    if (!open) {
                                        setEditingVideo(null);
                                        reset();
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                            <Plus className="size-4" /> Nuevo Video
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingVideo ? 'Editar Video' : 'Añadir Video'}
                                            </DialogTitle>
                                            <DialogDescription>
                                                Ingresa los detalles del video de YouTube para mostrarlo en tu galería.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Título del Video</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="h-10"
                                                placeholder="Ej: Santo Music - Live Session"
                                                required
                                            />
                                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="youtube_url">YouTube URL o ID</Label>
                                            <Input
                                                id="youtube_url"
                                                value={data.youtube_url}
                                                onChange={(e) => setData('youtube_url', e.target.value)}
                                                className="h-10"
                                                placeholder="https://youtube.com/watch?v=..."
                                                required
                                            />
                                            {errors.youtube_url && <p className="text-xs text-red-500">{errors.youtube_url}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción (Opcional)</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="min-h-[100px] resize-none"
                                            placeholder="Breve descripción del video..."
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                            <div className="space-y-0.5">
                                                <Label className="text-xs">Destacado</Label>
                                                <p className="text-[10px] text-muted-foreground">Mostrar al inicio</p>
                                            </div>
                                            <Switch
                                                checked={data.is_featured}
                                                onCheckedChange={(val) => setData('is_featured', val)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                            <div className="space-y-0.5">
                                                <Label className="text-xs">Publicado</Label>
                                                <p className="text-[10px] text-muted-foreground">Visible en la web</p>
                                            </div>
                                            <Switch
                                                checked={data.is_published}
                                                onCheckedChange={(val) => setData('is_published', val)}
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {processing ? 'Procesando...' : (editingVideo ? 'Guardar Cambios' : 'Añadir Video')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Vista Previa</TableHead>
                                        <TableHead>Detalles</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-muted-foreground text-xs">
                                                No hay videos en la biblioteca.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        videos.map((video) => (
                                            <TableRow key={video.id} className="group transition-colors">
                                                <TableCell>
                                                    <div className="relative aspect-video w-24 bg-black rounded-lg overflow-hidden border border-border">
                                                        <img
                                                            src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold uppercase tracking-tight">
                                                                {video.title}
                                                            </span>
                                                            {video.is_featured && (
                                                                <Star className="size-3 text-amber-500 fill-amber-500" />
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-mono text-muted-foreground">
                                                            ID: {video.youtube_id}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={video.is_published ? "outline" : "secondary"} className="uppercase tracking-widest text-[9px] font-bold">
                                                        {video.is_published ? 'Publicado' : 'Borrador'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(video)}
                                                            className="size-10 rounded-xl hover:bg-foreground hover:text-background transition-all"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center size-10 hover:bg-muted border border-transparent hover:border-border rounded-xl transition-all text-muted-foreground hover:text-foreground"
                                                        >
                                                            <ExternalLink className="size-4" />
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(video.id)}
                                                            className="size-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
