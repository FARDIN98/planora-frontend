import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetailsClient = dynamic(
  () =>
    import("./event-details-client").then((mod) => ({
      default: mod.EventDetailsClient,
    })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    ),
  }
);

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailsClient eventId={id} />;
}
