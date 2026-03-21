"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility: string;
  fee: number;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isSubmitting?: boolean;
}

export function EventForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [date, setDate] = useState(initialData?.date ?? "");
  const [time, setTime] = useState(initialData?.time ?? "");
  const [venue, setVenue] = useState(initialData?.venue ?? "");
  const [visibility, setVisibility] = useState(
    initialData?.visibility ?? "PUBLIC"
  );
  const [fee, setFee] = useState(String(initialData?.fee ?? "0"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setDate(initialData.date ?? "");
      setTime(initialData.time ?? "");
      setVenue(initialData.venue ?? "");
      setVisibility(initialData.visibility ?? "PUBLIC");
      setFee(String(initialData.fee ?? "0"));
    }
  }, [initialData]);

  const validateField = useCallback(
    (field: string, value: string): string | undefined => {
      switch (field) {
        case "title":
          if (!value.trim()) return "Title is required";
          if (value.trim().length < 3)
            return "Title must be at least 3 characters";
          if (value.trim().length > 100)
            return "Title must be under 100 characters";
          return undefined;
        case "date":
          if (!value) return "Date is required";
          if (mode === "create") {
            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected < today) return "Event date must be in the future";
          }
          return undefined;
        case "time":
          if (!value) return "Time is required";
          return undefined;
        case "venue":
          if (!value.trim()) return "Venue is required";
          if (value.trim().length < 3)
            return "Venue must be at least 3 characters";
          return undefined;
        case "fee": {
          const num = Number(value);
          if (value !== "" && (isNaN(num) || num < 0))
            return "Fee must be a valid number";
          return undefined;
        }
        default:
          return undefined;
      }
    },
    [mode]
  );

  const handleFieldChange = (field: string, value: string) => {
    // Update value
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      case "venue":
        setVenue(value);
        break;
      case "fee":
        setFee(value);
        break;
    }
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field] = error;
        else delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const validateAll = (): boolean => {
    const fields = { title, date, time, venue, fee };
    const newErrors: Record<string, string> = {};
    for (const [field, value] of Object.entries(fields)) {
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);
    setTouched({ title: true, date: true, time: true, venue: true, fee: true });
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    title.trim().length >= 3 &&
    date !== "" &&
    time !== "" &&
    venue.trim().length >= 3 &&
    !isNaN(Number(fee)) &&
    Number(fee) >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    const feeNum = Number(fee) || 0;
    onSubmit({
      title,
      description,
      date,
      time,
      venue,
      visibility,
      type: feeNum > 0 ? "PAID" : "FREE",
      fee: feeNum,
    } as EventFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          onBlur={() => handleBlur("title", title)}
          placeholder="Event title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p id="title-error" className="text-destructive text-sm mt-1" aria-live="polite">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your event..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            onBlur={() => handleBlur("date", date)}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-error" : undefined}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && (
            <p id="date-error" className="text-destructive text-sm mt-1" aria-live="polite">
              {errors.date}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => handleFieldChange("time", e.target.value)}
            onBlur={() => handleBlur("time", time)}
            aria-invalid={!!errors.time}
            aria-describedby={errors.time ? "time-error" : undefined}
            className={errors.time ? "border-destructive" : ""}
          />
          {errors.time && (
            <p id="time-error" className="text-destructive text-sm mt-1" aria-live="polite">
              {errors.time}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input
          id="venue"
          value={venue}
          onChange={(e) => handleFieldChange("venue", e.target.value)}
          onBlur={() => handleBlur("venue", venue)}
          placeholder="Event venue"
          aria-invalid={!!errors.venue}
          aria-describedby={errors.venue ? "venue-error" : undefined}
          className={errors.venue ? "border-destructive" : ""}
        />
        {errors.venue && (
          <p id="venue-error" className="text-destructive text-sm mt-1" aria-live="polite">
            {errors.venue}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger id="visibility">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fee">Registration Fee (BDT)</Label>
          <Input
            id="fee"
            type="number"
            min="0"
            step="0.01"
            value={fee}
            onChange={(e) => handleFieldChange("fee", e.target.value)}
            onBlur={() => handleBlur("fee", fee)}
            placeholder="0"
            aria-invalid={!!errors.fee}
            aria-describedby={errors.fee ? "fee-error" : undefined}
            className={errors.fee ? "border-destructive" : ""}
          />
          {errors.fee && (
            <p id="fee-error" className="text-destructive text-sm mt-1" aria-live="polite">
              {errors.fee}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Create Event"
            : "Save Changes"}
      </Button>
    </form>
  );
}
