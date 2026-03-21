"use client";

import { useState } from "react";
import { Trash2, Mail, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
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
import { useAdminUsers, useAdminRemoveUser } from "@/hooks/use-admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Users</h1>

      {/* Desktop Table */}
      <div className="mt-6 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Users}
                    heading="No users"
                    body="There are no registered users yet."
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive min-h-11 min-w-11"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
                  <Skeleton className="h-4 w-[50%]" />
                  <Skeleton className="h-3 w-[60%]" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-md shrink-0" />
              </div>
            </Card>
          ))
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            heading="No users"
            body="There are no registered users yet."
          />
        ) : (
          users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user.role !== "admin" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive min-h-11 min-w-11 shrink-0"
                    onClick={() => setDeletingUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account for {deletingUser?.name} ({deletingUser?.email}). All their data will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={adminRemoveUser.isPending}
            >
              {adminRemoveUser.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
