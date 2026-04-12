"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Trash2, Pencil, FileText, Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-tables/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminBlogPosts, useAdminDeleteBlogPost } from "@/hooks/use-admin";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: { id: string; name: string };
  tags: string[];
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const limit = 10;

  const { data, isLoading } = useAdminBlogPosts(page, limit);
  const deleteBlogPost = useAdminDeleteBlogPost();

  const posts = (data?.posts ?? []) as BlogPost[];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = () => {
    if (!deletingPost) return;
    deleteBlogPost.mutate(deletingPost.id, {
      onSuccess: () => setDeletingPost(null),
    });
  };

  const columns: ColumnDef<BlogPost, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            href={`/blog/${row.original.slug}`}
            className="font-medium hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        id: "author",
        header: "Author",
        cell: ({ row }) => row.original.author?.name ?? "Unknown",
      },
      {
        accessorKey: "createdAt",
        header: "Published Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.original.tags ?? [];
          const visible = tags.slice(0, 3);
          const remaining = tags.length - 3;
          return (
            <div className="flex flex-wrap gap-1">
              {visible.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {remaining > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{remaining}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "published",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={row.original.published ? "default" : "secondary"}
          >
            {row.original.published ? "Published" : "Draft"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const post = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11"
                asChild
              >
                <Link href={`/blog/${post.slug}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive min-h-11 min-w-11"
                onClick={() => setDeletingPost(post)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  if (!isLoading && posts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Blog Posts</h1>
        <div className="mt-6">
          <EmptyState
            icon={FileText}
            heading="No blog posts yet"
            body="Blog posts will appear here once they are created."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Blog Posts</h1>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={posts}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>

      <AlertDialog
        open={!!deletingPost}
        onOpenChange={(open) => !open && setDeletingPost(null)}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{deletingPost?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this blog post. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBlogPost.isPending}
            >
              {deleteBlogPost.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deleteBlogPost.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
