import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { Settings, Image as ImageIcon, CheckCircle2, Phone } from 'lucide-react';

interface SiteSettings {
    logo_vertical: string | null;
    logo_home: string | null;
    app_profile: string | null;
    logo_app: string | null;
    hero_background: string | null;
    whatsapp_number: string | null;
}

export default function SettingsPage({ settings }: { settings: SiteSettings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        logo_vertical: null as File | null,
        logo_home: null as File | null,
        app_profile: null as File | null,
        logo_app: null as File | null,
        hero_background: null as File | null,
        whatsapp_number: settings.whatsapp_number || '',
    });

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

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Configuración del Sitio
                </h2>
            }
        >
            <Head title="Ajustes - Admin" />

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
