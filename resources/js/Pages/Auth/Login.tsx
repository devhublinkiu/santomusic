import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Music, ArrowLeft } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { site } = usePage().props as any;
    const settings = site?.settings;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-white selection:text-black">
            <Head title="Acceder" />

            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-8 left-8 flex items-center gap-2 text-xs font-medium tracking-widest text-white/40 uppercase hover:text-white transition-colors"
            >
                <ArrowLeft className="size-4" />
                Volver al Home
            </Link>

            <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="">
                        {settings?.logo_app ? (
                            <img src={settings.logo_app} alt="Santo Music" className="w-[300px] object-contain" />
                        ) : (
                            <Music className="size-10 text-black" />
                        )}
                    </div>
                </div>

                <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-white">Iniciar sesión</CardTitle>
                        <CardDescription className="text-white/40">
                            Ingresa tus credenciales para continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div className="mb-6 text-sm font-medium text-emerald-500 bg-emerald-500/10 p-3 rounded-md border border-emerald-500/20">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-white/60">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="bg-black/40 border-white/10 h-11 focus:ring-1 focus:ring-white/20 transition-all text-white"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" title="password" className="text-xs uppercase tracking-widest text-white/60">Contraseña</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[10px] text-white/40 uppercase tracking-tighter hover:text-white transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="bg-black/40 border-white/10 h-11 focus:ring-1 focus:ring-white/20 transition-all text-white"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-xs font-medium leading-none text-white/40 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Recordar sesión
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest h-11 mt-4"
                                disabled={processing}
                            >
                                {processing ? 'Accediendo...' : 'Entrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Santo Music Production
                    </p>
                </div>
            </div>
        </div>
    );
}
