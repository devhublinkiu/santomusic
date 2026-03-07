import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Edit, Trash2, Music, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { BlurFade } from '@/Components/magicui/blur-fade';

interface Album {
    id: number;
    title: string;
    description: string;
    cover_image_path: string;
    release_year: number;
    is_published: boolean;
    songs_count: number;
}

export default function Index({ albums }: { albums: Album[] }) {
    const deleteAlbum = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este álbum? Todas las canciones asociadas se borrarán.')) {
            router.delete(route('admin.albums.destroy', id));
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Gestión de Álbumes
                    </h2>
                    <Link href={route('admin.albums.create')}>
                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="size-4" />
                            Nuevo Álbum
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Admin: Álbumes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {albums.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="size-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6">
                                <Music className="size-8 text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Biblioteca vacía</h3>
                            <p className="text-zinc-500 mt-1 mb-8">No hay álbumes creados todavía.</p>
                            <Link href={route('admin.albums.create')}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8">
                                    <Plus className="size-4 mr-2" />
                                    Crear mi primer álbum
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {albums.map((album, idx) => (
                                <BlurFade key={album.id} delay={idx * 0.1}>
                                    <Card className="p-0 gap-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all duration-300 hover:shadow-md group">
                                        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-900">
                                            {album.cover_image_path ? (
                                                <img
                                                    src={album.cover_image_path}
                                                    alt={album.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Music className="size-16 text-zinc-200 dark:text-zinc-800" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-2 right-2 z-10">
                                                {album.is_published ? (
                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200 dark:border-green-500/20 shadow-sm">
                                                        <CheckCircle2 className="size-3" />
                                                        Publicado
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                        <XCircle className="size-3" />
                                                        Borrador
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <CardHeader className="p-4 space-y-1">
                                            <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{album.title}</CardTitle>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium tracking-tight">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3" />
                                                    {album.release_year}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Music className="size-3" />
                                                    {album.songs_count} Canciones
                                                </span>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardFooter className="grid grid-cols-2 gap-2 p-4">
                                            <Link href={route('admin.albums.edit', album.id)} className="w-full">
                                                <Button variant="outline" className="w-full h-9 gap-2 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                    <Edit className="size-3.5" />
                                                    Editar
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                onClick={() => deleteAlbum(album.id)}
                                                className="w-full h-9 gap-2 text-xs font-semibold border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                            >
                                                <Trash2 className="size-3.5" />
                                                Eliminar
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </BlurFade>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
