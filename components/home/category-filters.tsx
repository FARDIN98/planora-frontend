import Link from "next/link";
import { Users, Ticket, Lock, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryFiltersProps {
  categoryCounts?: {
    PUBLIC_FREE: number;
    PUBLIC_PAID: number;
    PRIVATE_FREE: number;
    PRIVATE_PAID: number;
  };
}

const categories = [
  {
    icon: Users,
    label: "Public Free",
    key: "PUBLIC_FREE" as const,
    href: "/events?visibility=PUBLIC&type=FREE",
  },
  {
    icon: Ticket,
    label: "Public Paid",
    key: "PUBLIC_PAID" as const,
    href: "/events?visibility=PUBLIC&type=PAID",
  },
  {
    icon: Lock,
    label: "Private Free",
    key: "PRIVATE_FREE" as const,
    href: "/events?visibility=PRIVATE&type=FREE",
  },
  {
    icon: Shield,
    label: "Private Paid",
    key: "PRIVATE_PAID" as const,
    href: "/events?visibility=PRIVATE&type=PAID",
  },
];

export function CategoryFilters({ categoryCounts }: CategoryFiltersProps) {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts?.[cat.key] ?? 0;
            return (
              <Link key={cat.label} href={cat.href}>
                <Card className="p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
                  <CardContent className="p-0 space-y-4">
                    <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{cat.label}</h3>
                    <Badge variant="secondary">{count} events</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
