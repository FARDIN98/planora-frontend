"use client";

import { useRouter } from "next/navigation";
import { useEvent, useUpdateEvent } from "@/hooks/use-events";
import { EventForm, type EventFormData } from "@/components/events/event-form";
import { Skeleton } from "@/components/ui/skeleton";

interface EditEventClientProps {
  eventId: string;
}

export function EditEventClient({ eventId }: EditEventClientProps) {
  const router = useRouter();
  const { data: event, isLoading } = useEvent(eventId);
  const updateEvent = useUpdateEvent();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  const eventData = event as Record<string, unknown> | undefined;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Edit Event
      </h1>
      <EventForm
        mode="edit"
        initialData={
          eventData
            ? {
                title: eventData.title as string,
                description: eventData.description as string,
                date: eventData.date
                  ? new Date(eventData.date as string)
                      .toISOString()
                      .split("T")[0]
                  : "",
                time: (eventData.time as string) ?? "",
                venue: eventData.venue as string,
                visibility: eventData.visibility as string,
                fee: Number(eventData.fee) || 0,
              }
            : undefined
        }
        onSubmit={(data: EventFormData) =>
          updateEvent.mutate(
            { id: eventId, ...data } as { id: string } & Record<
              string,
              unknown
            >,
            {
              onSuccess: () => router.push("/dashboard/events"),
            }
          )
        }
        isSubmitting={updateEvent.isPending}
      />
    </div>
  );
}
