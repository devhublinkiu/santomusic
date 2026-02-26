import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
                className,
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    description,
    href,
    cta,
    date,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon?: any;
    description: string;
    href?: string;
    cta?: string;
    date?: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
            "bg-zinc-950 dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)]",
            className,
        )}
    >
        {background}

        {/* Text Container with dynamic visibility and gradient */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
            <div className="p-6 transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    {name}
                </h3>
                {date && <p className="text-sm font-medium text-pink-500/90">{date}</p>}
                <p className="max-w-lg text-zinc-300 text-xs mt-1 leading-relaxed">{description}</p>

                {href && (
                    <div className="mt-4">
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex items-center text-xs font-semibold text-white uppercase tracking-widest hover:underline"
                        >
                            {cta || "Ver más"}
                            <ArrowRightIcon className="ml-2 h-3 w-3" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export { BentoCard, BentoGrid };
