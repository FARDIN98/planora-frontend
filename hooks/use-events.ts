"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params: EventListParams | Record<string, unknown>) =>
    [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  my: () => [...eventKeys.all, "my"] as const,
};

interface EventListParams {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: string;
  type?: string;
}

interface EventListResponse {
  events: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useEvents(params?: EventListParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.visibility) query.set("visibility", params.visibility);
  if (params?.type) query.set("type", params.type);
  const qs = query.toString();

  return useQuery({
    queryKey: eventKeys.list(params ?? {}),
    queryFn: () =>
      apiFetch<EventListResponse>(`/api/v1/events${qs ? `?${qs}` : ""}`),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => apiFetch<unknown>(`/api/v1/events/${id}`),
    enabled: !!id,
  });
}

export function useMyEvents(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: eventKeys.my(),
    queryFn: () =>
      apiFetch<EventListResponse>(`/api/v1/events/my${qs ? `?${qs}` : ""}`),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch<unknown>("/api/v1/events", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Event created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch<unknown>(`/api/v1/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Event updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<unknown>(`/api/v1/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
