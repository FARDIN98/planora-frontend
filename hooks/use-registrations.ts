"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { eventKeys } from "@/hooks/use-events";

export const registrationKeys = {
  all: ["registrations"] as const,
  event: (eventId: string) =>
    [...registrationKeys.all, "event", eventId] as const,
  my: () => [...registrationKeys.all, "my"] as const,
};

interface RegistrationListResponse {
  registrations: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useEventRegistrations(
  eventId: string,
  params?: { page?: number; limit?: number },
  enabled: boolean = true,
) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: registrationKeys.event(eventId),
    queryFn: () =>
      apiFetch<RegistrationListResponse>(
        `/api/v1/events/${eventId}/registrations${qs ? `?${qs}` : ""}`,
      ),
    enabled: !!eventId && enabled,
  });
}

export function useMyRegistrations(params?: {
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: registrationKeys.my(),
    queryFn: () =>
      apiFetch<RegistrationListResponse>(
        `/api/v1/registrations/my${qs ? `?${qs}` : ""}`,
      ),
  });
}

interface JoinResponse {
  registration?: unknown;
  checkoutUrl?: string;
  requiresPayment?: boolean;
}

export function useJoinEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) =>
      apiFetch<JoinResponse>(`/api/v1/events/${eventId}/registrations`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      if (data.requiresPayment && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      const reg = data.registration as { status?: string } | undefined;
      if (reg?.status === "PENDING") {
        toast.success("Request sent! Wait for approval");
      } else {
        toast.success("Successfully joined event");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      registrationId,
      status,
    }: {
      eventId: string;
      registrationId: string;
      status: string;
    }) =>
      apiFetch<unknown>(
        `/api/v1/events/${eventId}/registrations/${registrationId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      const messages: Record<string, string> = {
        APPROVED: "Participant approved",
        REJECTED: "Participant rejected",
        BANNED: "Participant banned",
      };
      toast.success(messages[variables.status] || "Registration updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
