import { EventDetailsClient } from "./event-details-client";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailsClient eventId={id} />;
}
