"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEvent, useDeleteEvent } from "@/hooks/use-events";
import { useJoinEvent } from "@/hooks/use-registrations";
import {
  useEventReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/use-reviews";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/events/star-rating";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import dynamic from "next/dynamic";

const ManageParticipantsModal = dynamic(
  () =>
    import("@/components/events/manage-participants-modal").then((mod) => ({
      default: mod.ManageParticipantsModal,
    })),
  { ssr: false }
);

const InviteUserDialog = dynamic(
  () =>
    import("@/components/events/invite-user-dialog").then((mod) => ({
      default: mod.InviteUserDialog,
    })),
  { ssr: false }
);
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  fee: number;
  visibility: string;
  organizerId: string;
  organizer: { id: string; name: string };
  _count: { registrations: number };
  averageRating: number;
  reviewCount: number;
  userRegistration?: { id: string; status: string } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string };
}

function getActionState(
  event: EventDetail,
  user: { id: string } | null,
  userRegistration?: { id: string; status: string } | null
) {
  if (!user)
    return { label: "Login to Join", variant: "outline" as const, action: "login" };
  if (event.organizerId === user.id)
    return {
      label: "Manage Event",
      variant: "outline" as const,
      action: "manage",
    };
  if (userRegistration?.status === "BANNED")
    return {
      label: "Banned",
      variant: "secondary" as const,
      disabled: true,
    };
  if (userRegistration?.status === "APPROVED")
    return {
      label: "You're In!",
      variant: "secondary" as const,
      disabled: true,
    };
  if (userRegistration?.status === "PENDING")
    return {
      label: "Pending Approval",
      variant: "secondary" as const,
      disabled: true,
    };
  if (event.visibility === "PUBLIC" && event.type === "FREE")
    return { label: "Join Event", variant: "default" as const, action: "join" };
  if (event.visibility === "PUBLIC" && event.type === "PAID")
    return {
      label: `Pay $${event.fee} & Join`,
      variant: "default" as const,
      action: "pay-join",
    };
  if (event.visibility === "PRIVATE" && event.type === "FREE")
    return {
      label: "Request to Join",
      variant: "default" as const,
      action: "request",
    };
  if (event.visibility === "PRIVATE" && event.type === "PAID")
    return {
      label: "Pay & Request",
      variant: "default" as const,
      action: "pay-request",
    };
  return { label: "Join Event", variant: "default" as const, action: "join" };
}

export function EventDetailsClient({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(eventId);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useEventReviews(eventId);
  const joinEvent = useJoinEvent();
  const deleteEvent = useDeleteEvent();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [manageOpen, setManageOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const event = eventData as EventDetail | undefined;
  const reviews = (reviewsData?.reviews ?? []) as Review[];

  // Loading state
  if (eventLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-[50%]" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-36" />
        <div className="space-y-2 mt-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-[70%]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (eventError || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Event not found
        </h1>
        <p className="text-muted-foreground mt-3">
          The event you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/events">
          <Button variant="outline" className="mt-6">
            Browse Events
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const actionState = getActionState(
    event,
    user,
    event.userRegistration
  );

  const isOwner = user && event.organizerId === user.id;

  const hasReviewed = reviews.some(
    (r) => user && r.user.id === user.id
  );

  const canReview =
    user &&
    event.userRegistration?.status === "APPROVED" &&
    !hasReviewed;

  const handleAction = async () => {
    switch (actionState.action) {
      case "login":
        router.push("/login");
        break;
      case "manage":
        setManageOpen(true);
        break;
      case "join":
      case "pay-join":
      case "request":
      case "pay-request":
        await joinEvent.mutateAsync({ eventId: event.id });
        break;
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) return;
    await createReview.mutateAsync({
      eventId: event.id,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewRating(0);
    setReviewComment("");
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || editRating === 0) return;
    await updateReview.mutateAsync({
      reviewId: editingReview.id,
      rating: editRating,
      comment: editComment,
    });
    setEditingReview(null);
  };

  const handleDeleteEvent = async () => {
    await deleteEvent.mutateAsync(event.id);
    router.push("/events");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>

      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {formattedDate} at {event.time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {event.venue}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {event._count?.registrations ?? 0} participants
        </span>
        {event.averageRating > 0 && (
          <span className="flex items-center gap-1">
            <StarRating value={event.averageRating} readonly size="sm" />
            <span>({event.reviewCount})</span>
          </span>
        )}
        <Badge variant={event.type === "FREE" ? "secondary" : "default"}>
          {event.type === "FREE" ? "FREE" : `$${event.fee}`}
        </Badge>
        <Badge variant="outline">
          {event.visibility}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Organized by {event.organizer.name}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        <Button
          variant={actionState.variant}
          disabled={actionState.disabled || joinEvent.isPending}
          onClick={handleAction}
          className="w-full sm:w-auto min-h-11"
        >
          {joinEvent.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {joinEvent.isPending
            ? actionState.action === "join"
              ? "Joining..."
              : actionState.action === "request"
                ? "Requesting..."
                : "Processing..."
            : actionState.label}
        </Button>

        {isOwner && (
          <>
            <Link href={`/dashboard/events/${event.id}/edit`}>
              <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-11">
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>

            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm" className="w-full sm:w-auto min-h-11">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              }
              title={`Delete "${event.title}"?`}
              description="This action cannot be undone. The event and all its registrations will be permanently removed."
              confirmText="Delete"
              onConfirm={handleDeleteEvent}
              isLoading={deleteEvent.isPending}
            />

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto min-h-11"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Invite
            </Button>
          </>
        )}
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">About this event</h2>
        <p className="text-muted-foreground mt-3 whitespace-pre-wrap">
          {event.description || "No description provided."}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {/* Review Form - for eligible participants */}
        {canReview && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Rating</p>
                  <StarRating
                    value={reviewRating}
                    onChange={setReviewRating}
                    readonly={false}
                    size="md"
                  />
                </div>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                />
                <Button
                  type="submit"
                  disabled={
                    reviewRating === 0 || createReview.isPending
                  }
                >
                  {createReview.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Review List */}
        {reviewsLoading ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => {
              const isOwnReview = user && review.user.id === user.id;
              const reviewDate = new Date(review.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">
                            {review.user.name}
                          </p>
                          <StarRating
                            value={review.rating}
                            readonly
                            size="sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            {reviewDate}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {review.comment}
                        </p>
                      </div>

                      {isOwnReview && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingReview(review);
                              setEditRating(review.rating);
                              setEditComment(review.comment);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete review?"
                            description="This action cannot be undone. Your review will be permanently removed."
                            confirmText="Delete"
                            onConfirm={() => deleteReview.mutate(review.id)}
                            isLoading={deleteReview.isPending}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            No reviews yet. Be the first to review this event.
          </p>
        )}
      </div>

      {/* Edit Review Dialog */}
      <Dialog
        open={!!editingReview}
        onOpenChange={(open) => {
          if (!open) setEditingReview(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateReview} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Rating</p>
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
              placeholder="Update your review..."
              rows={3}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={editRating === 0 || updateReview.isPending}
            >
              {updateReview.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateReview.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Participants Modal */}
      <ManageParticipantsModal
        eventId={event.id}
        open={manageOpen}
        onOpenChange={setManageOpen}
      />

      {/* Invite User Dialog */}
      <InviteUserDialog
        eventId={event.id}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
