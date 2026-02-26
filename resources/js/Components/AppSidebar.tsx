import * as React from "react"
import { Link, usePage } from "@inertiajs/react"
import {
    FolderKanban,
    LayoutDashboard,
    Music,
    QrCode,
    ShoppingBag,
    Star,
    Puzzle,
    Files,
    Users,
    Radio,
    Settings,
    Key,
    FileVideo,
    Youtube,
    ChevronRight,
    CreditCard,
    Package,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/Components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { site } = usePage().props as any
    const settings = site?.settings

    const navItems = [
        {
            title: "Dashboard",
            url: route('admin.dashboard'),
            icon: LayoutDashboard,
            isActive: route().current('admin.dashboard'),
        },
        {
            title: "Proyectos (Videos)",
            url: route('admin.projects.index'),
            icon: FileVideo,
            isActive: route().current('admin.projects.*'),
        },
        {
            title: "Generador de códigos",
            url: route('admin.access-codes.index'),
            icon: Key,
            isActive: route().current('admin.access-codes.*'),
        },
        {
            title: "Shop",
            url: route('admin.products.index'),
            icon: Package,
            isActive: route().current('admin.products.*'),
        },
        {
            title: "Pedidos",
            url: route('admin.orders.index'),
            icon: ShoppingBag,
            isActive: route().current('admin.orders.*'),
        },
        {
            title: "Álbumes",
            url: route('admin.albums.index'),
            icon: Music,
            isActive: route().current('admin.albums.*'),
        },
        {
            title: "Videos (Canal)",
            url: route('admin.videos.index'),
            icon: Youtube,
            isActive: route().current('admin.videos.*'),
        },
        {
            title: "Integraciones",
            url: "#",
            icon: Puzzle,
            isActive: route().current('admin.integrations.*'),
            items: [
                {
                    title: "Pasarela Bold",
                    url: route('admin.integrations.bold'),
                    icon: CreditCard,
                    isActive: route().current('admin.integrations.bold'),
                },
                {
                    title: "Canal Youtube",
                    url: route('admin.integrations.youtube'),
                    icon: Youtube,
                    isActive: route().current('admin.integrations.youtube'),
                }
            ]
        },
    ]

    const comingSoonItems = [
        {
            title: "Reseñas",
            url: "#",
            icon: Star,
            badge: "Próximamente",
        },
        {
            title: "Mis archivos",
            url: "#",
            icon: Files,
            badge: "Próximamente",
        },
        {
            title: "Usuarios",
            url: "#",
            icon: Users,
            badge: "Próximamente",
        },
        {
            title: "En vivo",
            url: "#",
            icon: Radio,
            badge: "Próximamente",
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-auto py-4 hover:bg-transparent">
                            <Link href="/" className="flex items-center justify-center w-full">
                                <div className="flex items-center justify-center overflow-hidden w-full px-2">
                                    {settings?.logo_app ? (
                                        <img src={settings.logo_app} alt="Santo Music" className="h-10 w-auto object-contain" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                                <Music className="size-4" />
                                            </div>
                                            <span className="font-semibold group-data-[collapsible=icon]:hidden">Santo Music</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item: any) => {
                                if (item.items && item.items.length > 0) {
                                    return (
                                        <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="border-l border-zinc-200 dark:border-zinc-800 ml-4 py-1 gap-1">
                                                        {item.items.map((subItem: any) => (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                                                                    <Link href={subItem.url} className="flex items-center gap-2 py-2">
                                                                        {subItem.icon && <subItem.icon className="size-3.5" />}
                                                                        <span className="text-xs">{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    )
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Próximamente</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {comingSoonItems.map((item: any) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} disabled>
                                        <div className="opacity-50 cursor-not-allowed">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                    <SidebarMenuBadge className="text-[10px]">{item.badge}</SidebarMenuBadge>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
