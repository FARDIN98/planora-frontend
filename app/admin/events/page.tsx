"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEvents } from "@/hooks/use-events";
import { useAdminDeleteEvent } from "@/hooks/use-admin";

interface Event {
  id: string;
  title: string;
  date: string;
  visibility: string;
  fee: number;
  organizer: { name: string };
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

  const { data, isLoading } = useEvents({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const adminDeleteEvent = useAdminDeleteEvent();

  const events = (data?.events ?? []) as Event[];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = () => {
    if (!deletingEvent) return;
    adminDeleteEvent.mutate(deletingEvent.id, {
      onSuccess: () => setDeletingEvent(null),
    });
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Events</h1>

      <div className="relative max-w-sm mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
              ))
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={CalendarDays}
                    heading="No events"
                    body="There are no events on the platform yet."
                  />
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.organizer?.name ?? "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={event.visibility === "PUBLIC" ? "secondary" : "outline"}>
                        {event.visibility}
                      </Badge>
                      <Badge variant={event.fee > 0 ? "default" : "secondary"}>
                        {event.fee > 0 ? `$${event.fee}` : "FREE"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive min-h-11 min-w-11"
                      onClick={() => setDeletingEvent(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mt-6 md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-3 w-[40%]" />
                  <Skeleton className="h-3 w-[30%]" />
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-md shrink-0" />
              </div>
            </Card>
          ))
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            heading="No events"
            body="There are no events on the platform yet."
          />
        ) : (
          events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {event.organizer?.name ?? "Unknown"}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Badge variant={event.visibility === "PUBLIC" ? "secondary" : "outline"}>
                      {event.visibility}
                    </Badge>
                    <Badge variant={event.fee > 0 ? "default" : "secondary"}>
                      {event.fee > 0 ? `$${event.fee}` : "FREE"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive min-h-11 min-w-11 shrink-0"
                  onClick={() => setDeletingEvent(event)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog open={!!deletingEvent} onOpenChange={(open) => !open && setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletingEvent?.title}&quot; and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={adminDeleteEvent.isPending}
            >
              {adminDeleteEvent.isPending ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
