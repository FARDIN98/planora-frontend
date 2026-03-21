"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({
  value,
  onChange,
  readonly = true,
  size = "sm",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const displayValue = hoverValue || value;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (readonly || !onChange) return;

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(5, (value || 0) + 1);
        onChange(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        const prev = Math.max(1, (value || 2) - 1);
        onChange(prev);
      }
    },
    [readonly, onChange, value]
  );

  return (
    <div
      className="flex items-center gap-0.5"
      role="radiogroup"
      aria-label="Star rating"
      onKeyDown={handleKeyDown}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(displayValue);

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            disabled={readonly}
            tabIndex={readonly ? -1 : star === Math.round(value || 1) ? 0 : -1}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={cn(
              "transition-colors min-h-11 min-w-11 flex items-center justify-center",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClass,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
