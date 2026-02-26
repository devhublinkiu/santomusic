import React, { useState } from 'react';
import { useMusic } from '@/Contexts/MusicContext';
import { Button } from '@/Components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Maximize2, Shuffle, Repeat } from 'lucide-react';
import { Slider } from '../ui/slider';
import { BlurFade } from '@/Components/magicui/blur-fade';
import { Ripple } from '@/Components/magicui/ripple';
import { SpectrumVisualizer } from './SpectrumVisualizer';

export default function AudioPlayer() {
    const { 
        currentSong, isPlaying, togglePlay, progress, 
        duration, setProgress, volume, setVolume,
        playNext, playPrevious, isLooping, setIsLooping, 
        isShuffled, setIsShuffled
    } = useMusic();

    const [isExpanded, setIsExpanded] = useState(false);

    if (!currentSong) return null;

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 z-[60] w-full p-4 pointer-events-none">
            <BlurFade delay={0} className="w-full">
                <div className={`
                    relative mx-auto transition-all duration-500 ease-in-out
                    ${isExpanded ? 'max-w-6xl p-8 rounded-3xl' : 'max-w-5xl p-4 rounded-2xl'}
                    bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto overflow-hidden group/player
                `}>
                    {/* Ripple background effect */}
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                        <Ripple mainCircleSize={350} mainCircleOpacity={0.30} numCircles={5} className="[mask-image:radial-gradient(circle_at_center,white,transparent)]" />
                    </div>
                    
                    <div className="relative flex items-center gap-6 z-10">
                        {/* Spectrum Visualizer & Title */}
                        <div className={`flex items-center gap-6 transition-all duration-500 basis-1/4 ${isExpanded ? 'min-w-[340px]' : 'min-w-[240px]'}`}>
                            <div className={`
                                transition-all duration-500 rounded-xl bg-zinc-900/50 border border-white/5 overflow-hidden flex-shrink-0
                                ${isExpanded ? 'size-24' : 'size-16'}
                            `}>
                                <SpectrumVisualizer isPlaying={isPlaying} className="scale-x-[-1]" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className={`font-bold truncate tracking-tight transition-all ${isExpanded ? 'text-lg' : 'text-sm'}`}>{currentSong.title}</h4>
                                <p className={`text-zinc-500 uppercase tracking-widest font-bold truncate transition-all ${isExpanded ? 'text-xs mt-1' : 'text-[10px]'}`}>
                                    {currentSong.album?.title || 'Santo Music'}
                                </p>
                            </div>
                        </div>

                        {/* Controls & Progress */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-center gap-6">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`
                                        transition-all duration-300
                                        ${isShuffled ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300' : 'text-zinc-500 hover:text-white hover:bg-white/10'}
                                    `}
                                    onClick={() => setIsShuffled(!isShuffled)}
                                    title={isShuffled ? "Desactivar Aleatorio" : "Activar Aleatorio"}
                                >
                                    <Shuffle className={`size-4 ${isShuffled ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : ''}`} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                    onClick={playPrevious}
                                >
                                    <SkipBack className="size-5 fill-current" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    className="size-10 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-1" />}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                    onClick={playNext}
                                >
                                    <SkipForward className="size-5 fill-current" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`
                                        transition-all duration-300
                                        ${isLooping ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300' : 'text-zinc-500 hover:text-white hover:bg-white/10'}
                                    `}
                                    onClick={() => setIsLooping(!isLooping)}
                                    title={isLooping ? "Desactivar Bucle" : "Activar Bucle"}
                                >
                                    <Repeat className={`size-4 ${isLooping ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : ''}`} />
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] tabular-nums text-zinc-500 w-10 text-right">
                                    {formatTime(progress)}
                                </span>
                                <Slider
                                    value={[progress]}
                                    max={duration || 100}
                                    step={1}
                                    className="flex-1 cursor-pointer"
                                    onValueChange={(val: number[]) => setProgress(val[0])}
                                />
                                <span className="text-[10px] tabular-nums text-zinc-500 w-10">
                                    {formatTime(duration)}
                                </span>
                            </div>
                        </div>

                        {/* Extra Controls */}
                        <div className={`hidden md:flex items-center gap-4 basis-1/4 justify-end transition-all duration-500 ${isExpanded ? 'min-w-[340px]' : 'min-w-[240px]'}`}>
                            <div className="flex items-center gap-3 w-32 px-4 py-2 rounded-xl bg-white/5 border border-white/5 group/volume">
                                <Volume2 className="size-4 text-zinc-500 group-hover/volume:text-white transition-colors" />
                                <Slider
                                    value={[volume * 100]}
                                    max={100}
                                    step={1}
                                    className="flex-1"
                                    onValueChange={(val) => setVolume(val[0] / 100)}
                                />
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`text-zinc-500 hover:text-white hover:bg-white/10 transition-all ${isExpanded ? 'text-indigo-400' : ''}`}
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <Maximize2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </BlurFade>
        </div>
    );
}
