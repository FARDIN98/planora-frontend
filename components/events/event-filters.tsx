"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface EventFilterValues {
  category: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  venue: string;
}

interface EventFiltersProps {
  filters: EventFilterValues;
  onFilterChange: (filters: EventFilterValues) => void;
}

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Public Free", value: "PUBLIC_FREE" },
  { label: "Public Paid", value: "PUBLIC_PAID" },
  { label: "Private Free", value: "PRIVATE_FREE" },
  { label: "Private Paid", value: "PRIVATE_PAID" },
];

export function EventFilters({ filters, onFilterChange }: EventFiltersProps) {
  function updateFilter(key: keyof EventFilterValues, value: string) {
    onFilterChange({ ...filters, [key]: value });
  }

  function handleClearFilters() {
    onFilterChange({
      category: "all",
      dateFrom: "",
      dateTo: "",
      priceMin: "",
      priceMax: "",
      venue: "",
    });
  }

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.venue !== "";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter 1: Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter 2: Date Range */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Date Range
          </label>
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="From"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="flex-1"
              aria-label="From date"
            />
            <Input
              type="date"
              placeholder="To"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="flex-1"
              aria-label="To date"
            />
          </div>
        </div>

        {/* Filter 3: Price Range */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Price Range
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min $"
              value={filters.priceMin}
              onChange={(e) => updateFilter("priceMin", e.target.value)}
              className="flex-1"
              aria-label="Minimum price"
            />
            <Input
              type="number"
              min={0}
              placeholder="Max $"
              value={filters.priceMax}
              onChange={(e) => updateFilter("priceMax", e.target.value)}
              className="flex-1"
              aria-label="Maximum price"
            />
          </div>
        </div>

        {/* Filter 4: Location/Venue */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Location
          </label>
          <Input
            type="text"
            placeholder="Search by venue..."
            value={filters.venue}
            onChange={(e) => updateFilter("venue", e.target.value)}
            aria-label="Venue search"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
