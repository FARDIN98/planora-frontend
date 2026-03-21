"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const result = await authClient.updateUser({ name });
      if (result.error) {
        toast.error(result.error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated");
        // Refetch session to update displayed user info
        await authClient.getSession();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      <Card className="max-w-lg mt-6">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={session?.user?.email ?? ""}
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
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
