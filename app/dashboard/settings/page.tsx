"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isLoading: sessionLoading, setToken } = useAuth();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [nameTouched, setNameTouched] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  function validateName(value: string): string | undefined {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  }

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameTouched) {
      setNameError(validateName(value));
    }
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    setNameError(validateName(name));
  };

  const isUnchanged = name === (user?.name ?? "");
  const isFormValid = !validateName(name) && !isUnchanged;

  const handleSave = async () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      setNameTouched(true);
      return;
    }
    setIsUpdating(true);
    try {
      const result = await apiFetch<{ user: { id: string; name: string; email: string; role: string }; accessToken: string }>(
        "/api/v1/auth/me",
        {
          method: "PUT",
          body: JSON.stringify({ name }),
        }
      );
      setToken(result.accessToken); // Re-issue JWT with updated name
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      {sessionLoading ? (
        <Card className="max-w-lg mt-6">
          <CardContent className="space-y-6 pt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
      <Card className="max-w-lg mt-6">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Your name"
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <p id="name-error" className="text-destructive text-sm mt-1" aria-live="polite">
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email ?? ""}
              disabled
              readOnly
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isUpdating || !isFormValid}
            className="w-full"
          >
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
