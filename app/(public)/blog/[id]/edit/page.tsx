"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BlogForm } from "@/components/blog/blog-form";
import { useBlogPost, useUpdateBlogPost } from "@/hooks/use-blog";
import { useAuth } from "@/lib/auth";

export default function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: post, isLoading: postLoading } = useBlogPost(id);
  const updateMutation = useUpdateBlogPost();

  const isAuthor = user && post?.author && (user.id === (post.author as { id?: string }).id);
  const isAdmin = user?.role === "admin";
  const canEdit = isAuthor || isAdmin;

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // Redirect unauthorized users once post loads
  useEffect(() => {
    if (!authLoading && !postLoading && post && !canEdit) {
      router.replace(`/blog/${id}`);
    }
  }, [authLoading, postLoading, post, canEdit, id, router]);

  if (authLoading || postLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !post || !canEdit) {
    return null;
  }

  function handleSubmit(data: {
    title: string;
    content: string;
    coverImage: string;
    tags: string;
  }) {
    updateMutation.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          router.push(`/blog/${id}`);
        },
      }
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-8">Edit Post</h1>
      <BlogForm
        initialData={{
          title: post.title,
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags,
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        mode="edit"
      />
    </div>
  );
}
