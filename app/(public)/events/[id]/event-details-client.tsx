"use client";

import { useState, useEffect } from "react";
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
  Star,
  Clock,
  DollarSign,
  Eye,
} from "lucide-react";
import { useEvent, useDeleteEvent, useEvents } from "@/hooks/use-events";
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
import { EventCard } from "@/components/events/event-card";
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
  imageUrl?: string;
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

type RelatedEvent = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  fee: number;
  visibility: string;
  imageUrl?: string;
  organizer: { name: string };
  _count?: { registrations: number };
};

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

  // Fetch related events (same visibility + type combination, excluding current event)
  const { data: relatedData } = useEvents(
    event
      ? {
          visibility: event.visibility,
          type: event.type,
          limit: 5,
        }
      : undefined
  );

  const relatedEvents = (
    (relatedData?.events ?? []) as RelatedEvent[]
  ).filter((e) => e.id !== eventId).slice(0, 4);

  // Loading state
  if (eventLoading) {
    return (
      <div>
        {/* Hero skeleton */}
        <Skeleton className="w-full h-64 md:h-96" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
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

  // Organizer initials for avatar fallback
  const organizerInitials = event.organizer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96 bg-muted">
        <img
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-event.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <h1 className="text-3xl font-semibold text-white drop-shadow-lg">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organizer */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {organizerInitials}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organized by</p>
                <p className="font-semibold">{event.organizer.name}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold">About this event</h2>
              <p className="text-base text-foreground mt-3 whitespace-pre-wrap">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
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

            {/* Reviews Section */}
            <div>
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
          </div>

          {/* Right Column - Key Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Event Details</h3>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Venue</p>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                  </div>
                </div>

                {/* Fee */}
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Fee</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {event.type === "FREE" ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        <Badge className="bg-accent text-accent-foreground">
                          ${event.fee.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Type & Visibility */}
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <div className="flex gap-1.5 mt-0.5">
                      <Badge variant="outline">{event.visibility}</Badge>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {event._count?.registrations ?? 0} registered
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {event.averageRating > 0 && (
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm text-muted-foreground">
                        {Number(event.averageRating).toFixed(1)} ({event.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button in sidebar */}
                <Button
                  variant={actionState.variant}
                  disabled={actionState.disabled || joinEvent.isPending}
                  onClick={handleAction}
                  className="w-full min-h-11 mt-2"
                >
                  {joinEvent.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {joinEvent.isPending ? "Processing..." : actionState.label}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent.id} event={relEvent} />
              ))}
            </div>
          </div>
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
      {isOwner && (
        <ManageParticipantsModal
          eventId={event.id}
          open={manageOpen}
          onOpenChange={setManageOpen}
        />
      )}

      {/* Invite User Dialog */}
      <InviteUserDialog
        eventId={event.id}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
