"use client";

import {
  Calendar,
  Users,
  DollarSign,
  Activity,
  CalendarPlus,
  UserPlus,
  Star,
  FileBarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAdminOverview } from "@/hooks/use-dashboard";
import { useAdminEvents } from "@/hooks/use-admin";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  event: { title: string };
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
}

function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-2" />
            ) : (
              <p className="text-3xl font-semibold mt-2">{value}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  type: "event" | "registration" | "review";
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

function useLatestReviews() {
  return useQuery({
    queryKey: ["admin", "latest-reviews"],
    queryFn: () =>
      apiFetch<{ reviews: ReviewItem[] }>("/api/v1/reviews?limit=5"),
  });
}

export default function AdminReportsPage() {
  const { data: overview, isLoading: overviewLoading } = useAdminOverview();
  const { data: eventsData, isLoading: eventsLoading } = useAdminEvents({
    page: 1,
    limit: 5,
  });
  const { data: reviewsData, isLoading: reviewsLoading } = useLatestReviews();

  const totalRevenue = overview?.totalRevenue ?? 0;
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalRevenue);

  // Build activity timeline
  const activities: ActivityItem[] = [];

  if (eventsData?.events) {
    for (const event of eventsData.events as Array<{
      id: string;
      title: string;
      createdAt: string;
    }>) {
      activities.push({
        id: `event-${event.id}`,
        type: "event",
        description: `New event created: "${event.title}"`,
        timestamp: event.createdAt,
        icon: CalendarPlus,
      });
    }
  }

  if (reviewsData?.reviews) {
    for (const review of reviewsData.reviews) {
      activities.push({
        id: `review-${review.id}`,
        type: "review",
        description: `${review.user?.name ?? "A user"} reviewed "${review.event?.title ?? "an event"}" (${review.rating}/5)`,
        timestamp: review.createdAt,
        icon: Star,
      });
    }
  }

  // Sort by timestamp descending
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const isActivityLoading = eventsLoading || reviewsLoading;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        Reports & Activity Log
      </h1>

      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          label="Total Events"
          value={overview?.totalEvents ?? 0}
          icon={Calendar}
          isLoading={overviewLoading}
        />
        <StatCard
          label="Total Users"
          value={overview?.totalUsers ?? 0}
          icon={Users}
          isLoading={overviewLoading}
        />
        <StatCard
          label="Total Revenue"
          value={formattedRevenue}
          icon={DollarSign}
          isLoading={overviewLoading}
        />
        <StatCard
          label="Active Events"
          value={overview?.activeEvents ?? 0}
          icon={Activity}
          isLoading={overviewLoading}
        />
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isActivityLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[30%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <EmptyState
              icon={FileBarChart}
              heading="No recent activity"
              body="Activity from events, registrations, and reviews will appear here."
            />
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
