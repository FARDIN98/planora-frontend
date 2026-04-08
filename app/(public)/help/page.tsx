import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";

const faqItems = [
  {
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up' button in the top navigation bar. Fill in your name, email, and password (minimum 8 characters). You can also sign up using your Google account for a faster registration process.",
  },
  {
    question: "What types of events can I create?",
    answer:
      "Planora supports four types of events: Free Public (open to everyone at no cost), Paid Public (open to everyone with a registration fee), Free Private (invitation-only at no cost), and Paid Private (invitation-only with a registration fee). You can choose the type that best suits your event.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Paid events use Stripe for secure payment processing. When you register for a paid event, you'll be redirected to a Stripe checkout page. After successful payment, your registration is automatically confirmed. All transactions are encrypted and secure.",
  },
  {
    question: "How do invitations work for private events?",
    answer:
      "For private events, the event host can send invitations to specific users. Invited users receive a notification and can accept or decline the invitation. For paid private events, accepting an invitation requires completing the payment process.",
  },
  {
    question: "Can I leave reviews for events I've attended?",
    answer:
      "Yes! After attending an event, you can rate it from 1 to 5 stars and write a review. You can also edit or delete your review at any time. Reviews help other users discover great events.",
  },
  {
    question: "How do I manage my events from the dashboard?",
    answer:
      "Your dashboard provides tabs for managing all aspects of your events: My Events (events you created), Joined Events (events you registered for), Pending Invitations, My Reviews, and Settings. Each tab includes a data table for easy management.",
  },
  {
    question: "What is the blog feature?",
    answer:
      "Planora includes a community blog where registered users can create and publish blog posts using a rich text editor. Posts support formatting, images, and more. Admins can moderate blog content from the admin panel.",
  },
  {
    question: "What admin features are available?",
    answer:
      "Admins have access to a comprehensive dashboard with overview statistics, user management, event management, blog moderation, newsletter subscriber management, and detailed analytics with charts and data tables.",
  },
  {
    question: "How is my data protected?",
    answer:
      "We use JWT-based authentication with bcrypt password hashing, HTTPS encryption for all data in transit, and secure Stripe integration for payments. Your personal data is never sold to third parties. See our Privacy Policy for full details.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the Contact page. Fill out the contact form with your name, email, and message, and we'll get back to you as soon as possible. You can also email us directly at hello@planora.com.",
  },
  {
    question: "Can I use Planora on mobile devices?",
    answer:
      "Yes! Planora is fully responsive and works great on mobile phones, tablets, and desktop computers. The interface automatically adapts to your screen size for the best experience.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can manage your account settings from the Dashboard. If you need to delete your account, please contact our support team through the Contact page and we'll assist you with the process.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Help & Support
          </h1>
        </div>
        <p className="text-muted-foreground">
          Find answers to commonly asked questions about using Planora.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
        <p className="text-muted-foreground mb-4">
          Can&apos;t find what you&apos;re looking for? Our support team is here
          to help.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
