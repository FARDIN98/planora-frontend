"use client";

import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/hooks/use-events";
import { EventForm } from "@/components/events/event-form";

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
