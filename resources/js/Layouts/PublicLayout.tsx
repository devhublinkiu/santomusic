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

export default function PublicLayout({ children }: PropsWithChildren) {
    const { site } = usePage().props as any;
    const settings = site?.settings;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();

    const navItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Música', href: route('music.index') },
        { label: 'Channel', href: route('channel.index') },
        { label: 'Shop', href: route('shop.index') },
        { label: 'Bodas', href: route('weddings.index'), icon: '/icons/anillo-de-bodas.png' },
        { label: 'Contacto', href: route('contact.index') },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-8xl items-center justify-between py-8 px-12">
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
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="fixed inset-0 top-[65px] z-40 flex flex-col items-center justify-center gap-8 bg-black p-6 md:hidden">
                        {navItems.map((item: any) => {
                            const isExternal = item.external && item.href && item.href !== '#';
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal 
                                ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } 
                                : { href: item.href, onClick: () => setIsMenuOpen(false) };

                            return (
                                <LinkComponent
                                    key={item.label}
                                    {...linkProps}
                                    className="text-2xl font-bold tracking-widest uppercase flex items-center gap-2"
                                >
                                    {item.icon ? (
                                        <img src={item.icon} className="h-10 w-auto brightness-0 invert" alt={item.label} />
                                    ) : (
                                        <span>
                                            {item.label}
                                        </span>
                                    )}
                                    {item.comingSoon && (
                                        <span className="text-[10px] text-white/30">PROX</span>
                                    )}
                                </LinkComponent>
                            );
                        })}
                        <Link href={route('login')} onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full border-white/10 uppercase">
                                Login
                            </Button>
                        </Link>
                    </div>
                )}
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
