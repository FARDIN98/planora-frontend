"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">Planora</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-sm hidden sm:block">
          {user?.name}
        </span>
        <Avatar size="sm">
          <AvatarFallback>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
