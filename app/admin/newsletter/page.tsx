"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Mail } from "lucide-react";
import { DataTable } from "@/components/data-tables/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useNewsletterSubscribers } from "@/hooks/use-admin";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useNewsletterSubscribers(page, limit);

  const subscribers = (data?.subscribers ?? []) as Subscriber[];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const columns: ColumnDef<Subscriber, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Subscribed Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  if (!isLoading && subscribers.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Newsletter Subscribers
        </h1>
        <div className="mt-6">
          <EmptyState
            icon={Mail}
            heading="No subscribers yet"
            body="Newsletter subscribers will appear here once users sign up."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          Newsletter Subscribers
        </h1>
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {total} subscriber{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={subscribers}
          pageCount={totalPages}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
