import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import {
    FileVideo,
    Key,
    ShoppingBag,
    Server,
    Cpu,
    Cloud,
    HardDrive,
    Clock,
    Zap
} from 'lucide-react';
import { BlurFade } from '@/Components/magicui/blur-fade';

interface Stats {
    total_projects: number;
    total_access_codes: number;
    total_products: number;
}

interface ServerInfo {
    php_version: string;
    upload_max_filesize: string;
    post_max_size: string;
    max_execution_time: string;
    memory_limit: string;
    bunny_status: string;
}

export default function Dashboard({ stats, serverInfo }: { stats: Stats, serverInfo: ServerInfo }) {
    const cards = [
        {
            title: "Proyectos Activos",
            value: stats.total_projects,
            description: "Videos de bodas publicados",
            icon: FileVideo,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Códigos de Acceso",
            value: stats.total_access_codes,
            description: "Clientes con acceso privado",
            icon: Key,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
        {
            title: "Productos en Tienda",
            value: stats.total_products,
            description: "Artículos en catálogo WhatsApp",
            icon: ShoppingBag,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
    ];

    const serverMetrics = [
        { label: "Versión de PHP", value: serverInfo.php_version, icon: Cpu },
        { label: "Máx. Subida", value: serverInfo.upload_max_filesize, icon: HardDrive },
        { label: "Máx. Post", value: serverInfo.post_max_size, icon: Zap },
        { label: "Tiempo de Ejecución", value: serverInfo.max_execution_time, icon: Clock },
        { label: "Límite de Memoria", value: serverInfo.memory_limit, icon: Server },
        { label: "Almacenamiento Cloud", value: serverInfo.bunny_status, icon: Cloud, highlight: true },
    ];

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Resumen del Sistema
                </h2>
            }
        >
            <Head title="Admin: Escritorio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {cards.map((card, idx) => (
                            <BlurFade key={card.title} delay={idx * 0.1}>
                                <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl group hover:scale-[1.02] transition-transform duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                                            {card.title}
                                        </CardTitle>
                                        <div className={`${card.bg} p-2 rounded-lg`}>
                                            <card.icon className={`size-4 ${card.color}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-black">{card.value}</div>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {card.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </BlurFade>
                        ))}
                    </div>

                    {/* Server Info Section */}
                    <BlurFade delay={0.4}>
                        <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Server className="size-5 text-indigo-500" />
                                    <div>
                                        <CardTitle>Estado del Servidor</CardTitle>
                                        <CardDescription>Configuración y límites de carga actuales</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {serverMetrics.map((metric) => (
                                        <div key={metric.label} className="space-y-1">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <metric.icon className="size-3.5" />
                                                <span className="text-[10px] uppercase tracking-widest font-bold">
                                                    {metric.label}
                                                </span>
                                            </div>
                                            <div className={`text-sm font-semibold ${metric.highlight ? 'text-green-500' : 'text-zinc-200'}`}>
                                                {metric.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                                        Nota: Los videos están configurados para cargarse directamente a Bunny.net (Edge Storage).
                                        Los límites del servidor PHP deben permitir el procesamiento inicial de las peticiones.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </BlurFade>

                </div>
            </div>
        </AppLayout>
    );
}
