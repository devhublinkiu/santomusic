import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { 
    ShoppingBag, 
    Search, 
    Filter, 
    ChevronRight, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertCircle,
    Eye
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Order {
    id: number;
    total: string;
    status: string;
    customer_info: {
        name: string;
        email: string;
        phone: string;
    };
    created_at: string;
}

interface Props {
    orders: {
        data: Order[];
        links: any[];
    };
    filters: {
        status?: string;
        search?: string;
    };
}

const statusConfig: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: 'Pendiente', icon: Clock, variant: 'outline' },
    paid: { label: 'Pagado', icon: CheckCircle2, variant: 'secondary' },
    failed: { label: 'Fallido', icon: XCircle, variant: 'destructive' },
    cancelled: { label: 'Cancelado', icon: AlertCircle, variant: 'outline' },
    shipped: { label: 'Enviado', icon: ShoppingBag, variant: 'default' },
    delivered: { label: 'Entregado', icon: CheckCircle2, variant: 'secondary' },
};

export default function OrdersIndex({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.orders.index'), { search, status: filters.status }, { preserveState: true });
    };

    const handleStatusChange = (status: string) => {
        router.get(route('admin.orders.index'), { search: filters.search, status }, { preserveState: true });
    };

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Pedidos</h2>}
        >
            <Head title="Gestión de Pedidos - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="border-none shadow-premium dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="size-5 text-indigo-500" />
                                    Ventas y Pedidos
                                </CardTitle>
                                <CardDescription>
                                    Gestión y seguimiento de todas las transacciones realizadas.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                    <Input
                                        placeholder="Buscar..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 w-64"
                                    />
                                </form>

                                <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-40">
                                        <div className="flex items-center gap-2">
                                            <Filter className="size-4 text-zinc-500" />
                                            <SelectValue placeholder="Estado" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="pending">Pendientes</SelectItem>
                                        <SelectItem value="paid">Pagados</SelectItem>
                                        <SelectItem value="failed">Fallidos</SelectItem>
                                        <SelectItem value="shipped">Enviados</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                            <TableBody>
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => {
                                        const config = statusConfig[order.status] || statusConfig.cancelled;
                                        const StatusIcon = config.icon;
                                        
                                        return (
                                            <TableRow key={order.id} className="group hover:bg-muted/50 border-border transition-colors">
                                                <TableCell className="font-mono text-muted-foreground py-6 px-8 text-center">#{order.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">{order.customer_info.name}</span>
                                                        <span className="text-[10px] text-muted-foreground lowercase">{order.customer_info.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={config.variant} className="gap-2 px-3 py-1 rounded-full uppercase tracking-widest text-[9px] font-black">
                                                        <StatusIcon className="size-3" />
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString('es-CO', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-bold text-foreground">
                                                    ${new Intl.NumberFormat('es-CO').format(Number(order.total))}
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Link href={route('admin.orders.show', order.id)}>
                                                        <Button variant="ghost" className="size-10 p-0 rounded-xl hover:bg-foreground hover:text-background transition-all">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                                                <ShoppingBag className="size-12" />
                                                <p className="text-xs font-black uppercase tracking-widest">No se encontraron pedidos</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        </CardContent>


                    {/* Simple Pagination Placeholder */}
                    {orders.links.length > 3 && (
                        <div className="flex justify-center gap-2">
                             {/* Pagination logic here if needed */}
                        </div>
                    )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
