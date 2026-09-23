export function ProductCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 bg-neutral-100 rounded" />
        <div className="h-4 w-3/4 bg-neutral-100 rounded" />
        <div className="h-4 w-1/2 bg-neutral-100 rounded" />
      </div>
    </div>
  );
}
