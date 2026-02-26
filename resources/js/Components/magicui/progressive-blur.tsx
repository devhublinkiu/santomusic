import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
    className?: string;
    height?: string;
    position?: "top" | "bottom" | "both";
    blurLevels?: number[];
    children?: React.ReactNode;
}

export function ProgressiveBlur({
    className,
    height = "30%",
    position = "bottom",
    blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
    children,
}: ProgressiveBlurProps) {
    const renderBlur = (pos: "top" | "bottom") => {
        const isTop = pos === "top";
        const gradientStops = blurLevels
            .map((level, i) => {
                const percentage = (i / (blurLevels.length - 1)) * 100;
                return `rgba(0, 0, 0, ${level / 100}) ${percentage}%`;
            })
            .join(", ");

        return (
            <div
                className={cn(
                    "pointer-events-none absolute left-0 right-0 z-10",
                    isTop ? "top-0" : "bottom-0",
                    className
                )}
                style={{
                    height,
                    background: `linear-gradient(${isTop ? "to bottom" : "to top"
                        }, ${gradientStops})`,
                    backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
                    WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
                    maskImage: `linear-gradient(${isTop ? "to bottom" : "to top"
                        }, transparent, black)`,
                    WebkitMaskImage: `linear-gradient(${isTop ? "to bottom" : "to top"
                        }, transparent, black)`,
                }}
            />
        );
    };

    return (
        <>
            {(position === "top" || position === "both") && renderBlur("top")}
            {children}
            {(position === "bottom" || position === "both") && renderBlur("bottom")}
        </>
    );
}
