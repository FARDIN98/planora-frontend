"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, CalendarDays, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateField(field: "email" | "password", value: string): string | undefined {
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    }
    if (field === "password") {
      if (!value) return "Password is required";
    }
    return undefined;
  }

  function validateFields(): boolean {
    const errors: { email?: string; password?: string } = {};
    const emailErr = validateField("email", email);
    if (emailErr) errors.email = emailErr;
    const passErr = validateField("password", password);
    if (passErr) errors.password = passErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateFields()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || "Invalid email or password. Please try again.");
      } else {
        login(json.data.accessToken);
        toast.success("Login successful!");
        const isAdmin = json.data.user.role === "admin";
        window.location.href = isAdmin ? "/admin" : "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-950 via-rose-950 to-amber-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 backdrop-blur-sm border border-orange-400/20">
              <CalendarDays className="h-5 w-5 text-orange-300" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Planora</span>
          </Link>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Discover events.<br />
              Connect with people.<br />
              Make it happen.
            </h2>
            <p className="text-lg text-orange-200/60 max-w-md">
              Join thousands of event organizers and attendees creating memorable experiences together.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-orange-100">500+</p>
                <p className="text-sm text-orange-300/50">Events hosted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-100">10K+</p>
                <p className="text-sm text-orange-300/50">Active users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-100">98%</p>
                <p className="text-sm text-orange-300/50">Satisfaction</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-orange-300/30">
            &copy; {new Date().getFullYear()} Planora. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 sm:px-12 py-12 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 md:hidden hover:opacity-80 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <CalendarDays className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Planora</span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your Planora account</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    setError(null);
                    if (fieldErrors.email) {
                      const err = validateField("email", val);
                      setFieldErrors((prev) => ({ ...prev, email: err }));
                    }
                  }}
                  onBlur={() => {
                    const err = validateField("email", email);
                    setFieldErrors((prev) => ({ ...prev, email: err }));
                  }}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`pl-10 h-11 ${fieldErrors.email ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-destructive" aria-live="polite">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    setError(null);
                    if (fieldErrors.password) {
                      const err = validateField("password", val);
                      setFieldErrors((prev) => ({ ...prev, password: err }));
                    }
                  }}
                  onBlur={() => {
                    const err = validateField("password", password);
                    setFieldErrors((prev) => ({ ...prev, password: err }));
                  }}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className={`pl-10 h-11 ${fieldErrors.password ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                />
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-destructive" aria-live="polite">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
