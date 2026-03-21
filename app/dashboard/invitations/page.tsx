"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Loader2 } from "lucide-react";
import {
  useMyInvitations,
  useRespondInvitation,
} from "@/hooks/use-invitations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  inviter: {
    name: string;
  };
}

export default function InvitationsPage() {
  const { data, isLoading } = useMyInvitations();
  const respondInvitation = useRespondInvitation();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const invitations = (data?.invitations ?? []) as Invitation[];

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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Invitations</h1>

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : invitations.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold">
              No pending invitations
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              When someone invites you to an event, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mt-6">
          {invitations.map((invitation) => (
            <Card
              key={invitation.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4"
            >
              <div className="space-y-1 min-w-0">
                <Link
                  href={`/events/${invitation.event.id}`}
                  className="font-semibold hover:underline"
                >
                  {invitation.event.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Invited by {invitation.inviter.name}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(invitation.event.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <Badge
                    variant={
                      invitation.event.type === "FREE"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {invitation.event.type === "FREE"
                      ? "FREE"
                      : `$${invitation.event.fee}`}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-row gap-2 shrink-0">
                {invitation.event.type === "FREE" ? (
                  <Button
                    onClick={() => handleRespond(invitation.id, "accept")}
                    disabled={processingId === invitation.id}
                  >
                    {processingId === invitation.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Accept
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRespond(invitation.id, "accept")}
                    disabled={processingId === invitation.id}
                  >
                    {processingId === invitation.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Pay & Accept
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="min-h-11"
                  onClick={() => handleRespond(invitation.id, "decline")}
                  disabled={processingId === invitation.id}
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
