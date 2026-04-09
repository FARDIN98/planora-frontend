import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface FeaturedOrganizersProps {
  organizers?: {
    id: string;
    name: string;
    _count: { events: number };
  }[];
}

export function FeaturedOrganizers({ organizers }: FeaturedOrganizersProps) {
  if (!organizers || organizers.length === 0) return null;

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Featured Organizers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {organizers.map((organizer) => (
            <Card
              key={organizer.id}
              className="p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="p-0 flex flex-col items-center space-y-4">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {organizer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-base font-semibold">{organizer.name}</h3>
                <Badge variant="secondary">
                  {organizer._count.events} events organized
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
