"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreVertical, Pencil, Trash2, CalendarDays, Users } from "lucide-react";
import { useMyEvents, useDeleteEvent } from "@/hooks/use-events";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import dynamic from "next/dynamic";

const ManageParticipantsModal = dynamic(
  () =>
    import("@/components/events/manage-participants-modal").then((mod) => ({
      default: mod.ManageParticipantsModal,
    })),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
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

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  _count?: { registrations?: number };
}

export default function MyEventsPage() {
  const { data, isLoading } = useMyEvents();
  const deleteEvent = useDeleteEvent();
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [manageEventId, setManageEventId] = useState<string | null>(null);

  const events = (data?.events ?? []) as Event[];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEvent.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">My Events</h1>
        <Link href="/dashboard/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          heading="No events yet"
          body="You haven't created any events. Get started by creating your first one."
          ctaLabel="Create Event"
          ctaHref="/dashboard/events/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base font-semibold line-clamp-2">
                  {event.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/events/${event.id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteTarget(event)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {event._count?.registrations ?? 0} attendees
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setManageEventId(event.id)}
                >
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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
              This action cannot be undone. The event and all its registrations
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deleteEvent.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {manageEventId && (
        <ManageParticipantsModal
          eventId={manageEventId}
          open={!!manageEventId}
          onOpenChange={(open) => !open && setManageEventId(null)}
        />
      )}
    </div>
  );
}
