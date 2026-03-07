import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { AuroraText } from '@/Components/magicui/aurora-text';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { Mail, MessageSquare, Send, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

export default function ContactIndex() {
    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => {
                reset();
                toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            },
            onError: () => {
                toast.error('Hubo un error al enviar el mensaje. Por favor revisa los campos.');
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Contacto" />

            <div className="min-h-screen bg-[#0a0a0a] text-white">
                {/* Hero Section */}
                <div className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <BlurFade delay={0.1}>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                                <AuroraText colors={["#949494ff", "#dadadaff", "#556475ff", "#cfcfcfff"]}>
                                    Conectemos.
                                </AuroraText>
                            </h1>
                        </BlurFade>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="container mx-auto px-6 pb-32">
                    <div className="max-w-3xl mx-auto">
                        <BlurFade delay={0.2}>
                            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                                {/* Ambient Light Effect */}
                                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <Mail className="size-6 text-white/80" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">Envíanos un mensaje</h2>
                                            <p className="text-zinc-500 text-sm">Comunícate directamente con nuestro equipo.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                    Nombre Completo
                                                </label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="bg-black/50 border-white/10 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 transition-all px-4 font-medium"
                                                    placeholder="Tu nombre"
                                                    disabled={processing}
                                                />
                                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                    Correo Electrónico
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="bg-black/50 border-white/10 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 transition-all px-4 font-medium"
                                                    placeholder="tucorreo@ejemplo.com"
                                                    disabled={processing}
                                                />
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                Asunto
                                            </label>
                                            <Input
                                                id="subject"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="bg-black/50 border-white/10 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 transition-all px-4 font-medium"
                                                placeholder="¿En qué podemos ayudarte?"
                                                disabled={processing}
                                            />
                                            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                Mensaje
                                            </label>
                                            <Textarea
                                                id="message"
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                className="bg-black/50 border-white/10 min-h-[150px] rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 transition-all p-4 resize-none font-medium leading-relaxed"
                                                placeholder="Escribe los detalles aquí..."
                                                disabled={processing}
                                            />
                                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={cn(
                                                    "relative overflow-hidden group/btn px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300",
                                                    recentlySuccessful 
                                                        ? "bg-emerald-500 text-white" 
                                                        : "bg-white text-black hover:bg-zinc-200"
                                                )}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Enviando
                                                        </>
                                                    ) : recentlySuccessful ? (
                                                        <>
                                                            <CheckCircle2 className="size-4" />
                                                            Enviado
                                                        </>
                                                    ) : (
                                                        <>
                                                            Enviar Mensaje
                                                            <Send className="size-4 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
