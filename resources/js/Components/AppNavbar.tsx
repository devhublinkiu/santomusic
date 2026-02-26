import { Link, usePage } from "@inertiajs/react"
import { LogOut, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { SidebarTrigger } from "@/Components/ui/sidebar"

export function AppNavbar() {
    const { auth, site } = usePage().props as any
    const settings = site?.settings
    const user = auth.user

    return (
        <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2">
                            <div className="flex flex-col items-end text-sm">
                                <span className="font-medium leading-none">{user.name}</span>
                                <span className="text-muted-foreground text-xs leading-none">
                                    {user.is_admin ? "Administrador" : "Usuario"}
                                </span>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={settings?.app_profile || user.profile_photo_url} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-muted-foreground text-xs leading-none">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={route("profile.edit")}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </Link>
                            </DropdownMenuItem>
                            {user.is_admin && (
                                <DropdownMenuItem asChild>
                                    <Link href={route("admin.settings.index")}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Ajustes</span>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route("logout")} method="post" as="button" className="w-full text-left">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
