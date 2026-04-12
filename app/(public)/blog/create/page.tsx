"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BlogForm } from "@/components/blog/blog-form";
import { useCreateBlogPost } from "@/hooks/use-blog";
import { useAuth } from "@/lib/auth";

export default function BlogCreatePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const createMutation = useCreateBlogPost();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null;
  }

  function handleSubmit(data: {
    title: string;
    content: string;
    coverImage: string;
    tags: string;
  }) {
    createMutation.mutate(data, {
      onSuccess: (newPost) => {
        router.push(`/blog/${newPost.id}`);
      },
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-8">Write a New Post</h1>
      <BlogForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        mode="create"
      />
    </div>
  );
}
