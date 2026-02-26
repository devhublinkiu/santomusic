import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
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
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Plus, Edit, Loader2, UploadCloud, ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    images: string[] | null;
    created_at: string;
}

export default function ProductsIndex({ products }: { products: Product[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form for Creating
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        name: '',
        description: '',
        price: '',
        images: [] as File[],
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
        description: '',
        price: '',
        images: null as File[] | null,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success('Producto creado correctamente');
            },
            onError: () => {
                toast.error('Error al crear el producto.');
            }
        });
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setEditData({
            _method: 'PUT',
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            images: null,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        postEdit(route('admin.products.update', editingProduct.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                resetEdit();
                setEditingProduct(null);
                toast.success('Producto actualizado correctamente');
            },
            onError: () => {
                toast.error('Error al actualizar el producto.');
            }
        });
    };

    const confirmDelete = (productId: number) => {
        router.delete(route('admin.products.destroy', productId), {
            onSuccess: () => toast.success('Producto eliminado correctamente'),
            onError: () => toast.error('Error al eliminar'),
        });
    };

    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Tienda de Productos
                </h2>
            }
        >
            <Head title="Productos - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="size-5 text-indigo-500" />
                                    Catálogo de Productos
                                </CardTitle>
                                <CardDescription>
                                    Gestiona los productos que se muestran en la tienda pública.
                                </CardDescription>
                            </div>

                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        <Plus className="mr-2 size-4" /> Nuevo Producto
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xl">
                                    <DialogHeader>
                                        <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                                        <DialogDescription>
                                            Completa los detalles del producto. Puedes subir hasta 5 imágenes.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="name">Nombre del Producto</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Ej: Mezcla Master"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="description">Descripción</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Describe las características del producto..."
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    rows={3}
                                                />
                                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="price">Precio (COP)</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    placeholder="Ej: 50000"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    required
                                                />
                                                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Imágenes (Máx 5)</Label>
                                            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors relative">
                                                <UploadCloud className="size-8 text-zinc-500" />
                                                <p className="text-sm text-zinc-500">Haz clic para seleccionar imágenes</p>
                                                <Input
                                                    id="images"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        if (files.length > 5) {
                                                            toast.error('Solo puedes subir hasta 5 imágenes');
                                                            return;
                                                        }
                                                        setData('images', files);
                                                    }}
                                                />
                                            </div>
                                            {data.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {data.images.map((img, i) => (
                                                        <div key={i} className="relative size-16 rounded-md overflow-hidden border">
                                                            <img src={URL.createObjectURL(img)} className="size-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('images', data.images.filter((_, idx) => idx !== i))}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                                                            >
                                                                <X className="size-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {progress && (
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 mt-2">
                                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                                                </div>
                                            )}
                                            {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={processing} className="w-full">
                                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {processing ? 'Publicando...' : 'Crear Producto'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogContent className="sm:max-w-xl">
                                    <DialogHeader>
                                        <DialogTitle>Editar Producto</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="edit-name">Nombre</Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="edit-description">Descripción</Label>
                                                <Textarea
                                                    id="edit-description"
                                                    value={editData.description}
                                                    onChange={(e) => setEditData('description', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="edit-price">Precio (COP)</Label>
                                                <Input
                                                    id="edit-price"
                                                    type="number"
                                                    value={editData.price}
                                                    onChange={(e) => setEditData('price', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Reemplazar Imágenes (Opcional, máx 5)</Label>
                                            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors relative">
                                                <UploadCloud className="size-8 text-zinc-500" />
                                                <Input
                                                    id="edit-images"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        if (files.length > 5) {
                                                            toast.error('Solo puedes subir hasta 5 imágenes');
                                                            return;
                                                        }
                                                        setEditData('images', files);
                                                    }}
                                                />
                                            </div>
                                            {editData.images && editData.images.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {editData.images.map((img, i) => (
                                                        <div key={i} className="relative size-16 rounded-md overflow-hidden border">
                                                            <img src={URL.createObjectURL(img)} className="size-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                editingProduct?.images && (
                                                    <div className="flex flex-wrap gap-2 mt-2 opacity-50">
                                                        {editingProduct.images.map((img, i) => (
                                                            <div key={i} className="size-16 rounded-md overflow-hidden border">
                                                                <img src={img} className="size-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                            {progressEdit && (
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 mt-2">
                                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressEdit.percentage}%` }} />
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processingEdit} className="w-full">
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
                                        <TableHead className="w-[80px]">Imagen</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                                No hay productos registrados en la tienda.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="size-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} className="size-full object-cover" alt={product.name} />
                                                        ) : (
                                                            <ImageIcon className="size-5 text-zinc-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold">{product.name}</TableCell>
                                                <TableCell className="max-w-[300px] truncate text-zinc-500">
                                                    {product.description || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-indigo-500 font-bold">
                                                        ${new Intl.NumberFormat('es-CO').format(Number(product.price))}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => openEdit(product)}
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
                                                                    <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esto eliminará permanentemente el producto y sus imágenes.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => confirmDelete(product.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white"
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
