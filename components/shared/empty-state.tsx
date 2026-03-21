import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  heading,
  body,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{body}</p>
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
      {ctaLabel && onCtaClick && !ctaHref && (
        <Button onClick={onCtaClick}>{ctaLabel}</Button>
      )}
    </div>
  );
}
