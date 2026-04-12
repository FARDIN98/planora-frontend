"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useMyReviews,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/use-reviews";
import { StarRating } from "@/components/events/star-rating";
import { DataTable } from "@/components/data-tables/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
  };
}

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyReviews({ page, limit: 10 });
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const reviews = (data?.reviews ?? []) as Review[];
  const totalPages = data?.totalPages ?? 1;

  const handleEditOpen = useCallback((review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditOpen(true);
  }, []);

  const handleEditSave = () => {
    if (!editingReview) return;
    updateReview.mutate(
      {
        reviewId: editingReview.id,
        rating: editRating,
        comment: editComment,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setEditingReview(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteReview.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const columns: ColumnDef<Review, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "event.title",
        header: "Event",
        cell: ({ row }) => (
          <Link
            href={`/events/${row.original.event.id}`}
            className="font-medium hover:underline"
          >
            {row.original.event.title}
          </Link>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <StarRating value={row.original.rating} readonly size="sm" />
        ),
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-[200px]">
            {row.original.comment || "-"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleEditOpen(row.original)}
            >
              <Pencil className="h-4 w-4" />
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
    ],
    [handleEditOpen, setDeleteTarget]
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        My Reviews
      </h1>

      {!isLoading && reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          heading="No reviews yet"
          body="You haven't written any reviews. Join events and share your experience."
          ctaLabel="Browse Events"
          ctaHref="/events"
        />
      ) : (
        <DataTable
          columns={columns}
          data={reviews}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}

      {/* Edit Review Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <StarRating
                value={editRating}
                onChange={setEditRating}
                readonly={false}
                size="md"
              />
            </div>
            <Textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={updateReview.isPending}
            >
              {updateReview.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {updateReview.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review AlertDialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your review will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteReview.isPending}
            >
              {deleteReview.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deleteReview.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
