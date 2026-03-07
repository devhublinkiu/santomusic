import { Head, useForm } from '@inertiajs/react'; // Import usePage to access shared props like settings
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

// Define the interface for the settings prop
interface SiteSettings {
    logo_app?: string;
    hero_background?: string;
    // Add other settings as needed
}

// Define the props for the Gatekeeper component including settings
interface GatekeeperProps {
    settings?: SiteSettings;
}

export default function Gatekeeper({ settings }: GatekeeperProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('gatekeeper.verify'), {
            onError: () => {
                toast.error('Código inválido o expirado.');
            }
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500 selection:text-white">
            <Head title="Acceso" />

            {/* Background */}
            <div className="absolute inset-0 z-0">
                {settings?.hero_background ? (
                    settings.hero_background.match(/\.(mp4|mov|webm)$/i) ? (
                        <video
                            src={settings.hero_background}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover grayscale brightness-[0.2]"
                        />
                    ) : (
                        <img
                            src={settings.hero_background}
                            alt="Background"
                            className="h-full w-full object-cover grayscale brightness-[0.2]"
                        />
                    )
                ) : (
                    <img
                        src="https://images.unsplash.com/photo-1514525253344-f81bad3b757a?auto=format&fit=crop&q=80&w=2575"
                        alt="Background"
                        className="h-full w-full object-cover grayscale brightness-[0.2]"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="mb-8 flex justify-center">
                    {/* Use Logo App */}
                    {settings?.logo_app ? (
                        <img src={settings.logo_app} alt="Logo" className="h-20 w-auto object-contain" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl">
                            <Lock className="h-8 w-8 text-white/80" />
                        </div>
                    )}
                </div>

                <Card className="border-none bg-black/40 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">Area Privada</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Introduce tu código de acceso para ver el de contenido de Bodas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="CÓDIGO DE ACCESO"
                                    className="h-12 bg-white/5 text-center text-lg font-bold tracking-[0.5em] text-white placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-600 focus:bg-white/10 focus:ring-indigo-500 uppercase"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    maxLength={10}
                                    autoFocus
                                />
                                {errors.code && <p className="text-center text-xs text-red-500">{errors.code}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 py-6 text-base font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                                disabled={processing}
                            >
                                {processing ? 'Verificando...' : 'Entrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-zinc-600">
                    &copy; {new Date().getFullYear()} Santo Music Experience.
                </p>
            </div>
        </div>
    );
}
