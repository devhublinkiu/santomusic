import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { toast } from 'sonner';
import { FileVideo, Trash2, Plus, Calendar, Edit, Loader2, Link as LinkIcon, UploadCloud, UserCircle, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { uploadToBunny, MAX_BYTES } from '@/lib/bunnyUpload';

interface Project {
    id: number;
    name: string;
    event_date: string;
    video_guid: string | null;
    video_status: string;
    thumbnail_url: string | null;
    external_url: string | null;
    access_code_id: number | null;
    access_code?: {
        name: string;
    } | null;
    created_at: string;
}

interface AccessCode {
    id: number;
    name: string;
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'ready') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Listo
            </span>
        );
    }
    if (status === 'error') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                <AlertCircle className="size-3" /> Error
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Clock className="size-3 animate-pulse" /> Procesando…
        </span>
    );
}

export default function ProjectsIndex({ projects, accessCodes, groupingMode }: { projects: Project[], accessCodes: AccessCode[], groupingMode: string }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Subida directa (TUS)
    const [uploading, setUploading] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);

    // Form de creación (metadata + archivo)
    const [createData, setCreateData] = useState({
        name: '',
        event_date: '',
        external_url: '',
        access_code_id: '' as string,
        video: null as File | null,
    });

    // Form de edición (solo metadata)
    const {
        data: editData,
        setData: setEditData,
        post: postEdit,
        processing: processingEdit,
        reset: resetEdit,
    } = useForm({
        _method: 'PUT',
        name: '',
        event_date: '',
        external_url: '',
        access_code_id: '' as string | number,
    });

    // Reemplazo de video en edición
    const [replaceFile, setReplaceFile] = useState<File | null>(null);
    const [replacing, setReplacing] = useState(false);
    const [replacePct, setReplacePct] = useState(0);

    const resetCreate = () => {
        setCreateData({ name: '', event_date: '', external_url: '', access_code_id: '', video: null });
        setUploadPct(0);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createData.video) {
            toast.error('Selecciona un archivo de video.');
            return;
        }
        if (createData.video.size > MAX_BYTES) {
            toast.error('El video supera el límite de 5GB.');
            return;
        }

        setUploading(true);
        setUploadPct(0);
        try {
            const { data } = await axios.post(route('admin.projects.store'), {
                name: createData.name,
                event_date: createData.event_date,
                external_url: createData.external_url,
                access_code_id: createData.access_code_id || null,
            });

            await uploadToBunny(createData.video, data.upload, setUploadPct);

            toast.success('Video subido. Bunny lo está procesando.');
            setIsCreateOpen(false);
            resetCreate();
            router.reload({ only: ['projects'] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error al subir el video.');
        } finally {
            setUploading(false);
        }
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setEditData({
            _method: 'PUT',
            name: project.name,
            event_date: project.event_date,
            external_url: project.external_url || '',
            access_code_id: project.access_code_id || '',
        });
        setReplaceFile(null);
        setReplacePct(0);
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        postEdit(route('admin.projects.update', editingProject.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                resetEdit();
                setEditingProject(null);
                toast.success('Proyecto actualizado correctamente');
            },
            onError: () => toast.error('Error al actualizar.'),
        });
    };

    const handleReplaceVideo = async () => {
        if (!editingProject || !replaceFile) return;
        if (replaceFile.size > MAX_BYTES) {
            toast.error('El video supera el límite de 5GB.');
            return;
        }

        setReplacing(true);
        setReplacePct(0);
        try {
            const { data } = await axios.post(route('admin.projects.video', editingProject.id));
            await uploadToBunny(replaceFile, data.upload, setReplacePct);
            toast.success('Nuevo video subido. Bunny lo está procesando.');
            setIsEditOpen(false);
            setEditingProject(null);
            setReplaceFile(null);
            router.reload({ only: ['projects'] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error al reemplazar el video.');
        } finally {
            setReplacing(false);
        }
    };

    const refreshStatus = (projectId: number) => {
        router.post(route('admin.projects.refresh', projectId), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado actualizado'),
            onError: () => toast.error('No se pudo actualizar el estado'),
        });
    };

    const changeGrouping = (mode: string) => {
        router.post(route('admin.projects.grouping'), { mode }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Vista pública agrupada por ${mode === 'year' ? 'año' : 'mes'}`),
        });
    };

    const confirmDelete = (projectId: number) => {
        router.delete(route('admin.projects.destroy', projectId), {
            onSuccess: () => toast.success('Proyecto y video eliminados'),
            onError: () => toast.error('Error al eliminar'),
        });
    };

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Proyectos
                </h2>
            }
        >
            <Head title="Admin: Proyectos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Configuración de la vista pública */}
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-base">Organización de la vista pública</CardTitle>
                                <CardDescription>
                                    Define cómo se agrupan los videos en la página de bodas. Dentro de cada grupo se ordenan del más nuevo al más viejo.
                                </CardDescription>
                            </div>
                            <Select value={groupingMode} onValueChange={changeGrouping}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="month">Agrupar por Mes</SelectItem>
                                    <SelectItem value="year">Agrupar por Año</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                    </Card>

                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileVideo className="size-5 text-indigo-500" />
                                    Galería de Videos
                                </CardTitle>
                                <CardDescription>
                                    Los videos se suben directo a Bunny Stream y se reproducen con streaming adaptativo.
                                </CardDescription>
                            </div>

                            <Dialog open={isCreateOpen} onOpenChange={(o) => { if (!uploading) { setIsCreateOpen(o); if (!o) resetCreate(); } }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        <Plus className="mr-2 size-4" /> Nuevo Proyecto
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Subir Nuevo Video</DialogTitle>
                                        <DialogDescription>
                                            El archivo se sube directo a la nube. Luego Bunny lo procesa (puede tardar unos minutos).
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre de la Boda</Label>
                                            <Input
                                                id="name"
                                                placeholder="Ej: Boda Juan y Ana"
                                                value={createData.name}
                                                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="event_date">Fecha del Evento</Label>
                                            <Input
                                                id="event_date"
                                                type="date"
                                                value={createData.event_date}
                                                onChange={(e) => setCreateData({ ...createData, event_date: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="access_code_id">Cliente / Boda (Código de Acceso)</Label>
                                            <Select
                                                value={createData.access_code_id}
                                                onValueChange={(val) => setCreateData({ ...createData, access_code_id: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accessCodes.map((code) => (
                                                        <SelectItem key={code.id} value={code.id.toString()}>
                                                            {code.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="external_url">Link Externo (Opcional)</Label>
                                            <Input
                                                id="external_url"
                                                placeholder="https://..."
                                                value={createData.external_url}
                                                onChange={(e) => setCreateData({ ...createData, external_url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="video">Archivo de Video</Label>
                                            <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <UploadCloud className="size-5 text-zinc-500" />
                                                <Input
                                                    id="video"
                                                    type="file"
                                                    accept="video/*"
                                                    className="border-0 bg-transparent p-0 file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                                                    onChange={(e) => setCreateData({ ...createData, video: e.target.files ? e.target.files[0] : null })}
                                                    required
                                                />
                                            </div>
                                            {uploading && (
                                                <div className="space-y-1">
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${uploadPct}%` }} />
                                                    </div>
                                                    <p className="text-xs text-zinc-500">Subiendo… {uploadPct}%</p>
                                                </div>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={uploading}>
                                                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {uploading ? 'Subiendo...' : 'Publicar'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isEditOpen} onOpenChange={(o) => { if (!replacing) setIsEditOpen(o); }}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Editar Proyecto</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-name">Nombre</Label>
                                            <Input
                                                id="edit-name"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-event_date">Fecha</Label>
                                            <Input
                                                id="edit-event_date"
                                                type="date"
                                                value={editData.event_date}
                                                onChange={(e) => setEditData('event_date', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="edit-access_code_id">Cliente / Boda</Label>
                                            <Select
                                                value={editData.access_code_id.toString()}
                                                onValueChange={(val) => setEditData('access_code_id', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accessCodes.map((code) => (
                                                        <SelectItem key={code.id} value={code.id.toString()}>
                                                            {code.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="edit-external_url">Link Externo</Label>
                                            <Input
                                                id="edit-external_url"
                                                value={editData.external_url}
                                                onChange={(e) => setEditData('external_url', e.target.value)}
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={processingEdit}>
                                                {processingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Guardar Cambios
                                            </Button>
                                        </DialogFooter>
                                    </form>

                                    {/* Reemplazo de video (flujo aparte, sube directo a Bunny) */}
                                    <div className="space-y-2 border-t pt-4">
                                        <Label htmlFor="replace-video">Reemplazar Video (Opcional)</Label>
                                        <Input
                                            id="replace-video"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setReplaceFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                        {replacing && (
                                            <div className="space-y-1">
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${replacePct}%` }} />
                                                </div>
                                                <p className="text-xs text-zinc-500">Subiendo… {replacePct}%</p>
                                            </div>
                                        )}
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            disabled={!replaceFile || replacing}
                                            onClick={handleReplaceVideo}
                                        >
                                            {replacing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Subir nuevo video
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre / Evento</TableHead>
                                        <TableHead>Cliente / Boda</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Link Externo</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                No hay videos subidos.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        projects.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {project.thumbnail_url && project.video_status === 'ready' ? (
                                                            <img src={project.thumbnail_url} alt={project.name} className="h-10 w-16 rounded object-cover bg-black" />
                                                        ) : (
                                                            <div className="flex h-10 w-16 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                                                                <FileVideo className="size-4 text-zinc-400" />
                                                            </div>
                                                        )}
                                                        <span>{project.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle className="size-4 text-zinc-400" />
                                                        <span className="text-sm">{project.access_code?.name || 'No asignado'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1 text-zinc-500">
                                                        <Calendar className="size-3" />
                                                        {format(new Date(project.event_date), 'dd/MM/yyyy')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge status={project.video_status} />
                                                        {project.video_status !== 'ready' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-7"
                                                                title="Refrescar estado"
                                                                onClick={() => refreshStatus(project.id)}
                                                            >
                                                                <RefreshCw className="size-3.5 text-zinc-500" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {project.external_url ? (
                                                        <a href={project.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-500 hover:underline">
                                                            <LinkIcon className="size-3" /> Link
                                                        </a>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => openEdit(project)}
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
                                                                    <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esto eliminará permanentemente el video de la nube y la base de datos.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => confirmDelete(project.id)}
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
