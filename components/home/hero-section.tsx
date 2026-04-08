"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomepageEvent } from "@/hooks/use-homepage";

interface HeroSectionProps {
  featuredEvents?: HomepageEvent[];
  isLoading?: boolean;
}

export function HeroSection({ featuredEvents, isLoading }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const events = featuredEvents ?? [];

  const rotateEvent = useCallback(() => {
    if (events.length <= 1) return;
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
      setIsVisible(true);
    }, 500);
  }, [events.length]);

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(rotateEvent, 5000);
    return () => clearInterval(interval);
  }, [events.length, rotateEvent]);

  const currentEvent = events[currentIndex];

  return (
    <section className="min-h-[60vh] flex items-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left: Text content */}
          <div className="w-full lg:w-1/2 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ) : currentEvent ? (
              <div
                className="space-y-4 transition-opacity duration-500"
                style={{ opacity: isVisible ? 1 : 0 }}
              >
                <Badge variant="secondary" className="text-xs">
                  Featured Event
                </Badge>
                <h1 className="text-3xl font-semibold tracking-tight leading-tight">
                  {currentEvent.title}
                </h1>
                {currentEvent.description && (
                  <p className="text-muted-foreground text-base line-clamp-2">
                    {currentEvent.description}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {new Date(currentEvent.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                  <Badge
                    variant={
                      currentEvent.type === "FREE" ? "secondary" : "default"
                    }
                  >
                    {currentEvent.type === "FREE"
                      ? "Free"
                      : `$${currentEvent.fee}`}
                  </Badge>
                </div>

                {/* Dot indicators */}
                {events.length > 1 && (
                  <div className="flex gap-2 pt-2">
                    {events.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setIsVisible(false);
                          setTimeout(() => {
                            setCurrentIndex(i);
                            setIsVisible(true);
                          }, 300);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentIndex
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                        aria-label={`Go to featured event ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight leading-tight">
                  Discover Amazing Events
                </h1>
                <p className="text-muted-foreground text-base">
                  Create, discover, and join events seamlessly with Planora.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events">
                <Button variant="secondary" className="w-full sm:w-auto min-h-11">
                  Browse Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/events/create">
                <Button variant="default" className="w-full sm:w-auto min-h-11">
                  Create Your Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Featured event image */}
          <div className="w-full lg:w-1/2">
            {isLoading ? (
              <Skeleton className="aspect-video w-full rounded-lg" />
            ) : currentEvent?.imageUrl ? (
              <div
                className="transition-opacity duration-500 rounded-lg overflow-hidden"
                style={{ opacity: isVisible ? 1 : 0 }}
              >
                <img
                  src={currentEvent.imageUrl}
                  alt={currentEvent.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  {currentEvent
                    ? "No image available"
                    : "Your next event awaits"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
