"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface HomepageData {
  featuredEvents: HomepageEvent[];
  upcomingEvents: HomepageEvent[];
  paidEvents: HomepageEvent[];
  categoryCounts: {
    PUBLIC_FREE: number;
    PUBLIC_PAID: number;
    PRIVATE_FREE: number;
    PRIVATE_PAID: number;
  };
  platformStats: {
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
    totalReviews: number;
  };
  topOrganizers: {
    id: string;
    name: string;
    _count: { events: number };
  }[];
  testimonials: {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    event: { title: string };
  }[];
  recentBlogPosts: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: { name: string };
    createdAt: string;
    tags: string;
  }[];
}

export interface HomepageEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  visibility: string;
  type: string;
  fee: number;
  imageUrl?: string;
  organizer?: { name: string };
  _count?: { registrations: number };
  averageRating?: number;
}

export function useHomepageData() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: () =>
      apiFetch<HomepageData>(`${API_URL}/api/v1/stats/homepage`),
    staleTime: 60 * 1000,
  });
}
