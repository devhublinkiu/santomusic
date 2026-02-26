import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ArrowLeft, ShoppingBag, Loader2, Lock } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "@inertiajs/react";

export default function Checkout() {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    
    const { data, setData, processing, errors } = useForm({
        customer_info: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
        items: items,
        total: totalPrice,
    });

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        try {
            const response = await axios.post(route('checkout.process'), {
                ...data,
                items,
                total: totalPrice
            });

            if (response.data.checkout_url) {
                toast.success("Redirigiendo a la pasarela de pago...");
                clearCart(); // Clear local cart before redirect
                window.location.href = response.data.checkout_url;
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Error al procesar el pedido");
        }
    };

    if (totalItems === 0) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <ShoppingBag className="size-16 mb-6 text-zinc-800" />
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Tu carrito está vacío</h1>
                    <p className="text-zinc-500 mb-8 max-w-md">Parece que aún no has añadido nada a tu colección musical.</p>
                    <Link href={route('shop.index')}>
                        <Button className="bg-white text-black hover:bg-zinc-200 h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">
                            Volver a la Tienda
                        </Button>
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Checkout - Santo Music" />
            
            <div className="min-h-screen pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center gap-4 mb-12">
                        <Link href={route('shop.index')} className="p-2 rounded-full bg-zinc-900 border border-white/5 hover:bg-white hover:text-black transition-all">
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Finalizar Compra</h1>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Paso Final • Pago Seguro</p>
                        </div>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-premium bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2rem]">
                                <CardContent className="p-0 space-y-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                                            <ShieldCheck className="size-6 text-indigo-300" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Información del Cliente</h2>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nombre Completo</Label>
                                            <Input 
                                                value={data.customer_info.name}
                                                onChange={e => setData('customer_info', { ...data.customer_info, name: e.target.value })}
                                                className="bg-zinc-950 border-white/10 h-12 rounded-xl focus:border-indigo-500 transition-all text-white placeholder:text-zinc-600"
                                                placeholder="Ej: Juan Pérez"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Correo Electrónico</Label>
                                            <Input 
                                                type="email"
                                                value={data.customer_info.email}
                                                onChange={e => setData('customer_info', { ...data.customer_info, email: e.target.value })}
                                                className="bg-zinc-950 border-white/10 h-12 rounded-xl focus:border-indigo-500 transition-all text-white placeholder:text-zinc-600"
                                                placeholder="juan@ejemplo.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Teléfono / WhatsApp</Label>
                                            <Input 
                                                value={data.customer_info.phone}
                                                onChange={e => setData('customer_info', { ...data.customer_info, phone: e.target.value })}
                                                className="bg-zinc-950 border-white/10 h-12 rounded-xl focus:border-indigo-500 transition-all text-white placeholder:text-zinc-600"
                                                placeholder="Ej: 3123456789"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Dirección de Envío</Label>
                                            <Input 
                                                value={data.customer_info.address}
                                                onChange={e => setData('customer_info', { ...data.customer_info, address: e.target.value })}
                                                className="bg-zinc-950 border-white/10 h-12 rounded-xl focus:border-indigo-500 transition-all text-white placeholder:text-zinc-600"
                                                placeholder="Ej: Calle 123 #45-67, Bogotá"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-8 rounded-[2rem] border border-white/5 bg-zinc-900/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-zinc-800">
                                        <Lock className="size-5 text-zinc-400" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">Pago 100% Seguro</h4>
                                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Encriptación SSL • Powered by Bold.co</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-30 grayscale">
                                    <img src="/icons/visa.svg" className="h-6 w-auto" alt="Visa" />
                                    <img src="/icons/mastercard.svg" className="h-6 w-auto" alt="Mastercard" />
                                    <img src="/icons/pse.svg" className="h-6 w-auto" alt="PSE" />
                                </div>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="space-y-8">
                            <Card className="border-none shadow-premium bg-zinc-900 overflow-hidden rounded-[2.5rem]">
                                <CardHeader className="p-8 pb-4">
                                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Tu Pedido</h2>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="size-12 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden">
                                                    <img src={item.images?.[0]} className="size-full object-cover opacity-60" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[11px] font-bold uppercase truncate text-white">{item.name}</h4>
                                                    <p className="text-[10px] text-zinc-400">Cant: {item.quantity}</p>
                                                </div>
                                                <p className="text-xs font-mono font-bold text-white">
                                                    ${new Intl.NumberFormat('es-CO').format(Number(item.price) * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-3">
                                        <div className="flex justify-between text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                                            <span>Subtotal</span>
                                            <span>${new Intl.NumberFormat('es-CO').format(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                                            <span>Envío</span>
                                            <span className="text-green-500">Gratis</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3">
                                            <span className="text-xl font-black uppercase tracking-tighter italic text-white">Total</span>
                                            <span className="text-2xl font-mono font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]">
                                                ${new Intl.NumberFormat('es-CO').format(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleCheckout}
                                        disabled={processing}
                                        className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 shadow-2xl transition-all"
                                    >
                                        {processing ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard className="size-4 mr-2" />
                                                Confirmar Pago
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
