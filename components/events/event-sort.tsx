"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SORT_OPTIONS = [
  { label: "Date: Newest First", value: "date_newest" },
  { label: "Date: Oldest First", value: "date_oldest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Most Popular", value: "popular" },
];

export function EventSort({ sortBy, onSortChange }: EventSortProps) {
  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
