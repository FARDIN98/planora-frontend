"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, CalendarDays, Users, Loader2 } from "lucide-react";
import { useMyEvents, useDeleteEvent } from "@/hooks/use-events";
import { DataTable } from "@/components/data-tables/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import dynamic from "next/dynamic";
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

const ManageParticipantsModal = dynamic(
  () =>
    import("@/components/events/manage-participants-modal").then((mod) => ({
      default: mod.ManageParticipantsModal,
    })),
  { ssr: false }
);

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  type: string;
  visibility: string;
  fee: number;
  _count?: { registrations?: number };
}

export default function MyEventsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyEvents({ page, limit: 10 });
  const deleteEvent = useDeleteEvent();
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [manageEventId, setManageEventId] = useState<string | null>(null);

  const events = (data?.events ?? []) as Event[];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEvent.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const columns: ColumnDef<Event, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            href={`/events/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant={row.original.type === "FREE" ? "secondary" : "default"}>
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.visibility}</Badge>
        ),
      },
      {
        id: "participants",
        header: "Participants",
        cell: ({ row }) => (
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            {row.original._count?.registrations ?? 0}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`/dashboard/events/${row.original.id}/edit`}>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setManageEventId(row.original.id)}
            >
              Manage
            </Button>
          </div>
        ),
      },
    ],
    [setDeleteTarget, setManageEventId]
  );

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">My Events</h1>
        <Link href="/dashboard/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </header>

      {!isLoading && events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          heading="No events yet"
          body="You haven't created any events. Get started by creating your first one."
          ctaLabel="Create Event"
          ctaHref="/dashboard/events/create"
        />
      ) : (
        <DataTable
          columns={columns}
          data={events}
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
