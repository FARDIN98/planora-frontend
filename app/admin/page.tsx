"use client";

import {
  Calendar,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOverview, useAdminChartData } from "@/hooks/use-dashboard";

const EventsOverTimeChart = dynamic(
  () => import("@/components/charts/events-over-time").then((m) => ({ default: m.EventsOverTimeChart })),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
const RevenueOverviewChart = dynamic(
  () => import("@/components/charts/revenue-overview").then((m) => ({ default: m.RevenueOverviewChart })),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
const EventTypePieChart = dynamic(
  () => import("@/components/charts/event-type-pie").then((m) => ({ default: m.EventTypePieChart })),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
const UserRegistrationsChart = dynamic(
  () => import("@/components/charts/user-registrations").then((m) => ({ default: m.UserRegistrationsChart })),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
  trend?: { value: number; label: string };
}

function StatCard({ label, value, icon: Icon, isLoading, trend }: StatCardProps) {
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
            {trend && !isLoading && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-500 font-medium">
                  {trend.value} {trend.label}
                </span>
              </div>
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

export default function AdminOverviewPage() {
  const { data: overview, isLoading: overviewLoading } = useAdminOverview();
  const { data: chartData, isLoading: chartsLoading } = useAdminChartData();

  const totalEvents = overview?.totalEvents ?? 0;
  const totalUsers = overview?.totalUsers ?? 0;
  const totalRevenue = overview?.totalRevenue ?? 0;
  const activeEvents = overview?.activeEvents ?? 0;

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalRevenue);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          label="Total Events"
          value={totalEvents}
          icon={Calendar}
          isLoading={overviewLoading}
        />
        <StatCard
          label="Total Users"
          value={totalUsers}
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
          value={activeEvents}
          icon={Activity}
          isLoading={overviewLoading}
          trend={
            activeEvents > 0
              ? { value: activeEvents, label: "currently active" }
              : undefined
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {chartsLoading ? (
          <>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </Card>
          </>
        ) : (
          <>
            <EventsOverTimeChart data={chartData?.eventsOverTime ?? []} />
            <RevenueOverviewChart data={chartData?.revenueOverview ?? []} />
            <EventTypePieChart data={chartData?.eventTypeDistribution ?? []} />
            <UserRegistrationsChart data={chartData?.userRegistrations ?? []} />
          </>
        )}
      </div>
    </div>
  );
}
