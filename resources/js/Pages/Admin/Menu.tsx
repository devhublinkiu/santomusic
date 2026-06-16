import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import { PanelsTopLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface MenuItem {
    key: string;
    label: string;
    visible: boolean;
}

export default function MenuPage({ items }: { items: MenuItem[] }) {
    const initialVisibility = items.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.key] = item.visible;
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        visibility: initialVisibility,
    });

    const toggle = (key: string, value: boolean) => {
        setData('visibility', { ...data.visibility, [key]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.menu.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Menú actualizado correctamente'),
            onError: () => toast.error('Hubo un error al actualizar el menú'),
        });
    };

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Menú del Sitio
                </h2>
            }
        >
            <Head title="Admin: Menú" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <PanelsTopLeft className="size-5 text-indigo-500" />
                                <CardTitle>Visibilidad del Menú</CardTitle>
                            </div>
                            <CardDescription>
                                Activa o desactiva los enlaces que se muestran en el menú de la web.
                                "Inicio" siempre permanece visible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                    {items.map((item) => {
                                        const isVisible = data.visibility[item.key];
                                        return (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between gap-4 p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {isVisible ? (
                                                        <Eye className="size-4 text-emerald-500" />
                                                    ) : (
                                                        <EyeOff className="size-4 text-zinc-400" />
                                                    )}
                                                    <Label
                                                        htmlFor={`menu-${item.key}`}
                                                        className="cursor-pointer text-sm font-medium"
                                                    >
                                                        {item.label}
                                                    </Label>
                                                </div>
                                                <Switch
                                                    id={`menu-${item.key}`}
                                                    checked={isVisible}
                                                    onCheckedChange={(value) => toggle(item.key, value)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-2">
                                    {recentlySuccessful && (
                                        <p className="text-sm text-indigo-500">Cambios guardados</p>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                        {!processing && recentlySuccessful && <CheckCircle2 className="ml-2 size-4" />}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
