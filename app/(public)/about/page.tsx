import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Shield,
  Search,
  CalendarDays,
  Sparkles,
  Globe,
} from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe in the power of bringing people together. Every feature we build is designed to foster connections and create memorable shared experiences.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your financial data is protected with industry-leading Stripe integration. Every transaction is encrypted and processed through secure payment channels.",
  },
  {
    icon: Search,
    title: "Easy Discovery",
    description:
      "Finding the right event should be effortless. Our smart search, filtering, and AI-powered recommendations help you discover events tailored to your interests.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Events",
    description:
      "From free public meetups to exclusive paid conferences, Planora supports every type of event. Create, manage, and grow your events with powerful tools.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Our intelligent assistant helps you navigate the platform, discover events, and get answers instantly. Powered by cutting-edge AI technology.",
  },
  {
    icon: Globe,
    title: "Open to Everyone",
    description:
      "Whether you are an organizer hosting your first event or an attendee looking for experiences, Planora welcomes everyone to join our growing community.",
  },
];

const stats = [
  { label: "Events Hosted", value: "500+" },
  { label: "Active Users", value: "10,000+" },
  { label: "Countries", value: "25+" },
  { label: "Satisfaction Rate", value: "98%" },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
          About Planora
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Planora is your all-in-one event management platform designed to make
          creating, discovering, and joining events effortless. We empower
          communities to come together and create memorable experiences.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Our Mission
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            At Planora, we believe that great events bring people together, spark
            ideas, and build lasting communities. Our mission is to make event
            management accessible to everyone -- from small community meetups to
            large-scale professional conferences.
          </p>
          <p>
            We are committed to building a platform that removes the friction
            from event organization. With intuitive tools for creating events,
            managing participants, handling payments, and collecting feedback,
            organizers can focus on what matters most: creating amazing
            experiences.
          </p>
          <p>
            For attendees, we strive to make event discovery a joy. Through smart
            search, personalized recommendations, and a seamless registration
            process, finding and joining events has never been easier.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg border bg-muted/30 p-8 mb-16">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          Planora in Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Ready to join?
        </h2>
        <p className="text-muted-foreground mb-6">
          Start discovering events or create your own today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/events">Browse Events</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
