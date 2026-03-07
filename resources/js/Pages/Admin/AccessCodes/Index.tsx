import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Switch } from '@/Components/ui/switch';
import { toast } from 'sonner';
import { Key, Trash2, Plus, Calendar, Copy, Edit, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AccessCode {
    id: number;
    name: string;
    code: string;
    expires_at: string | null;
    is_active: boolean;
    uses: number;
    created_at: string;
}

export default function AccessCodesIndex({ codes }: { codes: AccessCode[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<AccessCode | null>(null);

    // Form for Creating
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        expires_at: '',
        is_active: true,
    });

    // Form for Editing
    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: processingEdit,
        errors: errorsEdit,
        reset: resetEdit
    } = useForm({
        name: '',
        expires_at: '',
        is_active: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.access-codes.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success('Código creado correctamente');
            },
            onError: () => {
                toast.error('Error al crear el código');
            }
        });
    };

    const openEdit = (code: AccessCode) => {
        setEditingCode(code);
        setEditData({
            name: code.name,
            expires_at: code.expires_at ? code.expires_at.slice(0, 16) : '', // Format for datetime-local
            is_active: Boolean(code.is_active),
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCode) return;

        putEdit(route('admin.access-codes.update', editingCode.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                resetEdit();
                setEditingCode(null);
                toast.success('Código actualizado correctamente');
            },
            onError: () => {
                toast.error('Error al actualizar el código');
            }
        });
    };


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Código copiado al portapapeles');
    };

    const handleToggleStatus = (code: AccessCode, checked: boolean) => {
        router.put(route('admin.access-codes.update', code.id), {
            name: code.name,
            expires_at: code.expires_at,
            is_active: checked,
        }, {
            onSuccess: () => toast.success(checked ? 'Código activado' : 'Código desactivado'),
            onError: () => toast.error('Error al actualizar el estado'),
            preserveScroll: true,
        });
    };

    const confirmDelete = (codeId: number) => {
        router.delete(route('admin.access-codes.destroy', codeId), {
            onSuccess: () => toast.success('Código eliminado correctamente'),
            onError: () => toast.error('Error al eliminar el código'),
        });
    };

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Códigos de Acceso
                </h2>
            }
        >
            <Head title="Admin: Códigos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="size-5 text-indigo-500" />
                                    Gestión de Accesos
                                </CardTitle>
                                <CardDescription>
                                    Crea y administra los códigos para entrar a la sección de Bodas.
                                </CardDescription>
                            </div>

                            {/* CREATE DIALOG */}
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        <Plus className="mr-2 size-4" /> Nuevo Código
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Crear Código de Acceso</DialogTitle>
                                        <DialogDescription>
                                            Deja el campo "Código" vacío para generar uno aleatorio.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre del Evento / Cliente</Label>
                                            <Input
                                                id="name"
                                                placeholder="Ej: Boda Juan y Ana"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Código (Opcional)</Label>
                                            <Input
                                                id="code"
                                                placeholder="Ej: BODA2024 (o dejar vacío)"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                maxLength={10}
                                            />
                                            <p className="text-[10px] text-zinc-500">Máximo 10 caracteres alfanuméricos.</p>
                                            {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expires_at">Fecha de Expiración (Opcional)</Label>
                                            <Input
                                                id="expires_at"
                                                type="datetime-local"
                                                value={data.expires_at}
                                                onChange={(e) => setData('expires_at', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="is_active">Activo</Label>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Si está desactivado, nadie podrá usarlo.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Guardar Código
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* EDIT DIALOG */}
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Editar Código: {editingCode?.code}</DialogTitle>
                                        <DialogDescription>
                                            Modifica los detalles del código de acceso.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-name">Nombre del Evento / Cliente</Label>
                                            <Input
                                                id="edit-name"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                required
                                            />
                                            {errorsEdit.name && <p className="text-xs text-red-500">{errorsEdit.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-expires_at">Fecha de Expiración</Label>
                                            <Input
                                                id="edit-expires_at"
                                                type="datetime-local"
                                                value={editData.expires_at}
                                                onChange={(e) => setEditData('expires_at', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <Label>Estado Activo</Label>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Controla si el código permite acceso.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={editData.is_active}
                                                onCheckedChange={(checked) => setEditData('is_active', checked)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processingEdit}>
                                                {processingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Actualizar Código
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Usos</TableHead>
                                        <TableHead>Expiración</TableHead>
                                        <TableHead>Activo</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {codes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                No hay códigos creados aún.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        codes.map((code) => (
                                            <TableRow key={code.id}>
                                                <TableCell className="font-medium">{code.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <code className="rounded bg-zinc-100 px-2 py-1 text-sm font-mono dark:bg-zinc-800">
                                                            {code.code}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => copyToClipboard(code.code)}
                                                        >
                                                            <Copy className="size-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{code.uses}</TableCell>
                                                <TableCell>
                                                    {code.expires_at ? (
                                                        <span className="flex items-center gap-1 text-zinc-500">
                                                            <Calendar className="size-3" />
                                                            {format(new Date(code.expires_at), 'dd/MM/yyyy HH:mm')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-500">Nunca</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={Boolean(code.is_active)}
                                                        onCheckedChange={(checked) => handleToggleStatus(code, checked)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => openEdit(code)}
                                                        >
                                                            <Edit className="size-4 text-zinc-500" />
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el código
                                                                        <strong> {code.code} </strong> y revocará el acceso inmediatamente.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => confirmDelete(code.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Eliminar
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
