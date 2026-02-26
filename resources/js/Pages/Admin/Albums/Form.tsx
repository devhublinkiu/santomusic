import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'sonner';
import { ChevronLeft, Save, Music, Image as ImageIcon, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import SongManager from './Partials/SongManager';

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
    description: string | null;
    cover_image_path: string | null;
    release_year: number | null;
    is_published: boolean;
    external_links: Record<string, string> | null;
    songs?: Song[];
}

export default function Form({ album }: { album?: Album }) {
    const isEditing = !!album;
    
    const { data, setData, post, patch, processing, errors } = useForm({
        title: album?.title || '',
        description: album?.description || '',
        release_year: album?.release_year || new Date().getFullYear(),
        is_published: album?.is_published || false,
        cover_image: null as File | null,
        external_links: album?.external_links || {} as Record<string, string>,
    });

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

    const handleLinkChange = (id: string, value: string) => {
        setData('external_links', {
            ...data.external_links,
            [id]: value
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            // Laravel handles PUT/PATCH with files better via POST + _method
            router.post(route('admin.albums.update', album.id), {
                _method: 'patch',
                ...data,
            }, {
                onSuccess: () => toast.success('Álbum actualizado correctamente'),
                preserveScroll: true
            });
        } else {
            post(route('admin.albums.store'), {
                onSuccess: () => toast.success('Álbum creado correctamente'),
            });
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.albums.index')}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="size-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {isEditing ? 'Editar Álbum' : 'Nuevo Álbum'}
                    </h2>
                </div>
            }
        >
            <Head title={isEditing ? `Editar: ${album.title} - Santo Music` : 'Nuevo Álbum - Santo Music'} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Album Details Form */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="gap-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
                                <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                                        Información General
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Título del Álbum</Label>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    placeholder="Ej: Experiencia Musical"
                                                    className="h-10"
                                                />
                                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="release_year" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Año de Lanzamiento</Label>
                                                <Input
                                                    id="release_year"
                                                    type="number"
                                                    value={data.release_year}
                                                    onChange={(e) => setData('release_year', parseInt(e.target.value))}
                                                    className="h-10"
                                                />
                                                {errors.release_year && <p className="text-xs text-red-500">{errors.release_year}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Descripción</Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Breve historia o créditos..."
                                                    className="h-24 resize-none focus-visible:ring-indigo-500"
                                                />
                                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Portada del Álbum</Label>
                                                <div 
                                                    onClick={() => document.getElementById('cover_image')?.click()}
                                                    className={`
                                                        relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed 
                                                        transition-all duration-300 flex flex-col items-center justify-center p-6
                                                        ${data.cover_image || album?.cover_image_path 
                                                            ? 'border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5' 
                                                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'}
                                                    `}
                                                >
                                                    {(album?.cover_image_path || data.cover_image) ? (
                                                        <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
                                                            <img
                                                                src={data.cover_image ? URL.createObjectURL(data.cover_image) : album?.cover_image_path!}
                                                                className="h-full w-full object-cover"
                                                                alt="Preview"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ImageIcon className="size-6 text-white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                                                            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-colors">
                                                                <Plus className="size-6 text-zinc-400 group-hover:text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Elegir portada</p>
                                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mt-1">PNG, JPG máx 2MB</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <input
                                                        id="cover_image"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                                                    />
                                                </div>
                                                {errors.cover_image && <p className="text-xs text-red-500">{errors.cover_image}</p>}
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/40">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="is_published" className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Estado Público</Label>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                                                        {data.is_published ? 'Visible ahora' : 'Solo Admin'}
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="is_published"
                                                    checked={data.is_published}
                                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                                />
                                            </div>
                                        </div>

                                        {/* External Links Card */}
                                        <Card className="gap-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm mt-8">
                                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                                                        Vínculos Externos
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mt-1">
                                                    Enlaces a plataformas de streaming
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    {STREAMING_PLATFORMS.map((platform) => (
                                                        <div key={platform.id} className="space-y-1.5">
                                                            <Label 
                                                                htmlFor={`link-${platform.id}`} 
                                                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                                                            >
                                                                {platform.label}
                                                            </Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id={`link-${platform.id}`}
                                                                    value={data.external_links?.[platform.id] || ''}
                                                                    onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                                                                    placeholder={`https://${platform.id}.com/...`}
                                                                    className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                                            >
                                                {processing ? 'Guardando...' : (isEditing ? 'Actualizar Álbum' : 'Crear Álbum')}
                                                {!processing && <Save className="ml-2 size-4" />}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Songs Management Section */}
                        <div className="lg:col-span-2">
                            {isEditing ? (
                                <SongManager album={album} />
                            ) : (
                                <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl min-h-[400px] flex items-center justify-center text-center p-12">
                                    <div className="space-y-4">
                                        <div className="mx-auto size-16 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <Music className="size-8 text-zinc-600" />
                                        </div>
                                        <CardTitle>Cargar Canciones</CardTitle>
                                        <CardDescription className="max-w-xs mx-auto">
                                            Primero debes crear el álbum antes de poder subir y gestionar las pistas de audio.
                                        </CardDescription>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Inline router import needed for custom router call
import { router } from '@inertiajs/react';
