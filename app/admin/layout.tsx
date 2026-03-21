"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center h-14 px-4 border-b bg-background">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2 ml-2">
              <CalendarDays className="h-5 w-5" />
              <span className="font-semibold">Planora</span>
              <Badge variant="destructive" className="text-xs">
                Admin
              </Badge>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
