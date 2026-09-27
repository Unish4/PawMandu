import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-neutral-300"
          }
        />
      ))}
    </div>
  );
}
