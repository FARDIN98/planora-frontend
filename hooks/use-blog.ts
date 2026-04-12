"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string;
  published: boolean;
  author: { id?: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...blogKeys.lists(), { page, limit }] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  mine: (page: number, limit: number) =>
    [...blogKeys.all, "mine", { page, limit }] as const,
};

export function useBlogPosts(page = 1, limit = 12) {
  return useQuery({
    queryKey: blogKeys.list(page, limit),
    queryFn: () =>
      apiFetch<BlogPostsResponse>(
        `${API_URL}/api/v1/blog?page=${page}&limit=${limit}`
      ),
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => apiFetch<BlogPost>(`${API_URL}/api/v1/blog/${id}`),
    enabled: !!id,
  });
}

export function useUserBlogPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: blogKeys.mine(page, limit),
    queryFn: () =>
      apiFetch<BlogPostsResponse>(
        `${API_URL}/api/v1/blog?mine=true&page=${page}&limit=${limit}`
      ),
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      coverImage: string;
      tags: string;
    }) =>
      apiFetch<BlogPost>(`${API_URL}/api/v1/blog`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post published!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      content?: string;
      coverImage?: string;
      tags?: string;
    }) =>
      apiFetch<BlogPost>(`${API_URL}/api/v1/blog/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<unknown>(`${API_URL}/api/v1/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post deleted!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
