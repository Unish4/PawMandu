interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]"
      role="status"
      aria-label="Loading"
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      {spinner}
    </div>
  );
}
