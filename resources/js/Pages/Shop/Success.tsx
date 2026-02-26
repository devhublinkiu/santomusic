import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function Success() {
    return (
        <PublicLayout>
            <Head title="¡Gracias por tu compra! - Santo Music" />
            
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                        <CheckCircle2 className="size-24 text-green-500 relative z-10 mx-auto" />
                    </div>
                    
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">¡Pedido Recibido!</h1>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold leading-relaxed">
                            Gracias por confiar en Santo Music. Tu pago ha sido procesado con éxito y estamos preparando tu pedido.
                        </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span>Estado del Pedido</span>
                            <span className="text-green-500">Procesando</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                            Recibirás un correo de confirmación con los detalles de tu compra y el número de guía pronto.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link href={route('shop.index')}>
                            <Button className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-black uppercase tracking-widest text-xs group">
                                Volver a la Tienda
                                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-zinc-500 hover:text-white">
                                Ir al Inicio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
