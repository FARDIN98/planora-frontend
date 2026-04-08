import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import type { HomepageEvent } from "@/hooks/use-homepage";

interface UpcomingGridProps {
  events?: HomepageEvent[];
  isLoading?: boolean;
}

export function UpcomingGrid({ events, isLoading }: UpcomingGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No upcoming events at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
