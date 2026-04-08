import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of users who trust Planora for their event management
          needs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/dashboard/events/create">
            <Button variant="default" className="min-h-11 w-full sm:w-auto">
              Create Your Event
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" className="min-h-11 w-full sm:w-auto">
              Explore Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
