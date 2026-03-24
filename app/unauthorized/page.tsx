import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <ShieldX className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-3xl font-semibold mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You don&apos;t have permission to access this page. Admin privileges are
        required.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
