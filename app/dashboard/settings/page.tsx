"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface NotificationPrefs {
  notifyInvitations: boolean;
  notifyApprovals: boolean;
  notifyReviews: boolean;
}

export default function SettingsPage() {
  const { user, isLoading: sessionLoading, setToken } = useAuth();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [nameTouched, setNameTouched] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Notification preferences
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    notifyInvitations: true,
    notifyApprovals: true,
    notifyReviews: true,
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsUpdating, setPrefsUpdating] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // Fetch notification preferences
  useEffect(() => {
    if (!user) return;
    async function fetchPrefs() {
      try {
        const data = await apiFetch<NotificationPrefs>("/api/v1/auth/notifications");
        setPrefs(data);
      } catch {
        // Keep defaults
      } finally {
        setPrefsLoading(false);
      }
    }
    fetchPrefs();
  }, [user]);

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
      setToken(result.accessToken);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePref = async (key: keyof NotificationPrefs, value: boolean) => {
    const previous = { ...prefs };
    setPrefs((p) => ({ ...p, [key]: value }));
    setPrefsUpdating(true);
    try {
      await apiFetch("/api/v1/auth/notifications", {
        method: "PUT",
        body: JSON.stringify({ [key]: value }),
      });
      toast.success("Notification preference updated");
    } catch {
      setPrefs(previous);
      toast.error("Failed to update preference");
    } finally {
      setPrefsUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      {sessionLoading ? (
        <div className="space-y-6 max-w-lg mt-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 max-w-lg mt-6">
          {/* Profile Section */}
          <div>
            <h2 className="text-lg font-medium mb-3">Profile</h2>
            <Card>
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
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-lg font-medium mb-3">Notifications</h2>
            <Card>
              <CardContent className="space-y-5 pt-6">
                {prefsLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-invitations">Event Invitations</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you receive an event invitation
                        </p>
                      </div>
                      <Switch
                        id="notify-invitations"
                        checked={prefs.notifyInvitations}
                        onCheckedChange={(v) => handleTogglePref("notifyInvitations", v)}
                        disabled={prefsUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-approvals">Registration Approvals</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your registration is approved or rejected
                        </p>
                      </div>
                      <Switch
                        id="notify-approvals"
                        checked={prefs.notifyApprovals}
                        onCheckedChange={(v) => handleTogglePref("notifyApprovals", v)}
                        disabled={prefsUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-reviews">Event Reviews</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone reviews your event
                        </p>
                      </div>
                      <Switch
                        id="notify-reviews"
                        checked={prefs.notifyReviews}
                        onCheckedChange={(v) => handleTogglePref("notifyReviews", v)}
                        disabled={prefsUpdating}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
