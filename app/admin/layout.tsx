"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PageTransition } from "@/components/layout/page-transition";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

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
          <PageTransition>
            <main className="flex-1 p-6">{children}</main>
          </PageTransition>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
