"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    venue?: string;
    visibility: string;
    type: string;
    fee: number;
    imageUrl?: string;
    organizer?: { name: string };
  };
}

export function EventCard({ event }: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const feeDisplay = event.type === "FREE" ? "Free" : `$${event.fee}`;

  return (
    <Card className="overflow-hidden group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image Area */}
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0" />
        )}
        <img
          src={event.imageUrl || "/placeholder-event.svg"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-event.svg";
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Content Area */}
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-base font-semibold line-clamp-1">
          {event.title}
        </CardTitle>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
        {/* Meta Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{formattedDate}</Badge>
          <Badge
            variant="secondary"
            className={
              event.type === "PAID"
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            {feeDisplay}
          </Badge>
          <Badge variant="outline">
            {event.visibility} {event.type}
          </Badge>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="secondary" asChild>
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
