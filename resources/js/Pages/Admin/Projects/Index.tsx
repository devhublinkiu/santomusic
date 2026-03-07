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
import { FileVideo, Trash2, Plus, Calendar, Edit, Loader2, Link as LinkIcon, UploadCloud, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface Project {
    id: number;
    name: string;
    event_date: string;
    video_path: string;
    external_url: string | null;
    access_code_id: number | null;
    access_code?: {
        name: string;
    };
    created_at: string;
}

interface AccessCode {
    id: number;
    name: string;
}

export default function ProjectsIndex({ projects, accessCodes }: { projects: Project[], accessCodes: AccessCode[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form for Creating
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        name: '',
        event_date: '',
        video: null as File | null,
        external_url: '',
        access_code_id: '' as string | number,
    });

    // Form for Editing
    const {
        data: editData,
        setData: setEditData,
        post: postEdit,
        processing: processingEdit,
        errors: errorsEdit,
        reset: resetEdit,
        progress: progressEdit
    } = useForm({
        _method: 'PUT',
        name: '',
        event_date: '',
        video: null as File | null,
        external_url: '',
        access_code_id: '' as string | number,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.projects.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success('Proyecto creado correctamente');
            },
            onError: () => {
                toast.error('Error al subir el proyecto. Verifica el tamaño del archivo.');
            }
        });
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setEditData({
            _method: 'PUT',
            name: project.name,
            event_date: project.event_date,
            video: null,
            external_url: project.external_url || '',
            access_code_id: project.access_code_id || '',
        });
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
            onError: () => {
                toast.error('Error al actualizar.');
            }
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
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileVideo className="size-5 text-indigo-500" />
                                    Galería de Videos
                                </CardTitle>
                                <CardDescription>
                                    Carga los videos de las bodas. Se subirán automáticamente a la nube.
                                </CardDescription>
                            </div>

                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        <Plus className="mr-2 size-4" /> Nuevo Proyecto
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Subir Nuevo Video</DialogTitle>
                                        <DialogDescription>
                                            Sube el archivo de video. Puede tardar unos minutos dependiendo del peso.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre de la Boda</Label>
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
                                            <Label htmlFor="event_date">Fecha del Evento</Label>
                                            <Input
                                                id="event_date"
                                                type="date"
                                                value={data.event_date}
                                                onChange={(e) => setData('event_date', e.target.value)}
                                                required
                                            />
                                            {errors.event_date && <p className="text-xs text-red-500">{errors.event_date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="access_code_id">Cliente / Boda (Código de Acceso)</Label>
                                            <Select
                                                value={data.access_code_id.toString()}
                                                onValueChange={(val) => setData('access_code_id', val)}
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
                                            {errors.access_code_id && <p className="text-xs text-red-500">{errors.access_code_id}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="external_url">Link Externo (Opcional)</Label>
                                            <Input
                                                id="external_url"
                                                placeholder="https://..."
                                                value={data.external_url}
                                                onChange={(e) => setData('external_url', e.target.value)}
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
                                                    onChange={(e) => setData('video', e.target.files ? e.target.files[0] : null)}
                                                    required
                                                />
                                            </div>
                                            {progress && (
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                                                </div>
                                            )}
                                            {errors.video && <p className="text-xs text-red-500">{errors.video}</p>}
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {processing ? 'Subiendo...' : 'Publicar'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-video">Reemplazar Video (Opcional)</Label>
                                            <Input
                                                id="edit-video"
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => setEditData('video', e.target.files ? e.target.files[0] : null)}
                                            />
                                            {progressEdit && (
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressEdit.percentage}%` }} />
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processingEdit}>
                                                {processingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Guardar Cambios
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
                                        <TableHead>Nombre / Evento</TableHead>
                                        <TableHead>Cliente / Boda</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Link Externo</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                No hay videos subidos.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        projects.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{project.name}</span>
                                                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">{project.video_path}</span>
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
                                                                        Esto eliminará permanentemente el video del almacenamiento y la base de datos.
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
