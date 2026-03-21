import Link from "next/link";
import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <CalendarOff className="h-16 w-16 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
