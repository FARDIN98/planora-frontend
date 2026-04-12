import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Planora?",
    answer:
      "Planora is a comprehensive event management platform that lets you create, discover, and join events. Whether you're organizing a meetup, workshop, or conference, Planora provides all the tools you need to manage registrations, payments, and attendees in one place.",
  },
  {
    question: "How do I create an event?",
    answer:
      "Simply sign up for a free account, go to your dashboard, and click 'Create Event'. Fill in the event details including title, description, date, venue, and choose whether it's public or private, free or paid. Your event will be live in minutes.",
  },
  {
    question: "Are there any fees for using Planora?",
    answer:
      "Creating a free account is completely free. You can create and join unlimited free events at no cost. For paid events, Stripe processes payments securely and charges a small processing fee. Planora itself does not charge any platform fees.",
  },
  {
    question: "How do payments work for paid events?",
    answer:
      "We use Stripe for secure payment processing. When you register for a paid event, you'll be redirected to a secure Stripe checkout page. Your payment information is handled entirely by Stripe and never stored on our servers.",
  },
  {
    question: "Can I invite specific people to my event?",
    answer:
      "Yes! Private events allow you to send direct invitations to specific users. Invited users will see the invitation in their dashboard and can accept or decline. For paid private events, invited users can pay and accept the invitation seamlessly.",
  },
  {
    question: "How do reviews and ratings work?",
    answer:
      "After attending an event, confirmed participants can leave a review with a star rating (1-5) and written feedback. Reviews help other users discover great events and help organizers improve their offerings.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We take security seriously. All payments are processed through Stripe, ensuring PCI compliance. User passwords are hashed using industry-standard bcrypt hashing. We use JWT-based authentication to protect your account and data.",
  },
];

export function FaqSection() {
  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
