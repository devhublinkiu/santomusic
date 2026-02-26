import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription,
    CardFooter
} from "@/Components/ui/card";
import { 
    Zap, 
    CheckCircle2, 
    Globe,
    Lock
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";

interface SiteSettings {
    bold_api_key: string | null;
    bold_environment: string;
}

export default function BoldIntegration({ settings }: { settings: SiteSettings }) {
    
    // Bold.co Form
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        bold_api_key: settings.bold_api_key || '',
        bold_environment: settings.bold_environment || 'sandbox',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.integrations.bold.update'), {
            onSuccess: () => toast.success('Configuración de Bold actualizada'),
        });
    };

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Pasarela Bold.co</h2>}
        >
            <Head title="Bold.co - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="size-5 text-indigo-500" />
                                    <div>
                                        <CardTitle>Pasarela de Pagos Bold.co</CardTitle>
                                        <CardDescription>Configura tu API Key y ambiente de operación.</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Conectado</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <form id="bold-form" onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="bold_api_key">API Key Principal</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                            <Input
                                                id="bold_api_key"
                                                type="password"
                                                value={data.bold_api_key}
                                                onChange={(e) => setData('bold_api_key', e.target.value)}
                                                className="pl-10 bg-background border-input h-10 rounded-lg focus:ring-1 focus:ring-ring transition-all font-mono text-sm"
                                                placeholder="x-api-key-..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="bold_environment">Ambiente de Operación</Label>
                                        <Select 
                                            value={data.bold_environment} 
                                            onValueChange={(val) => setData('bold_environment', val)}
                                        >
                                            <SelectTrigger className="bg-background border-input h-10 rounded-lg focus:ring-1 focus:ring-ring">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="size-4 text-zinc-500" />
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                                                <SelectItem value="production">Production (Real)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-xl bg-zinc-500/5 border border-zinc-500/10">
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose font-medium italic text-center">
                                        La API Key es necesaria para procesar todas las ventas de la tienda. Asegúrate de que el ambiente coincida con el tipo de llave que estás usando en Bold.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                            <Button
                                type="submit"
                                form="bold-form"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {processing ? 'Guardando...' : 'Aplicar Cambios'}
                                {recentlySuccessful && <CheckCircle2 className="ml-2 size-4" />}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
