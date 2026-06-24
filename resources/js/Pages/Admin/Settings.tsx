import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { Settings, Image as ImageIcon, CheckCircle2, Phone, Mail, Film, RefreshCw, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { uploadToBunny, MAX_BYTES } from '@/lib/bunnyUpload';
import HlsVideo from '@/Components/HlsVideo';

interface SiteSettings {
    logo_vertical: string | null;
    logo_home: string | null;
    app_profile: string | null;
    logo_app: string | null;
    favicon: string | null;
    hero_background: string | null;
    whatsapp_number: string | null;
    contact_recipient: string | null;
    wedding_hero_poster: string | null;
    wedding_hero_video_guid: string | null;
    wedding_hero_video_status: string | null;
}

export default function SettingsPage({ settings, heroHls, heroReady }: { settings: SiteSettings, heroHls: string | null, heroReady: boolean }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        logo_vertical: null as File | null,
        logo_home: null as File | null,
        app_profile: null as File | null,
        logo_app: null as File | null,
        favicon: null as File | null,
        hero_background: null as File | null,
        wedding_hero_poster: null as File | null,
        whatsapp_number: settings.whatsapp_number || '',
        contact_recipient: settings.contact_recipient || '',
    });

    // Subida del video del hero (directo a Bunny Stream vía TUS)
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroUploading, setHeroUploading] = useState(false);
    const [heroPct, setHeroPct] = useState(0);

    // Scrubber de portada del hero por frame
    const heroVideoRef = useRef<HTMLVideoElement>(null);
    const [settingHeroThumb, setSettingHeroThumb] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => {
                toast.success('Configuración actualizada correctamente');
            },
            onError: () => {
                toast.error('Hubo un error al actualizar la configuración');
            }
        });
    };

    const handleHeroVideo = async () => {
        if (!heroFile) return;
        if (heroFile.size > MAX_BYTES) {
            toast.error('El video supera el límite de 5GB.');
            return;
        }
        setHeroUploading(true);
        setHeroPct(0);
        try {
            const { data: res } = await axios.post(route('admin.settings.hero-video'));
            await uploadToBunny(heroFile, res.upload, setHeroPct);
            toast.success('Video del hero subido. Bunny lo está procesando.');
            setHeroFile(null);
            router.reload({ only: ['settings'] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || 'Error al subir el video del hero.');
        } finally {
            setHeroUploading(false);
        }
    };

    const refreshHero = () => {
        router.post(route('admin.settings.hero-refresh'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado del hero actualizado'),
        });
    };

    const handleHeroThumbnail = async () => {
        if (!heroVideoRef.current) return;
        const ms = Math.floor((heroVideoRef.current.currentTime || 0) * 1000);
        setSettingHeroThumb(true);
        try {
            await axios.post(route('admin.settings.hero-thumbnail'), { time_ms: ms });
            toast.success('Portada del hero actualizada (puede tardar unos segundos en verse).');
            router.reload({ only: ['settings'] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'No se pudo cambiar la portada del hero.');
        } finally {
            setSettingHeroThumb(false);
        }
    };

    // Auto-actualización del estado del video del hero: se detiene solo al estar "Listo".
    useEffect(() => {
        if (settings.wedding_hero_video_status !== 'processing') return;
        const id = setInterval(() => {
            router.post(route('admin.settings.hero-refresh'), {}, {
                preserveScroll: true,
                preserveState: true,
                only: ['settings', 'heroHls', 'heroReady'],
            });
        }, 8000);
        return () => clearInterval(id);
    }, [settings.wedding_hero_video_status]);

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Configuración del Sitio
                </h2>
            }
        >
            <Head title="Admin: Ajustes" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Settings className="size-5 text-indigo-500" />
                                <CardTitle>Logos y Perfiles</CardTitle>
                            </div>
                            <CardDescription>
                                Gestiona las imágenes principales que se muestran en la plataforma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Logo Vertical */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_vertical">Logo Vertical</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                            {settings.logo_vertical && !data.logo_vertical && (
                                                <img src={settings.logo_vertical} alt="Vertical" className="h-20 object-contain" />
                                            )}
                                            <Input
                                                id="logo_vertical"
                                                type="file"
                                                className="cursor-pointer"
                                                onChange={(e) => setData('logo_vertical', e.target.files?.[0] || null)}
                                            />
                                            {errors.logo_vertical && <p className="text-xs text-red-500">{errors.logo_vertical}</p>}
                                        </div>
                                    </div>

                                    {/* Logo Home */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_home">Logo Home</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                            {settings.logo_home && !data.logo_home && (
                                                <img src={settings.logo_home} alt="Home" className="h-20 object-contain" />
                                            )}
                                            <Input
                                                id="logo_home"
                                                type="file"
                                                className="cursor-pointer"
                                                onChange={(e) => setData('logo_home', e.target.files?.[0] || null)}
                                            />
                                            {errors.logo_home && <p className="text-xs text-red-500">{errors.logo_home}</p>}
                                        </div>
                                    </div>

                                    {/* Perfil App */}
                                    <div className="space-y-2">
                                        <Label htmlFor="app_profile">Perfil App (Avatar)</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                            {settings.app_profile && !data.app_profile && (
                                                <img src={settings.app_profile} alt="Profile" className="size-20 rounded-full object-cover" />
                                            )}
                                            <Input
                                                id="app_profile"
                                                type="file"
                                                className="cursor-pointer"
                                                onChange={(e) => setData('app_profile', e.target.files?.[0] || null)}
                                            />
                                            {errors.app_profile && <p className="text-xs text-red-500">{errors.app_profile}</p>}
                                        </div>
                                    </div>

                                    {/* Logo Aplicación */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_app">Logo Aplicación</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                            {settings.logo_app && !data.logo_app && (
                                                <img src={settings.logo_app} alt="App" className="h-20 object-contain" />
                                            )}
                                            <Input
                                                id="logo_app"
                                                type="file"
                                                className="cursor-pointer"
                                                onChange={(e) => setData('logo_app', e.target.files?.[0] || null)}
                                            />
                                            {errors.logo_app && <p className="text-xs text-red-500">{errors.logo_app}</p>}
                                        </div>
                                    </div>

                                    {/* Favicon */}
                                    <div className="space-y-2">
                                        <Label htmlFor="favicon">Favicon</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                            {settings.favicon && !data.favicon && (
                                                <img src={settings.favicon} alt="Favicon" className="size-10 object-contain" />
                                            )}
                                            <Input
                                                id="favicon"
                                                type="file"
                                                accept=".ico,.png,.svg,image/*"
                                                className="cursor-pointer"
                                                onChange={(e) => setData('favicon', e.target.files?.[0] || null)}
                                            />
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                .ico, .png o .svg — recomendado 32x32 o 64x64px.
                                            </p>
                                            {errors.favicon && <p className="text-xs text-red-500">{errors.favicon}</p>}
                                        </div>
                                    </div>

                                    {/* Home Hero Background */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="hero_background">Fondo Home (Imagen o Video)</Label>
                                        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-6 dark:border-zinc-800">
                                            {settings.hero_background && !data.hero_background && (
                                                <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                                                    {settings.hero_background.match(/\.(mp4|mov|webm)$/i) ? (
                                                        <video src={settings.hero_background} className="w-full aspect-video object-cover" controls muted />
                                                    ) : (
                                                        <img src={settings.hero_background} alt="Hero Background" className="w-full aspect-video object-cover" />
                                                    )}
                                                </div>
                                            )}
                                            <Input
                                                id="hero_background"
                                                type="file"
                                                className="cursor-pointer"
                                                accept="image/*,video/*"
                                                onChange={(e) => setData('hero_background', e.target.files?.[0] || null)}
                                            />
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                Recomendado: 1920x1080px. Máx 20MB para videos.
                                            </p>
                                            {errors.hero_background && <p className="text-xs text-red-500">{errors.hero_background}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Hero de Bodas */}
                                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Film className="size-5 text-pink-500" />
                                        <h3 className="text-lg font-medium">Hero de Bodas</h3>
                                    </div>
                                    <p className="text-xs text-zinc-500 mb-4">
                                        Portada y video destacado que aparece arriba en la página pública de bodas. Se muestra cuando el video está <strong>«Listo»</strong> o cuando subís una <strong>imagen de portada</strong> (la imagen tiene prioridad). Mientras el video esté «Procesando», el hero no aparece todavía.
                                    </p>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Portada (imagen) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="wedding_hero_poster">Portada (imagen)</Label>
                                            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                                {settings.wedding_hero_poster && !data.wedding_hero_poster && (
                                                    <img src={settings.wedding_hero_poster} alt="Portada hero" className="w-full max-w-xs aspect-video rounded-lg object-cover" />
                                                )}
                                                <Input
                                                    id="wedding_hero_poster"
                                                    type="file"
                                                    accept="image/*"
                                                    className="cursor-pointer"
                                                    onChange={(e) => setData('wedding_hero_poster', e.target.files?.[0] || null)}
                                                />
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                    Se guarda al presionar "Guardar Cambios".
                                                </p>
                                                {errors.wedding_hero_poster && <p className="text-xs text-red-500">{errors.wedding_hero_poster}</p>}
                                            </div>
                                        </div>

                                        {/* Video del hero (Bunny Stream) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="hero_video">Video del hero</Label>
                                            <div className="flex flex-col gap-3 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-zinc-500">Estado:</span>
                                                    {!settings.wedding_hero_video_guid ? (
                                                        <span className="text-xs text-zinc-400">Sin video</span>
                                                    ) : settings.wedding_hero_video_status === 'ready' ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500"><CheckCircle2 className="size-3" /> Listo</span>
                                                    ) : settings.wedding_hero_video_status === 'error' ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle className="size-3" /> Error</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500"><Clock className="size-3 animate-pulse" /> Procesando…</span>
                                                    )}
                                                    {settings.wedding_hero_video_guid && settings.wedding_hero_video_status !== 'ready' && (
                                                        <Button type="button" variant="ghost" size="icon" className="size-7" title="Sincronizar estado" onClick={refreshHero}>
                                                            <RefreshCw className="size-3.5 text-zinc-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                                {settings.wedding_hero_video_guid && settings.wedding_hero_video_status === 'processing' && (
                                                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
                                                        El video se está procesando en la nube. Se actualiza solo — podés esperar acá o volver más tarde.
                                                    </p>
                                                )}
                                                <Input
                                                    id="hero_video"
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                                                />
                                                {heroUploading && (
                                                    <div className="space-y-1">
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${heroPct}%` }} />
                                                        </div>
                                                        <p className="text-xs text-zinc-500">Subiendo… {heroPct}%</p>
                                                    </div>
                                                )}
                                                <Button type="button" variant="secondary" disabled={!heroFile || heroUploading} onClick={handleHeroVideo}>
                                                    {heroUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Subir video del hero
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Portada del hero por frame (si el video está listo) */}
                                    {heroReady && heroHls && (
                                        <div className="mt-6 space-y-2">
                                            <Label>Portada del hero (elegir frame)</Label>
                                            <p className="text-xs text-zinc-500">
                                                Pausá el video en el momento que quieras y fijalo como portada. Si subiste una imagen arriba, esa tiene prioridad.
                                            </p>
                                            <HlsVideo
                                                src={heroHls}
                                                videoRef={heroVideoRef}
                                                className="w-full max-w-lg rounded-lg bg-black aspect-video"
                                            />
                                            <div>
                                                <Button type="button" variant="secondary" disabled={settingHeroThumb} onClick={handleHeroThumbnail}>
                                                    {settingHeroThumb ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 size-4" />}
                                                    Usar este momento como portada
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Phone className="size-5 text-green-500" />
                                        <h3 className="text-lg font-medium">Configuración de Tienda</h3>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp_number">Número de WhatsApp</Label>
                                            <Input
                                                id="whatsapp_number"
                                                value={data.whatsapp_number as string}
                                                placeholder="Ej: 573123456789"
                                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                            />
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                Incluye indicativo de país (sin el +). Ej: 57 para Colombia.
                                            </p>
                                            {errors.whatsapp_number && <p className="text-xs text-red-500">{errors.whatsapp_number}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Mail className="size-5 text-indigo-500" />
                                        <h3 className="text-lg font-medium">Notificaciones de Contacto</h3>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_recipient">Correo que recibe los mensajes</Label>
                                            <Input
                                                id="contact_recipient"
                                                type="email"
                                                value={data.contact_recipient as string}
                                                placeholder="contacto@tudominio.com"
                                                onChange={(e) => setData('contact_recipient', e.target.value)}
                                            />
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                                Dirección donde llegan los mensajes del formulario de contacto. Puede ser de cualquier dominio.
                                            </p>
                                            {errors.contact_recipient && <p className="text-xs text-red-500">{errors.contact_recipient}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                        {!processing && recentlySuccessful && <CheckCircle2 className="ml-2 size-4" />}
                                    </Button>
                                    {recentlySuccessful && (
                                        <p className="ml-4 text-sm text-indigo-500 self-center">
                                            Cambios guardados con éxito
                                        </p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
