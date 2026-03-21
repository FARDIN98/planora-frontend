"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/hooks/use-events";
import { Skeleton } from "@/components/ui/skeleton";

const EventForm = dynamic(
  () =>
    import("@/components/events/event-form").then((mod) => ({
      default: mod.EventForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    ),
  }
);

export default function CreateEventPage() {
  const router = useRouter();
  const createEvent = useCreateEvent();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Create Event
      </h1>
      <EventForm
        mode="create"
        onSubmit={(data) =>
          createEvent.mutate(data as unknown as Record<string, unknown>, {
            onSuccess: () => router.push("/dashboard/events"),
          })
        }
        isSubmitting={createEvent.isPending}
      />
    </div>
  );
}
