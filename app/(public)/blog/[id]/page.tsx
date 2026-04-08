"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogEditor } from "@/components/blog/blog-editor";
import { useBlogPost, useDeleteBlogPost } from "@/hooks/use-blog";
import { useAuth } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post, isLoading, isError } = useBlogPost(id);
  const { user } = useAuth();
  const router = useRouter();
  const deleteMutation = useDeleteBlogPost();

  const isAuthor = user && post?.author && (user.id === (post.author as { id?: string }).id);
  const isAdmin = user?.role === "ADMIN";
  const canModify = isAuthor || isAdmin;

  function handleDelete() {
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/blog"),
    });
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-64 md:h-96" />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn&apos;t find what you&apos;re looking for. Check the URL or
          go back to the blog.
        </p>
        <Button asChild variant="secondary">
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tags = post.tags
    ? post.tags
        .split(",")
        .filter(Boolean)
        .map((t) => t.trim())
    : [];

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96">
        <img
          src={post.coverImage || "/placeholder-event.jpg"}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-event.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-muted-foreground">
          {/* Author avatar initial */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {post.author?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="font-medium text-foreground">
              {post.author?.name || "Unknown"}
            </span>
          </div>
          <span>&middot;</span>
          <span>{formattedDate}</span>
          {tags.length > 0 && (
            <>
              <span>&middot;</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge variant="outline" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions for author/admin */}
        {canModify && (
          <div className="flex gap-2 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href={`/blog/${post.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this blog post. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Blog Content - rendered through TipTap read-only mode (T-06-13 mitigation) */}
        <BlogEditor content={post.content} editable={false} />

        {/* Back to Blog */}
        <div className="mt-8 pt-6 border-t">
          <Button asChild variant="ghost">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
