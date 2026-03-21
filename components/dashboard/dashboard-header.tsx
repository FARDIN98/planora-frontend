"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { data: session } = useSession();

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
        <span className="text-sm hidden sm:block">
          {session?.user?.name}
        </span>
        <Avatar size="sm">
          <AvatarFallback>
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
