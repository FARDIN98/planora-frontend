"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch(`${API_URL}/api/v1/newsletter/subscribe`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("Thanks for subscribing! You'll hear from us soon.");
      setEmail("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.info("You're already subscribed to our newsletter.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-md mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-6">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-semibold mb-3">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to our newsletter for the latest events and updates.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" variant="default" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Newsletter"}
          </Button>
        </form>
      </div>
    </section>
  );
}
