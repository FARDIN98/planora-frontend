"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Lock, User, CalendarDays, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateFields(): boolean {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateFields()) return;

    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        if (result.error.message?.toLowerCase().includes("already") || result.error.code === "USER_ALREADY_EXISTS") {
          setError("An account with this email already exists. Please sign in instead.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        router.push("/");
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-950 via-rose-950 to-amber-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute bottom-32 right-16 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 backdrop-blur-sm border border-orange-400/20">
              <CalendarDays className="h-5 w-5 text-orange-300" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Planora</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Your events,<br />
              your way.<br />
              Start planning today.
            </h2>
            <p className="text-lg text-orange-200/60 max-w-md">
              Create, manage, and share events effortlessly. From intimate gatherings to large conferences.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 max-w-sm">
              <div className="rounded-lg bg-orange-500/10 p-4 backdrop-blur-sm border border-orange-400/15">
                <p className="text-sm font-medium text-orange-100">Easy Setup</p>
                <p className="text-xs text-orange-300/50 mt-1">Create events in minutes</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-4 backdrop-blur-sm border border-orange-400/15">
                <p className="text-sm font-medium text-orange-100">Smart Reviews</p>
                <p className="text-xs text-orange-300/50 mt-1">Collect attendee feedback</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-4 backdrop-blur-sm border border-orange-400/15">
                <p className="text-sm font-medium text-orange-100">Invite System</p>
                <p className="text-xs text-orange-300/50 mt-1">Manage your guest list</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-4 backdrop-blur-sm border border-orange-400/15">
                <p className="text-sm font-medium text-orange-100">Admin Dashboard</p>
                <p className="text-xs text-orange-300/50 mt-1">Full control at a glance</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-orange-300/30">
            &copy; {new Date().getFullYear()} Planora. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-12 py-12 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <CalendarDays className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Planora</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">Get started with Planora</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  className={`pl-10 h-11 ${fieldErrors.name ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                />
              </div>
              {fieldErrors.name && (
                <p id="name-error" className="text-sm text-destructive" aria-live="polite">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: undefined })); }}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
