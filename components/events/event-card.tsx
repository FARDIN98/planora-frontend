"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    type: string;
    fee: number;
    visibility: string;
    organizer: { name: string };
    _count?: { registrations: number };
    averageRating?: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full transition-shadow duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="font-semibold line-clamp-2">
              {event.title}
            </CardTitle>
            <Badge
              variant={event.type === "FREE" ? "secondary" : "default"}
              className="shrink-0"
            >
              {event.type === "FREE" ? "FREE" : `৳${event.fee}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              {formattedDate} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground justify-between">
          <span>by {event.organizer.name}</span>
          <div className="flex items-center gap-3">
            {event.averageRating != null && event.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{event.averageRating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{event._count?.registrations ?? 0}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
