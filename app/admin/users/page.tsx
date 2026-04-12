"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Trash2, Users, Loader2 } from "lucide-react";
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
import { useAdminUsers, useAdminRemoveUser } from "@/hooks/use-admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count?: { events: number };
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const limit = 10;

  const { data, isLoading } = useAdminUsers({
    limit,
    offset: (page - 1) * limit,
  });
  const adminRemoveUser = useAdminRemoveUser();

  const usersResponse = data as { users?: User[]; total?: number } | undefined;
  const users = usersResponse?.users ?? [];
  const total = usersResponse?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = () => {
    if (!deletingUser) return;
    adminRemoveUser.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  const columns: ColumnDef<User, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge
            variant={row.original.role === "admin" ? "destructive" : "secondary"}
          >
            {row.original.role === "admin" ? "Admin" : "User"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "eventsCount",
        header: "Events Count",
        cell: ({ row }) => row.original._count?.events ?? 0,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          if (user.role === "admin") return null;
          return (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive min-h-11 min-w-11"
              onClick={() => setDeletingUser(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    []
  );

  if (!isLoading && users.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <div className="mt-6">
          <EmptyState
            icon={Users}
            heading="No users"
            body="There are no registered users yet."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Users</h1>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={users}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this user and all their data. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={adminRemoveUser.isPending}
            >
              {adminRemoveUser.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {adminRemoveUser.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
