"use client";

import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialsProps {
  testimonials: {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    event: { title: string };
  }[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          What People Say
        </h2>
      </div>
      <div className="overflow-hidden py-1">
        <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]" style={{ width: "max-content" }}>
          {[...testimonials, ...testimonials].map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="w-[380px] shrink-0 px-1"
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-6 w-6 text-amber-400" />
                  <p className="text-sm line-clamp-3 text-foreground">
                    {testimonial.comment}
                  </p>
                  <StarRating rating={testimonial.rating} />
                  <div>
                    <p className="font-semibold text-sm">
                      {testimonial.user.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.event.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
