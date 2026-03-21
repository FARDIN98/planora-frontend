"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { eventKeys } from "@/hooks/use-events";

export function useAdminUsers(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch users");
      }
      return result.data;
    },
  });
}

export function useAdminRemoveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await authClient.admin.removeUser({ userId });
      if (result.error) {
        throw new Error(result.error.message || "Failed to delete user");
      }
      return result.data;
    },
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
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
