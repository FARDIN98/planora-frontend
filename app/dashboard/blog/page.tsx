"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Pencil, Trash2, Loader2, Plus, ExternalLink } from "lucide-react";
import { useUserBlogPosts, useDeleteBlogPost } from "@/hooks/use-blog";
import { DataTable } from "@/components/data-tables/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface BlogPost {
  id: string;
  title: string;
  tags: string;
  published: boolean;
  createdAt: string;
}

export default function DashboardBlogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserBlogPosts(page, 10);
  const deleteBlogPost = useDeleteBlogPost();
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const posts = (data?.posts ?? []) as BlogPost[];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteBlogPost.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const columns: ColumnDef<BlogPost, unknown>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/blog/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Published",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.original.tags
          ? row.original.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.length > 0
              ? tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))
              : "-"}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="default">Published</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/blog/${row.original.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/blog/${row.original.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive"
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Blog Posts</h1>
        <Link href="/blog/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Write New Post
          </Button>
        </Link>
      </header>

      {!isLoading && posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          heading="No blog posts yet"
          body="Share your experiences and insights. Write your first blog post."
          ctaLabel="Write New Post"
          ctaHref="/blog/create"
        />
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{deleteTarget?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your blog post will be permanently
              removed.
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
