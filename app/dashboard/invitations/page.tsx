"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useMyInvitations,
  useRespondInvitation,
} from "@/hooks/use-invitations";
import { DataTable } from "@/components/data-tables/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Invitation {
  id: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    fee: number;
    type: string;
  };
  sender: {
    name: string;
  };
  registration?: {
    status: string;
  } | null;
}

export default function InvitationsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyInvitations({ page, limit: 10 });
  const respondInvitation = useRespondInvitation();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast.success("Payment successful! Waiting for host approval.");
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled.");
    }
  }, [searchParams]);

  const invitations = (data?.invitations ?? []) as Invitation[];
  const totalPages = data?.totalPages ?? 1;

  const handleRespond = async (
    invitationId: string,
    action: "accept" | "decline"
  ) => {
    setProcessingId(invitationId);
    try {
      await respondInvitation.mutateAsync({ invitationId, action });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.status === "PENDING") return <Badge variant="outline">PENDING</Badge>;
    if (invitation.status === "DECLINED") return <Badge variant="secondary">DECLINED</Badge>;
    if (invitation.registration?.status === "APPROVED") return <Badge variant="default">ACCEPTED</Badge>;
    return <Badge variant="outline">Pending Approval</Badge>;
  };

  const columns: ColumnDef<Invitation, unknown>[] = [
    {
      accessorKey: "event.title",
      header: "Event",
      cell: ({ row }) => (
        <Link
          href={`/events/${row.original.event.id}`}
          className="font-medium hover:underline"
        >
          {row.original.event.title}
        </Link>
      ),
    },
    {
      accessorKey: "sender.name",
      header: "Organizer",
      cell: ({ row }) => row.original.sender.name,
    },
    {
      accessorKey: "event.date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.event.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inv = row.original;
        if (inv.status !== "PENDING") return null;
        const isProcessing = processingId === inv.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleRespond(inv.id, "accept")}
              disabled={isProcessing}
            >
              {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              {inv.event.type === "FREE" ? "Accept" : "Pay & Accept"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRespond(inv.id, "decline")}
              disabled={isProcessing}
            >
              Decline
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Invitations
      </h1>

      {!isLoading && invitations.length === 0 ? (
        <EmptyState
          icon={Mail}
          heading="No pending invitations"
          body="You don't have any invitations right now. Check back later or browse events to join."
          ctaLabel="Browse Events"
          ctaHref="/events"
        />
      ) : (
        <DataTable
          columns={columns}
          data={invitations}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
