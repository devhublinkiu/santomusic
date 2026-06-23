import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import AccessCodeLock from '@/Components/AccessCodeLock';
import WeddingVideoModal from '@/Components/WeddingVideoModal';
import { AuroraText } from '@/Components/magicui/aurora-text';
import { BentoCard, BentoGrid } from '@/Components/magicui/bento-grid';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { Video, Play } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    event_date: string;
    hls_url: string | null;
    poster_url: string | null;
    width: number | null;
    height: number | null;
    external_url: string | null;
}

interface MonthGroup {
    month: string;
    projects: Project[];
}

interface Hero {
    poster: string;
    hls_url: string | null;
    width: number | null;
    height: number | null;
    ready: boolean;
}

export default function WeddingIndex({
    isVerified,
    projectsByMonth = [],
    hero = null
}: {
    isVerified: boolean;
    projectsByMonth: MonthGroup[];
    hero: Hero | null;
}) {
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [heroOpen, setHeroOpen] = useState(false);

    return (
        <PublicLayout>
            <Head title="Bodas" />

            <AccessCodeLock isVerified={isVerified} />

            <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
                {/* Background Watermark */}
                <div className="absolute -top-80 opacity-[0.5] pointer-events-none z-0 select-none flex items-start justify-center overflow-hidden">
                    <img src="/icons/Snto.png" className="w-full h-auto brightness-0 invert" alt="" />
                </div>

                <div className="container mx-auto px-6 py-24 relative z-10">
                    <div className="max-w-6xl mx-auto space-y-24">
                        {hero && (
                            <BlurFade delay={0.1} inView>
                                <div
                                    className={cn(
                                        "relative group rounded-2xl overflow-hidden",
                                        hero.ready ? "cursor-pointer" : "cursor-default"
                                    )}
                                    onClick={() => hero.ready && setHeroOpen(true)}
                                >
                                    <img
                                        src={hero.poster}
                                        alt="Video destacado"
                                        className="w-full rounded-2xl transition-all duration-200 group-hover:brightness-[0.85]"
                                    />
                                    {hero.ready && (
                                        <div className="absolute inset-0 flex items-center justify-center scale-[0.9] group-hover:scale-100 transition-all duration-200 ease-out">
                                            <div className="bg-white/10 flex items-center justify-center rounded-full backdrop-blur-md size-28">
                                                <div className="flex items-center justify-center bg-gradient-to-b from-white/30 to-white/80 shadow-md rounded-full size-20 transition-transform duration-200 group-hover:scale-110">
                                                    <Play className="size-8 text-black fill-black" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </BlurFade>
                        )}

                        {projectsByMonth && projectsByMonth.length > 0 ? (
                            projectsByMonth.map((group, groupIdx) => (
                                <div key={group.month} className="space-y-12">
                                    <BlurFade delay={groupIdx * 0.1 + 0.2} inView>
                                        <div className="text-center">
                                            <h2 className="uppercase text-[40px] md:text-[60px] font-black tracking-tight leading-none">
                                                <AuroraText>
                                                    {group.month}
                                                </AuroraText>
                                            </h2>
                                        </div>
                                    </BlurFade>

                                    <BlurFade delay={groupIdx * 0.1 + 0.4} inView>
                                        <BentoGrid>
                                            {group.projects.map((project, idx) => {
                                                const isWide = idx % 3 === 0;

                                                return (
                                                    <div
                                                        key={project.id}
                                                        className={cn(
                                                            isWide ? "col-span-3 lg:col-span-2" : "col-span-3 lg:col-span-1"
                                                        )}
                                                    >
                                                        <BentoCard
                                                            name={project.name}
                                                            date={project.event_date}
                                                            description={project.external_url ? "Ver enlace externo" : "Click para reproducir"}
                                                            href={project.external_url || undefined}
                                                            cta={project.external_url ? "Ver Enlace" : undefined}
                                                            className="h-full"
                                                            background={
                                                                <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                                                                    {project.poster_url ? (
                                                                        <div className="relative w-full h-full">
                                                                            <img
                                                                                src={project.poster_url}
                                                                                alt={project.name}
                                                                                loading="lazy"
                                                                                className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                                                                            />
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                                                            <div
                                                                                onClick={() => setActiveProject(project)}
                                                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
                                                                            >
                                                                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                                                                    <Play className="size-8 text-white fill-white" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className={cn(
                                                                                "absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                                                                                idx % 2 === 0 ? "from-pink-500 via-purple-500 to-blue-500" : "from-blue-500 via-cyan-500 to-teal-500"
                                                                            )} />
                                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                                                <Video className="size-12 text-white" />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </BentoGrid>
                                    </BlurFade>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <BlurFade delay={0.2} inView>
                                    <h2 className="text-4xl font-bold opacity-50">No hay proyectos asignados para este código.</h2>
                                </BlurFade>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <WeddingVideoModal
                open={!!activeProject}
                onClose={() => setActiveProject(null)}
                hlsUrl={activeProject?.hls_url || ''}
                posterUrl={activeProject?.poster_url || undefined}
                width={activeProject?.width}
                height={activeProject?.height}
            />

            {hero && (
                <WeddingVideoModal
                    open={heroOpen}
                    onClose={() => setHeroOpen(false)}
                    hlsUrl={hero.hls_url || ''}
                    posterUrl={hero.poster}
                    width={hero.width}
                    height={hero.height}
                />
            )}

        </PublicLayout>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
