export function AppFooter() {
    return (
        <footer className="w-full py-6 md:py-2 items-center justify-center">
            <div className="flex flex-col items-center">
                <p className="text-muted-foreground text-center text-sm leading-loose">
                    Hecho por{" "}
                    <a
                        href="https://linkiu.bio"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Linkiu
                    </a>
                    .
                </p>
            </div>
        </footer>
    )
}
