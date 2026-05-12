import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mt-16 flex flex-col items-center text-center gap-3 px-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle size={28} className="text-destructive" />
      </div>
      <p className="text-base font-semibold text-foreground">Unable to load data</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-soft active:scale-[0.98] transition-transform"
        >
          Try again
        </button>
      )}
    </div>
  );
}
