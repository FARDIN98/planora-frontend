"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { AnimatedSection } from "@/components/shared/animated-section";

import { useEvents, useFeaturedEvent } from "@/hooks/use-events";
import { useJoinEvent } from "@/hooks/use-registrations";
import { useAuth } from "@/lib/auth";

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

function getHeroAction(
  event: FeaturedEventType,
  user: { id: string } | null,
) {
  if (!user)
    return { label: "Login to Join", action: "login" as const };
  if (event.organizerId === user.id)
    return { label: "View Event", action: "view" as const };
  if (event.userRegistration?.status === "APPROVED")
    return { label: "You're In!", action: "disabled" as const };
  if (event.userRegistration?.status === "PENDING")
    return { label: "Pending Approval", action: "disabled" as const };
  if (event.userRegistration?.status === "BANNED")
    return { label: "Banned", action: "disabled" as const };
  if (event.visibility === "PUBLIC" && event.type === "FREE")
    return { label: "Join Event", action: "join" as const };
  if (event.visibility === "PUBLIC" && event.type === "PAID")
    return { label: `Pay ৳${event.fee} & Join`, action: "join" as const };
  if (event.visibility === "PRIVATE" && event.type === "FREE")
    return { label: "Request to Join", action: "join" as const };
  if (event.visibility === "PRIVATE" && event.type === "PAID")
    return { label: "Pay & Request", action: "join" as const };
  return { label: "Join Event", action: "join" as const };
}

type FeaturedEventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  fee: number;
  visibility: string;
  organizerId: string;
  organizer: { id: string; name: string };
  _count: { registrations: number };
  userRegistration?: { id: string; status: string } | null;
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const featuredQuery = useFeaturedEvent();
  const gridQuery = useEvents({ limit: 9 });
  const joinEvent = useJoinEvent();

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

  const heroEvent = featuredQuery.data as FeaturedEventType | null | undefined;
  const gridEvents = (gridQuery.data?.events ?? []) as EventCardEvent[];

  const heroAction = heroEvent ? getHeroAction(heroEvent, user) : null;

  const handleHeroJoin = async () => {
    if (!heroEvent || !heroAction) return;
    if (heroAction.action === "login") {
      router.push("/login");
    } else if (heroAction.action === "view") {
      router.push(`/events/${heroEvent.id}`);
    } else if (heroAction.action === "join") {
      await joinEvent.mutateAsync({ eventId: heroEvent.id });
    }
  };

  return (
    <main id="main-content">
      {/* Hero Section — Featured Event */}
      <AnimatedSection>
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
              {featuredQuery.isLoading ? (
                <EventCardSkeleton />
              ) : heroEvent ? (
                <Card className="transition-shadow duration-200 hover:shadow-lg">
                  <Link href={`/events/${heroEvent.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="font-semibold line-clamp-2">
                          {heroEvent.title}
                        </CardTitle>
                        <Badge
                          variant={heroEvent.type === "FREE" ? "secondary" : "default"}
                          className="shrink-0"
                        >
                          {heroEvent.type === "FREE" ? "FREE" : `৳${heroEvent.fee}`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>
                          {new Date(heroEvent.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} at {heroEvent.time}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        by {heroEvent.organizer.name}
                      </div>
                    </CardContent>
                  </Link>
                  <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{heroEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{heroEvent._count?.registrations ?? 0}</span>
                      </div>
                      <Button
                        className="min-h-11 px-8"
                        disabled={heroAction?.action === "disabled" || joinEvent.isPending}
                        onClick={handleHeroJoin}
                      >
                        {joinEvent.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {joinEvent.isPending ? "Joining..." : heroAction?.label ?? "Join"}
                      </Button>
                    </div>
                  </div>
                </Card>
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
      </AnimatedSection>

      {/* Upcoming Events — Auto-scrolling Slider */}
      <AnimatedSection>
      <section className="bg-muted py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Link
              href="/events"
              className="text-primary hover:underline text-sm font-medium"
            >
              See All <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
        </div>
        {gridQuery.isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : gridEvents.length > 0 ? (
          <div className="overflow-hidden group/slider">
            <div
              className="flex gap-6 animate-scroll hover:[animation-play-state:paused]"
              style={{
                width: "max-content",
              }}
            >
              {/* Duplicate cards for seamless infinite loop */}
              {[...gridEvents, ...gridEvents].map((event, i) => (
                <div key={`${event.id}-${i}`} className="w-[340px] shrink-0">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </section>
      </AnimatedSection>

      {/* Categories Section */}
      <AnimatedSection>
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
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
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
      </AnimatedSection>
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
