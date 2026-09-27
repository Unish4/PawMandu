import { useState } from "react";
import { Star } from "lucide-react";

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5"
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          aria-pressed={i === value}
        >
          <Star
            size={22}
            className={
              i <= (hovered || value)
                ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                : "text-neutral-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
