import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { AppFooter } from '@/Components/AppFooter';
import { Button } from '@/Components/ui/button';
import { Menu, X, ShoppingBag } from 'lucide-react';
import AudioPlayer from '@/Components/Music/AudioPlayer';
import { useCart } from '@/Contexts/CartContext';
import { CartOverlay } from '@/Components/Shop/CartOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { site } = usePage().props as any;
    const settings = site?.settings;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();

    const navItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Música', href: route('music.index') },
        { label: 'Canal', href: route('channel.index') },
        { label: 'Tienda', href: route('shop.index') },
        { label: 'Bodas', href: route('weddings.index'), icon: '/icons/anillo-de-bodas.png' },
        { label: 'Contacto', href: route('contact.index') },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
            {/* Navigation */}
            <nav className={cn(
                "fixed top-0 z-[100] w-full border-b border-white/5 transition-all duration-300",
                isMenuOpen ? "bg-black/90 backdrop-blur-2xl h-screen" : "bg-black/50 backdrop-blur-md"
            )}>
                <div className="mx-auto flex max-w-8xl items-center justify-between py-8 px-12 relative z-50">
                    <Link href="/" className="flex items-center gap-2">
                        {settings?.logo_vertical ? (
                            <img src={settings.logo_vertical} alt="Santo Music" className="h-8 w-auto object-contain" />
                        ) : (
                            <>
                                <ApplicationLogo className="h-8 w-auto fill-current" />
                                <span className="text-xl font-bold tracking-tighter uppercase">Santo Music</span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item: any) => {
                            const isExternal = item.external && item.href && item.href !== '#';
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal 
                                ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } 
                                : { href: item.href };

                            return (
                                <LinkComponent
                                    key={item.label}
                                    {...linkProps}
                                    className="group relative flex items-center text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:text-white/70"
                                >
                                    {item.icon ? (
                                        <img src={item.icon} className="h-6 w-auto hover:scale-110 transition-all rotate-12 grayscale" alt={item.label} />
                                    ) : (
                                        <span>
                                            {item.label}
                                        </span>
                                    )}
                                    {item.comingSoon && (
                                        <span className="absolute -top-3 -right-8 text-[8px] font-bold text-white/30 tracking-normal">
                                            PROX
                                        </span>
                                    )}
                                </LinkComponent>
                            );
                        })}

                        {/* Cart Button */}
                        <button 
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 ml-4 hover:bg-white/5 rounded-full transition-colors group"
                        >
                            <ShoppingBag className="size-5 text-zinc-400 group-hover:text-white transition-colors" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 size-4 bg-indigo-500 text-[9px] font-bold flex items-center justify-center rounded-full shadow-lg"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden relative z-50 p-2 -mr-2 text-white transition-transform active:scale-95"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.4 }}
                            className="fixed inset-0 z-40 flex flex-col items-center justify-start pt-32 pb-12 gap-10 bg-black/95 px-6 md:hidden overflow-y-auto"
                        >
                            {navItems.map((item: any, idx) => {
                                const isExternal = item.external && item.href && item.href !== '#';
                                const LinkComponent = isExternal ? 'a' : Link;
                                const linkProps = isExternal 
                                    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } 
                                    : { href: item.href, onClick: () => setIsMenuOpen(false) };

                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                                    >
                                        <LinkComponent
                                            {...linkProps}
                                            className="text-2xl font-black tracking-[0.2em] uppercase flex flex-col items-center gap-4 hover:text-white/70 transition-colors"
                                        >
                                            {item.icon ? (
                                                <img src={item.icon} className="h-10 w-auto brightness-0 invert opacity-80" alt={item.label} />
                                            ) : (
                                                <span>{item.label}</span>
                                            )}
                                            {item.comingSoon && (
                                                <span className="text-[10px] text-white/30 font-bold tracking-widest border border-white/10 px-3 py-1 rounded-full bg-white/5">
                                                    PRÓXIMAMENTE
                                                </span>
                                            )}
                                        </LinkComponent>
                                    </motion.div>
                                );
                            })}

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: navItems.length * 0.1, duration: 0.4 }}
                                className="w-full max-w-xs mt-8"
                            >
                                <Link href={route('login')} onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full bg-zinc-900 border-white/10 hover:bg-white hover:text-black transition-all uppercase tracking-widest h-14 rounded-full font-bold">
                                        Entrar
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            <AppFooter />
            
            {/* Persistent Player */}
            <AudioPlayer />

            {/* Shopping Cart Overlay */}
            <CartOverlay />
        </div>
    );
}
