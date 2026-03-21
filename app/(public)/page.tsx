"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { useEvents } from "@/hooks/use-events";

const categories = [
  {
    icon: Globe,
    label: "Public Free",
    visibility: "PUBLIC",
    type: "FREE",
  },
  {
    icon: CreditCard,
    label: "Public Paid",
    visibility: "PUBLIC",
    type: "PAID",
  },
  {
    icon: Lock,
    label: "Private Free",
    visibility: "PRIVATE",
    type: "FREE",
  },
  {
    icon: ShieldCheck,
    label: "Private Paid",
    visibility: "PRIVATE",
    type: "PAID",
  },
] as const;

export default function HomePage() {
  const heroQuery = useEvents({ limit: 1 });
  const gridQuery = useEvents({ limit: 9 });

  const catPublicFree = useEvents({ limit: 1, visibility: "PUBLIC", type: "FREE" });
  const catPublicPaid = useEvents({ limit: 1, visibility: "PUBLIC", type: "PAID" });
  const catPrivateFree = useEvents({ limit: 1, visibility: "PRIVATE", type: "FREE" });
  const catPrivatePaid = useEvents({ limit: 1, visibility: "PRIVATE", type: "PAID" });

  const categoryCounts = [
    catPublicFree.data?.total ?? 0,
    catPublicPaid.data?.total ?? 0,
    catPrivateFree.data?.total ?? 0,
    catPrivatePaid.data?.total ?? 0,
  ];

  const heroEvent = heroQuery.data?.events?.[0] as EventCardEvent | undefined;
  const gridEvents = (gridQuery.data?.events ?? []) as EventCardEvent[];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.87 0 0) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl font-semibold tracking-tight leading-tight">
                Plan events that matter
              </h1>
              <p className="text-muted-foreground mt-4 text-base">
                Create, discover, and join events seamlessly.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/events">
                  <Button className="w-full sm:w-auto min-h-11">
                    Browse Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/events/create">
                  <Button variant="outline" className="w-full sm:w-auto min-h-11">Create Event</Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              {heroQuery.isLoading ? (
                <EventCardSkeleton />
              ) : heroEvent ? (
                <EventCard event={heroEvent} />
              ) : (
                <Card className="h-64 flex items-center justify-center">
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      No upcoming events yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="bg-muted py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
          {gridQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : gridEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <Link
                href="/events"
                className="text-primary hover:underline text-sm font-medium mt-6 inline-block"
              >
                See All Events <ArrowRight className="inline h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No events found</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={`/events?visibility=${cat.visibility}&type=${cat.type}`}
                >
                  <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-semibold">{cat.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {categoryCounts[index]} events
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Ready to make it happen?
              </h2>
              <p className="text-muted-foreground mt-3">
                Whether you&apos;re organizing a meetup or looking for your next
                experience, Planora makes it simple.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link href="/dashboard/events/create">
                <Button className="w-full sm:w-auto min-h-11">Create an Event</Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="w-full sm:w-auto min-h-11">Browse Events</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Type for EventCard compatibility with unknown[] from hook
type EventCardEvent = {
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
