"use client";

import Link from "next/link";
import { Calendar, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { useAdminUsers } from "@/hooks/use-admin";

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

export default function AdminOverviewPage() {
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 1 });
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ limit: 1, offset: 0 });

  const totalEvents = eventsData?.total ?? 0;
  const totalUsers = (usersData as { users?: unknown[]; total?: number })?.total ?? (usersData as { users?: unknown[] })?.users?.length ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard
          label="Total Events"
          value={totalEvents}
          icon={Calendar}
          isLoading={eventsLoading}
        />
        <StatCard
          label="Total Users"
          value={totalUsers}
          icon={Users}
          isLoading={usersLoading}
        />
        <StatCard
          label="Pending Registrations"
          value="--"
          icon={Clock}
          isLoading={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Link href="/admin/events">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Manage Events</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    View, search, and delete events
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage user accounts
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
