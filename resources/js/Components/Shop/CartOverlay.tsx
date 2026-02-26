import { useCart } from "@/Contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { BlurFade } from "../magicui/blur-fade";

export const CartOverlay = () => {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 z-[101] h-screen w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <ShoppingBag className="size-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Tu Carrito</h2>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                        {totalItems} {totalItems === 1 ? 'Producto' : 'Productos'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X className="size-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <ShoppingBag className="size-16 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">El carrito está vacío</p>
                                </div>
                            ) : (
                                items.map((item, idx) => (
                                    <BlurFade key={item.id} delay={idx * 0.05} className="flex gap-4 group">
                                        <div className="size-20 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 flex-shrink-0">
                                            <img 
                                                src={item.images?.[0] || '/placeholder.jpg'} 
                                                className="size-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">{item.name}</h4>
                                            <p className="text-zinc-500 text-xs font-mono mt-0.5">
                                                ${new Intl.NumberFormat('es-CO').format(Number(item.price))}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 px-2 py-1 rounded-lg bg-zinc-900 border border-white/5">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        <Minus className="size-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        <Plus className="size-3" />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </BlurFade>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-zinc-900/50 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                                    <span className="text-xl font-mono font-bold">
                                        ${new Intl.NumberFormat('es-CO').format(totalPrice)}
                                    </span>
                                </div>
                                <Button 
                                    className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-black uppercase tracking-widest text-xs group"
                                    onClick={() => {
                                        setIsOpen(false);
                                        // TODO: Redirect to checkout
                                        window.location.href = '/checkout';
                                    }}
                                >
                                    Pagar Ahora
                                    <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
                                    Impuestos incluidos. El pago se procesará de forma segura a través de Bold.co
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
