import { cn } from "@/lib/utils";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

/**
 * Reusable SVG circular progress indicator.
 * Pass in progress (0-100) to animate the stroke filling up.
 */
export function CircularProgress({
  progress,
  size = 64,
  strokeWidth = 3,
  className,
  trackClassName,
  indicatorClassName,
}: CircularProgressProps) {
  // Add a small padding to prevent SVG stroke clipping at the edges
  const padding = 2;
  const radius = (size - strokeWidth - padding * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp progress between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <svg
      className={cn("-rotate-90 transform", className)}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={cn("stroke-slate-200", trackClassName)}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={cn(
          "transition-all duration-300 ease-out",
          indicatorClassName,
        )}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
}
