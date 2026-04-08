"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// --- Types ---

export interface UserDashboardStats {
  myEventsCount: number;
  upcomingEventsCount: number;
  pendingInvitationsCount: number;
  reviewsWrittenCount: number;
}

export interface AdminOverview {
  totalEvents: number;
  totalUsers: number;
  totalRevenue: number;
  activeEvents: number;
}

export interface AdminChartData {
  eventsOverTime: { month: string; count: number }[];
  revenueOverview: { month: string; revenue: number }[];
  eventTypeDistribution: { type: string; count: number }[];
  userRegistrations: { month: string; count: number }[];
}

// --- Query keys ---

export const dashboardKeys = {
  all: ["dashboard"] as const,
  userStats: () => [...dashboardKeys.all, "user", "stats"] as const,
  adminOverview: () => [...dashboardKeys.all, "admin", "overview"] as const,
  adminCharts: () => [...dashboardKeys.all, "admin", "charts"] as const,
};

// --- Hooks ---

export function useUserDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.userStats(),
    queryFn: () =>
      apiFetch<UserDashboardStats>(
        `${API_URL}/api/v1/stats/user/dashboard`
      ),
  });
}

export function useAdminOverview() {
  return useQuery({
    queryKey: dashboardKeys.adminOverview(),
    queryFn: () =>
      apiFetch<AdminOverview>(`${API_URL}/api/v1/stats/admin/overview`),
  });
}

export function useAdminChartData() {
  return useQuery({
    queryKey: dashboardKeys.adminCharts(),
    queryFn: () =>
      apiFetch<AdminChartData>(`${API_URL}/api/v1/stats/admin/charts`),
  });
}
