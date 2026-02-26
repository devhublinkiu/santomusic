import { PropsWithChildren, ReactNode } from "react"

import { AppFooter } from "@/Components/AppFooter"
import { AppNavbar } from "@/Components/AppNavbar"
import { AppSidebar } from "@/Components/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar"
import { Toaster } from "@/Components/ui/sonner"

export default function AppLayout({
    children,
    header,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <AppNavbar />
                    {header && (
                        <div className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 px-4 py-8 md:px-6 lg:px-8">
                            <div className="max-w-7xl mx-auto">
                                {header}
                            </div>
                        </div>
                    )}
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <AppFooter />
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    )
}
