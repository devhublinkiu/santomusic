export function AppFooter() {
    return (
        <footer className="w-full py-6 md:py-2 items-center justify-center">
            <div className="flex flex-col items-center">
                <p className="text-muted-foreground text-center text-[10px] uppercase font-bold tracking-widest opacity-30">
                    &copy; {new Date().getFullYear()} Santo.
                </p>
            </div>
        </footer>
    )
}
