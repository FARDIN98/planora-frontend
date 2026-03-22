"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { eventKeys } from "@/hooks/use-events";

export const invitationKeys = {
  all: ["invitations"] as const,
  event: (eventId: string) =>
    [...invitationKeys.all, "event", eventId] as const,
  my: () => [...invitationKeys.all, "my"] as const,
};

interface InvitationListResponse {
  invitations: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMyInvitations(params?: {
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return useQuery({
    queryKey: invitationKeys.my(),
    queryFn: () =>
      apiFetch<InvitationListResponse>(
        `/api/v1/invitations/my${qs ? `?${qs}` : ""}`,
      ),
  });
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, email }: { eventId: string; email: string }) =>
      apiFetch<unknown>(`/api/v1/events/${eventId}/invitations`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
      toast.success(`Invitation sent to ${variables.email}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRespondInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invitationId,
      action,
    }: {
      invitationId: string;
      action: "accept" | "decline";
    }) =>
      apiFetch<unknown>(`/api/v1/invitations/${invitationId}/respond`, {
        method: "POST",
        body: JSON.stringify({ action }),
      }),
    onSuccess: (data, variables) => {
      const res = data as { checkoutUrl?: string; requiresPayment?: boolean };
      if (res.requiresPayment && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success(
        variables.action === "accept"
          ? "Invitation accepted"
          : "Invitation declined",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
