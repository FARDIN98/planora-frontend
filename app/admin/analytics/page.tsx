"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useAdminChartData } from "@/hooks/use-dashboard";
import { EventsOverTimeChart } from "@/components/charts/events-over-time";
import { RevenueOverviewChart } from "@/components/charts/revenue-overview";
import { EventTypePieChart } from "@/components/charts/event-type-pie";
import { UserRegistrationsChart } from "@/components/charts/user-registrations";

export default function AdminAnalyticsPage() {
  const { data: chartData, isLoading } = useAdminChartData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Last 12 months</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {isLoading ? (
          <>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </Card>
          </>
        ) : (
          <>
            <EventsOverTimeChart
              data={chartData?.eventsOverTime ?? []}
            />
            <RevenueOverviewChart
              data={chartData?.revenueOverview ?? []}
            />
            <EventTypePieChart
              data={chartData?.eventTypeDistribution ?? []}
            />
            <UserRegistrationsChart
              data={chartData?.userRegistrations ?? []}
            />
          </>
        )}
      </div>
    </div>
  );
}
