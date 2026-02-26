"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuroraTextProps {
    children: ReactNode;
    className?: string;
    colors?: string[];
    speed?: number;
}

export function AuroraText({
    children,
    className,
    colors = ["#949494ff", "#dadadaff", "#556475ff", "#cfcfcfff"],
    speed = 1,
}: AuroraTextProps) {
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        const element = textRef.current;
        const colorStops = colors.join(", ");

        element.style.setProperty("--aurora-colors", colorStops);
        element.style.setProperty("--aurora-speed", `${20 / speed}s`);
    }, [colors, speed]);

    return (
        <span
            ref={textRef}
            className={cn(
                "relative inline-block bg-gradient-to-r from-[var(--aurora-color-1)] via-[var(--aurora-color-2)] to-[var(--aurora-color-3)] bg-clip-text text-transparent",
                "animate-aurora bg-[length:200%_auto]",
                className
            )}
            style={
                {
                    "--aurora-color-1": colors[0],
                    "--aurora-color-2": colors[1] || colors[0],
                    "--aurora-color-3": colors[2] || colors[1] || colors[0],
                } as CSSProperties
            }
        >
            {children}
        </span>
    );
}
