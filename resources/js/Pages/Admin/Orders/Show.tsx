import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    CreditCard,
    Package,
    CheckCircle2,
    Truck,
    Clock,
    XCircle,
    AlertCircle,
    Printer,
    ExternalLink
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/Components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderItem {
    id: number;
    product: {
        name: string;
        images: string[];
    };
    quantity: number;
    price: string;
}

interface Order {
    id: number;
    total: string;
    status: string;
    payment_id: string | null;
    customer_info: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    created_at: string;
}

const statusOptions = [
    { value: 'pending', label: 'Pendiente', icon: Clock, variant: 'outline' as const },
    { value: 'paid', label: 'Pagado', icon: CheckCircle2, variant: 'secondary' as const },
    { value: 'failed', label: 'Fallido', icon: XCircle, variant: 'destructive' as const },
    { value: 'cancelled', label: 'Cancelado', icon: AlertCircle, variant: 'outline' as const },
    { value: 'shipped', label: 'Enviado', icon: Truck, variant: 'default' as const },
    { value: 'delivered', label: 'Entregado', icon: CheckCircle2, variant: 'secondary' as const },
];

export default function OrderShow({ order }: { order: Order }) {
    const { data, setData, patch, processing } = useForm({
        status: order.status
    });

    const handleStatusUpdate = (val: string) => {
        setData('status', val);
        patch(route('admin.orders.status.update', order.id), {
            onSuccess: () => toast.success("Estado actualizado"),
            preserveScroll: true
        });
    };

    const currentStatus = statusOptions.find(opt => opt.value === order.status) || statusOptions[0];

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Detalle de Pedido</h2>}
        >
            <Head title={`Admin: Pedido #${order.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href={route('admin.orders.index')}>
                                <Button variant="outline" className="size-12 rounded-2xl bg-background border-border hover:bg-muted group">
                                    <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                                </Button>
                            </Link>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-foreground">Pedido #{order.id}</h1>
                                    <Badge variant={currentStatus.variant} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                        {currentStatus.label}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="size-3" />
                                    {new Date(order.created_at).toLocaleDateString('es-CO', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="bg-background border-border h-12 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                                <Printer className="size-4 mr-2" />
                                Imprimir
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Order Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border border-border shadow-premium bg-card overflow-hidden rounded-[2.5rem]">
                                <CardHeader className="p-8 pb-4">
                                    <h3 className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-3 text-foreground">
                                        <Package className="size-5 text-muted-foreground" />
                                        Artículos del Pedido
                                    </h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="space-y-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-6 items-center group">
                                                <div className="size-20 rounded-2xl bg-muted flex-shrink-0 overflow-hidden border border-border">
                                                    <img src={item.product?.images?.[0]} className="size-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="text-foreground font-bold uppercase tracking-tight italic">{item.product?.name}</h4>
                                                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Cantidad: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-foreground font-mono">${new Intl.NumberFormat('es-CO').format(Number(item.price))}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black">Subtotal</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-border space-y-4">
                                        <div className="flex justify-between items-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
                                            <span>Subtotal</span>
                                            <span className="font-mono text-foreground">${new Intl.NumberFormat('es-CO').format(Number(order.total))}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
                                            <span>Envío</span>
                                            <span className="text-emerald-500">Gratis (Standard)</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4">
                                            <span className="text-3xl font-black uppercase tracking-tighter italic text-foreground leading-none">Total</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-mono font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                                                    ${new Intl.NumberFormat('es-CO').format(Number(order.total))}
                                                </span>
                                                <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mt-1">COP (Pesos Colombianos)</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Customer & Status Section */}
                        <div className="space-y-8">
                            {/* Status Control */}
                            <Card className="border border-border shadow-premium bg-card rounded-[2.5rem]">
                                <CardHeader className="p-8 pb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground italic">Estado del Pedido</h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    <Select value={data.status} onValueChange={handleStatusUpdate} disabled={processing}>
                                        <SelectTrigger className="w-full bg-background border-border h-14 rounded-2xl focus:ring-1 focus:ring-ring">
                                            <div className="flex items-center gap-3 text-foreground">
                                                <currentStatus.icon className="size-5 text-primary" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border text-popover-foreground shadow-2xl">
                                            {statusOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value} className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <opt.icon className="size-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                                {order.payment_id && (
                                    <CardFooter className="px-8 pb-8 pt-0">
                                        <div className="w-full p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="size-4 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">BOLD ID</span>
                                                    <span className="text-[10px] font-mono text-foreground truncate max-w-[120px]">{order.payment_id}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="size-8 p-0 rounded-lg hover:bg-foreground hover:text-background transition-all">
                                                <ExternalLink className="size-3" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                )}
                            </Card>

                            {/* Customer Info */}
                            <Card className="border border-border shadow-premium bg-card rounded-[2.5rem]">
                                <CardHeader className="p-8 pb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground italic">Cliente</h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center border border-border">
                                            <User className="size-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-bold uppercase tracking-tight italic">{order.customer_info.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Comprador</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:border-primary transition-colors">
                                                <Mail className="size-4 text-muted-foreground group-hover:text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Email</span>
                                                <span className="text-[10px] text-foreground underline decoration-muted group-hover:decoration-primary transition-all">{order.customer_info.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:border-emerald-500 transition-colors">
                                                <Phone className="size-4 text-muted-foreground group-hover:text-emerald-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Teléfono</span>
                                                <span className="text-[10px] text-foreground group-hover:text-emerald-500 transition-colors">{order.customer_info.phone}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                                                <MapPin className="size-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Dirección</span>
                                                <span className="text-[10px] text-foreground leading-tight">{order.customer_info.address || 'Sin especificar'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
