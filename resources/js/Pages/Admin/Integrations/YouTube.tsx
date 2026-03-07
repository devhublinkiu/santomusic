import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription,
    CardFooter
} from "@/Components/ui/card";
import { 
    Youtube, 
    CheckCircle2, 
    Puzzle
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";

interface SiteSettings {
    youtube_url: string | null;
    youtube_channel_id: string | null;
}

export default function YouTubeIntegration({ settings }: { settings: SiteSettings }) {
    
    // General Settings Form
    const { 
        data, 
        setData, 
        post, 
        processing, 
        recentlySuccessful 
    } = useForm({
        youtube_url: settings.youtube_url || '',
        youtube_channel_id: settings.youtube_channel_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.integrations.general.update'), {
            onSuccess: () => toast.success('Configuración de YouTube actualizada'),
        });
    };

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Canal de YouTube</h2>}
        >
            <Head title="Admin: YouTube" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Youtube className="size-5 text-indigo-500" />
                                <div>
                                    <CardTitle>Integración con YouTube</CardTitle>
                                    <CardDescription>Configura la sincronización automática de videos vía RSS.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                                <p className="text-xs text-zinc-500 leading-relaxed italic">
                                    Para sincronizar automáticamente tus videos, solo necesitas el **Channel ID** de tu canal (el que empieza por `UC...`). No se requiere configuración en Google Cloud.
                                </p>
                            </div>
                            <form id="youtube-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="youtube_url">URL del Canal (Opcional)</Label>
                                    <Input
                                        id="youtube_url"
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        className="bg-background border-input h-10 rounded-lg focus:ring-1 focus:ring-ring transition-all text-sm"
                                        placeholder="https://youtube.com/@..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="youtube_channel_id">ID del Canal (Para Sincronización)</Label>
                                    <Input
                                        id="youtube_channel_id"
                                        value={data.youtube_channel_id}
                                        onChange={(e) => setData('youtube_channel_id', e.target.value)}
                                        className="bg-background border-input h-10 rounded-lg focus:ring-1 focus:ring-ring transition-all text-sm font-mono"
                                        placeholder="UC..."
                                    />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                            <Button
                                type="submit"
                                form="youtube-form"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                                {recentlySuccessful && <CheckCircle2 className="ml-2 size-4" />}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border border-zinc-200 dark:border-zinc-800 border-dashed bg-card/30 rounded-xl flex flex-col justify-center items-center p-12 text-center gap-6">
                        <div className="size-20 rounded-full bg-muted border border-border flex items-center justify-center">
                            <Puzzle className="size-8 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-muted-foreground">Más Servicios</h3>
                            <p className="text-sm text-muted-foreground/60">Próximamente estaremos añadiendo más conexiones (Bunny.net, Fly.io, etc)</p>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
