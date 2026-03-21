"use client";

import { useState } from "react";
import { Check, X, Ban, Loader2 } from "lucide-react";
import {
  useEventRegistrations,
  useUpdateRegistration,
} from "@/hooks/use-registrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ManageParticipantsModalProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Registration {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function ManageParticipantsModal({
  eventId,
  open,
  onOpenChange,
}: ManageParticipantsModalProps) {
  const { data, isLoading } = useEventRegistrations(eventId);
  const updateRegistration = useUpdateRegistration();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const registrations = (data?.registrations ?? []) as Registration[];
  const pending = registrations.filter((r) => r.status === "PENDING");
  const approved = registrations.filter((r) => r.status === "APPROVED");
  const banned = registrations.filter((r) => r.status === "BANNED");

  const handleStatusChange = async (
    registrationId: string,
    status: string
  ) => {
    setProcessingId(registrationId);
    await updateRegistration.mutateAsync({
      eventId,
      registrationId,
      status,
    });
    setProcessingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Participants</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : registrations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No participants yet
            </p>
          ) : (
            <>
              {pending.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-3">
                    Pending ({pending.length})
                  </h3>
                  <div className="space-y-2">
                    {pending.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div>
                          <p className="font-semibold text-sm">
                            {reg.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reg.user.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(reg.id, "APPROVED")
                            }
                            disabled={processingId === reg.id}
                          >
                            {processingId === reg.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(reg.id, "REJECTED")
                            }
                            disabled={processingId === reg.id}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approved.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 mb-3">
                    Approved ({approved.length})
                  </h3>
                  <div className="space-y-2">
                    {approved.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div>
                          <p className="font-semibold text-sm">
                            {reg.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reg.user.email}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={processingId === reg.id}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Ban Participant
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will ban {reg.user.name} from this event.
                                They will no longer be able to access the event.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleStatusChange(reg.id, "BANNED")
                                }
                              >
                                Ban Participant
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {banned.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-3">
                    Banned ({banned.length})
                  </h3>
                  <div className="space-y-2">
                    {banned.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div>
                          <p className="font-semibold text-sm">
                            {reg.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reg.user.email}
                          </p>
                        </div>
                        <Badge variant="destructive">Banned</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
