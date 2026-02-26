import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { AuroraText } from '@/Components/magicui/aurora-text';
import { BentoCard, BentoGrid } from '@/Components/magicui/bento-grid';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, Info, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/Contexts/CartContext';
import { cn } from '@/lib/utils';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    images: string[] | null;
}

export default function ShopIndex({
    products,
    whatsappNumber
}: {
    products: Product[],
    whatsappNumber: string
}) {
    const { addToCart } = useCart();

    const handleConsult = (product: Product) => {
        const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(product.price));
        const message = `Hola Santo Music, me interesa el producto *${product.name}* con precio *${price}*. ¿Sigue disponible?`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <PublicLayout>
            <Head title="Tienda - Santo Music" />

            <div className="min-h-screen bg-[#0a0a0a] text-white">
                {/* Hero Section */}
                <div className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <BlurFade delay={0.1}>
                            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                                <AuroraText colors={["#949494ff", "#dadadaff", "#556475ff", "#cfcfcfff"]}>
                                    The Shop.
                                </AuroraText>
                            </h1>
                            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs font-medium max-w-lg mx-auto">
                                Equipamiento y servicios premium para elevar tu experiencia musical.
                            </p>
                        </BlurFade>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-6 pb-24">
                    {products.length > 0 ? (
                        <BentoGrid className="max-w-7xl mx-auto grid-cols-1 md:grid-cols-3">
                            {products.map((product, idx) => (
                                <BlurFade key={product.id} delay={0.2 + idx * 0.1} inView>
                                    <ProductCard
                                        product={product}
                                        onConsult={() => handleConsult(product)}
                                        onAddToCart={() => addToCart(product)}
                                        idx={idx}
                                    />
                                </BlurFade>
                            ))}
                        </BentoGrid>
                    ) : (
                        <div className="text-center py-32 opacity-30">
                            <ShoppingBag className="size-16 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Próximamente</h2>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

function ProductCard({ 
    product, 
    onConsult, 
    onAddToCart,
    idx 
}: { 
    product: Product, 
    onConsult: () => void, 
    onAddToCart: () => void,
    idx: number 
}) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = product.images || [];
    const isWide = idx % 5 === 0;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 transition-all duration-700 hover:border-white/20",
            isWide 
                ? "col-span-1 md:col-span-2 lg:col-span-2 h-[450px] md:h-[600px]" 
                : "col-span-1 md:col-span-1 lg:col-span-1 h-[450px] md:h-[600px]"
        )}>
            {/* Image Slider */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={images[currentImage] || '/placeholder.jpg'}
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="size-full object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-60 group-hover:scale-105"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
            </div>

            {/* Slider Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                    <div className="absolute bottom-8 left-12 z-20 flex gap-2">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 rounded-full transition-all duration-500",
                                    currentImage === i ? "bg-white w-8" : "bg-white/20 w-4"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Content */}
            <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end gap-4">
                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-[0.85] transition-transform group-hover:-translate-y-1 duration-500">
                                {product.name}
                            </h3>
                            <span className="text-2xl font-mono text-white/50 font-medium whitespace-nowrap">
                                ${new Intl.NumberFormat('es-CO').format(Number(product.price))}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            {product.description || 'Equipamiento de alta fidelidad'}
                        </p>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={onAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-zinc-200 shadow-xl"
                        >
                            <Plus className="size-4" />
                            Añadir al Carrito
                        </button>
                        <button 
                            onClick={onConsult}
                            className="p-5 rounded-2xl bg-zinc-800/50 backdrop-blur-xl border border-white/10 hover:bg-white hover:text-black transition-all group/info"
                        >
                            <MessageCircle className="size-4 group-hover/info:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tag */}
            <div className="absolute top-10 left-10 z-20">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                    Limited Edition
                </span>
            </div>
        </div>
    );
}

