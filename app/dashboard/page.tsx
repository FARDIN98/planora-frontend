"use client";

import { Calendar, CalendarDays, Mail, Star, Loader2 } from "lucide-react";
import { useUserDashboardStats } from "@/hooks/use-dashboard";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/lib/auth";
import { EventCard } from "@/components/events/event-card";
import { Card, CardContent } from "@/components/ui/card";

const statCards = [
  { key: "myEventsCount" as const, label: "My Events", icon: Calendar },
  { key: "upcomingEventsCount" as const, label: "Upcoming Events", icon: CalendarDays },
  { key: "pendingInvitationsCount" as const, label: "Pending Invitations", icon: Mail },
  { key: "reviewsWrittenCount" as const, label: "Reviews Written", icon: Star },
];

interface EventItem {
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
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserDashboardStats();
  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    page: 1,
    limit: 4,
    sortBy: "date",
    sortOrder: "asc",
  });

  const recommendations = (eventsData?.events ?? []) as EventItem[];
  const hasActivity = stats && (
    stats.myEventsCount > 0 ||
    stats.upcomingEventsCount > 0 ||
    stats.pendingInvitationsCount > 0 ||
    stats.reviewsWrittenCount > 0
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {stats?.[stat.key] ?? 0}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state for new users */}
      {!statsLoading && !hasActivity && (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to Planora</h2>
            <p className="text-muted-foreground">
              You haven&apos;t joined any events yet. Browse events to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recommended for You */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        {eventsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Browse events to get personalized recommendations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
