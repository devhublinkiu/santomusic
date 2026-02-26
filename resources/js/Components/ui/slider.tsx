import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: number[]
  max: number
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, max, onValueChange, ...props }, ref) => {
    const val = value[0]
    const percentage = (val / max) * 100

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center group", className)}>
        <div className="relative h-1 w-full grow overflow-hidden rounded-full bg-zinc-800">
          <div 
            className="absolute h-full bg-white transition-all group-hover:bg-indigo-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          min={0}
          max={max}
          value={val}
          onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
          className="absolute inset-0 h-1 w-full cursor-pointer opacity-0"
          {...props}
        />
        <div 
          className="absolute h-3 w-3 rounded-full bg-white border-2 border-indigo-500 shadow-md transition-all opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
