import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/button';
import { ChevronRight } from 'lucide-react';

import { LiquidLogo } from '@/Components/magicui/liquid-logo/liquid-logo';

export default function Welcome({ auth }: PageProps) {
    const { site } = usePage().props as any;
    const settings = site?.settings;
    return (
        <PublicLayout>
            <Head title="Santo Music" />

            <div className="relative h-[60vh] md:h-[80vh] min-h-[500px] w-full overflow-hidden">
                {/* Hero Image Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 pointer-events-none" />

                {/* Main Hero Background (Image or Video) */}
                {settings?.hero_background ? (
                    settings.hero_background.toLowerCase().match(/\.(mp4|mov|webm)$/i) ? (
                        <video
                            src={settings.hero_background}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover grayscale brightness-50 pointer-events-none"
                        />
                    ) : (
                        <img
                            src={settings.hero_background}
                            alt="Santo Music Background"
                            className="absolute inset-0 h-full w-full object-cover grayscale brightness-50 pointer-events-none"
                        />
                    )
                ) : (
                    <img
                        src="https://images.unsplash.com/photo-1514525253344-f81bad3b757a?auto=format&fit=crop&q=80&w=2575"
                        alt="Santo Music Default"
                        className="absolute inset-0 h-full w-full object-cover grayscale brightness-50 pointer-events-none"
                    />
                )}

                {/* Hero Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:pt-0 text-center pointer-events-none">
                    {settings?.logo_home ? (
                        <>
                            {/* Desktop (WebGL animated) */}
                            <div className="hidden md:block h-[64vh] w-full max-w-6xl animate-in fade-in zoom-in duration-1000">
                                <LiquidLogo
                                    imageUrl={settings.logo_home}
                                    speed={0.4}
                                    liquid={0.08}
                                />
                            </div>
                            
                            {/* Mobile (Static but reliable and sharp) */}
                            <div className="block md:hidden w-full max-w-xs animate-in fade-in zoom-in duration-1000">
                                <img 
                                    src={settings.logo_home} 
                                    alt="Santo Music Logo" 
                                    className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                />
                            </div>
                        </>
                    ) : (
                        <h1 className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter uppercase sm:text-[10vw]">
                            SANTO MUSIC
                        </h1>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
