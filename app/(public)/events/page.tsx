"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { EventCard } from "@/components/events/event-card";
import { StaggeredGrid, StaggeredItem } from "@/components/shared/staggered-grid";
import { useEvents } from "@/hooks/use-events";

type EventCardEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  fee: number;
  visibility: string;
  organizer: { name: string };
  _count?: { registrations: number };
  averageRating?: number;
};

const LIMIT = 12;

export default function EventsDiscoveryPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <EventsDiscoveryContent />
    </Suspense>
  );
}

function EventsDiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial state from URL search params
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );
  const [visibility, setVisibility] = useState<string | null>(
    searchParams.get("visibility")
  );
  const [type, setType] = useState<string | null>(searchParams.get("type"));
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (visibility) params.set("visibility", visibility);
    if (type) params.set("type", type);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, visibility, type, page, pathname, router]);

  const { data, isLoading } = useEvents({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    visibility: visibility || undefined,
    type: type || undefined,
  });

  const events = (data?.events ?? []) as EventCardEvent[];
  const totalPages = data?.totalPages ?? 1;

  function handleClearFilters() {
    setSearchInput("");
    setDebouncedSearch("");
    setVisibility(null);
    setType(null);
    setPage(1);
  }

  function toggleVisibility(value: string) {
    setVisibility((prev) => (prev === value ? null : value));
    setPage(1);
  }

  function toggleType(value: string) {
    setType((prev) => (prev === value ? null : value));
    setPage(1);
  }

  function handleAllClick() {
    setVisibility(null);
    setType(null);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isAllActive = !visibility && !type;

  // Build page numbers for pagination
  function getPageNumbers(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Discover Events
        </h1>
      </header>

      {/* Search Bar */}
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search events by title or organizer..."
          className="pl-10 h-11"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto lg:flex-wrap gap-2 mt-4">
        <Button
          variant={isAllActive ? "default" : "secondary"}
          size="sm" className="min-h-11 min-w-11"
          onClick={handleAllClick}
        >
          All
        </Button>
        <Button
          variant={visibility === "PUBLIC" ? "default" : "secondary"}
          size="sm" className="min-h-11 min-w-11"
          onClick={() => toggleVisibility("PUBLIC")}
        >
          Public
        </Button>
        <Button
          variant={visibility === "PRIVATE" ? "default" : "secondary"}
          size="sm" className="min-h-11 min-w-11"
          onClick={() => toggleVisibility("PRIVATE")}
        >
          Private
        </Button>
        <Button
          variant={type === "FREE" ? "default" : "secondary"}
          size="sm" className="min-h-11 min-w-11"
          onClick={() => toggleType("FREE")}
        >
          Free
        </Button>
        <Button
          variant={type === "PAID" ? "default" : "secondary"}
          size="sm" className="min-h-11 min-w-11"
          onClick={() => toggleType("PAID")}
        >
          Paid
        </Button>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length > 0 ? (
        <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <StaggeredItem key={event.id}>
              <EventCard event={event} />
            </StaggeredItem>
          ))}
        </StaggeredGrid>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={Search}
            heading="No events found"
            body="No events match your filters. Try adjusting your search or clearing filters."
            ctaLabel="Clear Filters"
            onCtaClick={handleClearFilters}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, idx) =>
                pageNum === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
