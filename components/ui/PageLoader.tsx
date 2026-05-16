import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 w-full">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
        {message}
      </p>
    </div>
  );
}
