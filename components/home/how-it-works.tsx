import { Search, UserPlus, CreditCard, PartyPopper } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Browse Events",
    description: "Discover events that match your interests",
  },
  {
    number: 2,
    icon: UserPlus,
    title: "Register",
    description: "Sign up with one click or request to join",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Pay Securely",
    description: "Safe payments via Stripe for paid events",
  },
  {
    number: 4,
    icon: PartyPopper,
    title: "Enjoy",
    description: "Attend, connect, and share your experience",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center text-sm font-semibold shrink-0">
                    {step.number}
                  </div>
                </div>
                <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
