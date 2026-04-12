"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { eventKeys } from "@/hooks/use-events";

export function useAdminUsers(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () =>
      apiFetch<{ users: Record<string, unknown>[]; total: number }>(
        `/api/v1/admin/users?limit=${params?.limit ?? 20}&offset=${params?.offset ?? 0}`
      ),
  });
}

interface AdminEventListParams {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: string;
  type?: string;
}

interface AdminEventListResponse {
  events: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminEvents(params?: AdminEventListParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.visibility) query.set("visibility", params.visibility);
  if (params?.type) query.set("type", params.type);
  const qs = query.toString();

  return useQuery({
    queryKey: ["admin", "events", params],
    queryFn: () =>
      apiFetch<AdminEventListResponse>(`/api/v1/admin/events${qs ? `?${qs}` : ""}`),
  });
}

export function useAdminRemoveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch<unknown>(`/api/v1/admin/users/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAdminDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      apiFetch<unknown>(`/api/v1/admin/events/${eventId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAdminSetFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      apiFetch<unknown>(`/api/v1/admin/events/${eventId}/featured`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event set as featured");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useAdminUnsetFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      apiFetch<unknown>(`/api/v1/admin/events/${eventId}/featured`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Featured status removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// --- Blog moderation hooks ---

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string };
  tags: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminBlogPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "blog", page, limit],
    queryFn: () =>
      apiFetch<BlogPostsResponse>(
        `/api/v1/admin/blog?page=${page}&limit=${limit}`
      ),
  });
}

export function useAdminDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<unknown>(`/api/v1/admin/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
      toast.success("Blog post deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// --- Newsletter hooks ---

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useNewsletterSubscribers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "newsletter", page, limit],
    queryFn: () =>
      apiFetch<SubscribersResponse>(
        `/api/v1/newsletter/subscribers?page=${page}&limit=${limit}`
      ),
  });
}
