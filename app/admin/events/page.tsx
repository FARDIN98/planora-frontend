"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Trash2, Star, Eye, Loader2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAdminEvents,
  useAdminDeleteEvent,
  useAdminSetFeatured,
  useAdminUnsetFeatured,
} from "@/hooks/use-admin";

interface Event {
  id: string;
  title: string;
  date: string;
  visibility: string;
  fee: number;
  isFeatured?: boolean;
  organizer: { name: string };
  _count?: { registrations: number };
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const limit = 10;

  const { data, isLoading } = useAdminEvents({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const adminDeleteEvent = useAdminDeleteEvent();
  const setFeatured = useAdminSetFeatured();
  const unsetFeatured = useAdminUnsetFeatured();

  const events = (data?.events ?? []) as Event[];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = () => {
    if (!deletingEvent) return;
    adminDeleteEvent.mutate(deletingEvent.id, {
      onSuccess: () => setDeletingEvent(null),
    });
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const columns: ColumnDef<Event, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "organizer",
        header: "Organizer",
        cell: ({ row }) => row.original.organizer?.name ?? "Unknown",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString(),
      },
      {
        accessorKey: "fee",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant={row.original.fee > 0 ? "default" : "secondary"}>
            {row.original.fee > 0 ? "PAID" : "FREE"}
          </Badge>
        ),
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.visibility === "PUBLIC" ? "secondary" : "outline"
            }
          >
            {row.original.visibility}
          </Badge>
        ),
      },
      {
        id: "participants",
        header: "Participants",
        cell: ({ row }) => row.original._count?.registrations ?? 0,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const event = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="min-h-11 min-w-11" asChild>
                <Link href={`/events/${event.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`min-h-11 min-w-11 ${event.isFeatured ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"}`}
                      onClick={() =>
                        event.isFeatured
                          ? unsetFeatured.mutate(event.id)
                          : setFeatured.mutate(event.id)
                      }
                      disabled={
                        setFeatured.isPending || unsetFeatured.isPending
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${event.isFeatured ? "fill-amber-500" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {event.isFeatured
                      ? "Remove from featured"
                      : "Set as featured"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive min-h-11 min-w-11"
                onClick={() => setDeletingEvent(event)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [setFeatured, unsetFeatured]
  );

  if (!isLoading && events.length === 0 && !debouncedSearch) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <div className="mt-6">
          <EmptyState
            icon={CalendarDays}
            heading="No events"
            body="There are no events on the platform yet."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Events</h1>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={events}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search events..."
          isLoading={isLoading}
        />
      </div>

      <AlertDialog
        open={!!deletingEvent}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{deletingEvent?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all its registrations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={adminDeleteEvent.isPending}
            >
              {adminDeleteEvent.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {adminDeleteEvent.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
