"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useMyReviews,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/use-reviews";
import { StarRating } from "@/components/events/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { data, isLoading } = useMyReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const reviews = (data?.reviews ?? []) as Review[];

  const handleEditOpen = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditOpen(true);
  };

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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">My Reviews</h1>

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-[40%]" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-[70%]" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          heading="No reviews yet"
          body="You haven't written any reviews. Join events and share your experience."
          ctaLabel="Browse Events"
          ctaHref="/events"
        />
      ) : (
        <div className="space-y-4 mt-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/events/${review.event.id}`}
                      className="font-semibold hover:underline"
                    >
                      {review.event.title}
                    </Link>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEditOpen(review)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => setDeleteTarget(review)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground mt-2">
                  {review.comment}
                </p>
              )}
            </Card>
          ))}
        </div>
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review AlertDialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
