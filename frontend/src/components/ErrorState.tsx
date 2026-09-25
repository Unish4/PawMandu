import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="text-center py-16">
      <AlertTriangle size={32} className="mx-auto mb-3 text-red-500" />
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          Retry
        </button>
      )}
    </div>
  );
}
