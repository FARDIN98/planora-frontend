"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { eventKeys } from "@/hooks/use-events";

export const reviewKeys = {
  all: ["reviews"] as const,
  event: (eventId: string) => [...reviewKeys.all, "event", eventId] as const,
  my: () => [...reviewKeys.all, "my"] as const,
};

interface ReviewListResponse {
  reviews: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useEventReviews(
  eventId: string,
  params?: { page?: number; limit?: number },
) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: reviewKeys.event(eventId),
    queryFn: () =>
      apiFetch<ReviewListResponse>(
        `/api/v1/events/${eventId}/reviews${qs ? `?${qs}` : ""}`,
      ),
    enabled: !!eventId,
  });
}

export function useMyReviews(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: reviewKeys.my(),
    queryFn: () =>
      apiFetch<ReviewListResponse>(
        `/api/v1/reviews/my${qs ? `?${qs}` : ""}`,
      ),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      rating,
      comment,
    }: {
      eventId: string;
      rating: number;
      comment: string;
    }) =>
      apiFetch<unknown>(`/api/v1/events/${eventId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Review submitted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: string;
      rating: number;
      comment: string;
    }) =>
      apiFetch<unknown>(`/api/v1/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify({ rating, comment }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Review updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) =>
      apiFetch<unknown>(`/api/v1/reviews/${reviewId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
