"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, CalendarDays } from "lucide-react";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { EventFilters } from "@/components/events/event-filters";
import { EventSort } from "@/components/events/event-sort";
import { Input } from "@/components/ui/input";
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
import { apiFetch } from "@/lib/api";

type EventCardEvent = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  fee: number;
  visibility: string;
  imageUrl?: string;
  organizer: { name: string };
  _count?: { registrations: number };
  averageRating?: number;
};

interface SuggestionEvent {
  id: string;
  title: string;
  date: string;
}

const LIMIT = 12;

export default function EventsDiscoveryPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <EventsDiscoveryContent />
    </Suspense>
  );
}

// Fuzzy search scoring: exact match = 3, startsWith = 2, includes = 1
function fuzzyScore(query: string, title: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  if (t === q) return 3;
  if (t.startsWith(q)) return 2;
  if (t.includes(q)) return 1;
  return 0;
}

function EventsDiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Read initial state from URL search params
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "date_newest"
  );

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    venue: searchParams.get("venue") || "",
  });

  // AI search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allEvents, setAllEvents] = useState<SuggestionEvent[]>([]);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load all event titles for fuzzy search suggestions
  useEffect(() => {
    if (suggestionsLoaded) return;
    apiFetch<{ events: SuggestionEvent[] }>("/api/v1/events?limit=50")
      .then((data) => {
        setAllEvents(data.events);
        setSuggestionsLoaded(true);
      })
      .catch(() => {
        // Silently fail - suggestions are optional
      });
  }, [suggestionsLoaded]);

  // Compute suggestions based on search input
  const suggestions = useMemo(() => {
    if (searchInput.length < 2) return [];
    return allEvents
      .map((event) => ({
        ...event,
        score: fuzzyScore(searchInput, event.title),
      }))
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [searchInput, allEvents]);

  // Parse sort value into sortBy + sortOrder for the API
  function parseSortValue(value: string) {
    switch (value) {
      case "date_newest":
        return { sortBy: "date", sortOrder: "desc" };
      case "date_oldest":
        return { sortBy: "date", sortOrder: "asc" };
      case "price_low":
        return { sortBy: "fee", sortOrder: "asc" };
      case "popular":
        return { sortBy: "createdAt", sortOrder: "desc" };
      default:
        return { sortBy: "date", sortOrder: "desc" };
    }
  }

  // Parse category filter into visibility + type
  function parseCategoryFilter(category: string) {
    if (category === "all") return { visibility: undefined, type: undefined };
    const parts = category.split("_");
    return {
      visibility: parts[0] as string,
      type: parts[1] as string,
    };
  }

  // Sync filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.venue) params.set("venue", filters.venue);
    if (sortBy !== "date_newest") params.set("sortBy", sortBy);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, filters, sortBy, page, pathname, router]);

  const { visibility: filterVisibility, type: filterType } = parseCategoryFilter(filters.category);
  const { sortBy: apiSortBy, sortOrder: apiSortOrder } = parseSortValue(sortBy);

  const { data, isLoading } = useEvents({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    visibility: filterVisibility,
    type: filterType,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
    venue: filters.venue || undefined,
    sortBy: apiSortBy,
    sortOrder: apiSortOrder,
  });

  const events = (data?.events ?? []) as EventCardEvent[];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  function handleFilterChange(newFilters: typeof filters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    setPage(1);
  }

  function handleClearAll() {
    setSearchInput("");
    setDebouncedSearch("");
    setFilters({
      category: "all",
      dateFrom: "",
      dateTo: "",
      priceMin: "",
      priceMax: "",
      venue: "",
    });
    setSortBy("date_newest");
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSuggestionClick(title: string) {
    setSearchInput(title);
    setDebouncedSearch(title);
    setShowSuggestions(false);
    setPage(1);
  }

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
        <p className="text-muted-foreground mt-1">
          Find and join events that match your interests
        </p>
      </header>

      {/* Search Bar with AI Suggestions */}
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder="Search events by title or organizer..."
          className="pl-10 h-11"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {/* AI Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden">
            {suggestions.map((suggestion) => {
              const formattedDate = new Date(suggestion.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <button
                  key={suggestion.id}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(suggestion.title);
                  }}
                >
                  <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{formattedDate}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mt-4">
        <EventFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Sort + Result Count */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${total} event${total !== 1 ? "s" : ""} found`}
        </p>
        <EventSort sortBy={sortBy} onSortChange={handleSortChange} />
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length > 0 ? (
        <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
            body="Try adjusting your filters or create a new event to get started."
            ctaLabel="Clear Filters"
            onCtaClick={handleClearAll}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
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
