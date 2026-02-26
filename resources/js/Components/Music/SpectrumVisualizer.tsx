import React from 'react';

interface SpectrumVisualizerProps {
    isPlaying: boolean;
    className?: string;
}

export const SpectrumVisualizer = ({ isPlaying, className = "" }: SpectrumVisualizerProps) => {
    // Generate 12 bars with staggered animation delays
    const bars = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: i * 0.1,
        // Randomize initial heights slightly for a more organic feel
        initialHeight: 20 + Math.random() * 40
    }));

    return (
        <div className={`flex items-end gap-[3px] h-full w-full justify-center px-2 py-3 ${className}`}>
            {bars.map((bar) => (
                <div
                    key={bar.id}
                    className={`
                        w-1.5 rounded-full bg-gradient-to-t from-indigo-600 via-violet-500 to-indigo-400
                        transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]
                        ${isPlaying ? 'animate-spectrum' : 'h-1.5 opacity-40'}
                    `}
                    style={{
                        height: isPlaying ? '100%' : `${bar.initialHeight}%`,
                        animationDelay: `${bar.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};
