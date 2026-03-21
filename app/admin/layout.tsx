"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    } else if (!isPending && session && session.user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
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
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
