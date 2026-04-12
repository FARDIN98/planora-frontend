import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "When you create an account on Planora, we collect your name, email address, and password (stored securely using bcrypt hashing). If you sign in with Google, we receive your name and email from your Google profile.",
      "When you use our platform, we collect information about your event participation, reviews, blog posts, and interactions with other features. We also collect technical data such as your browser type, device information, and IP address for security and analytics purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use your personal information to provide and improve our services, including: managing your account and authentication, processing event registrations and payments, sending relevant notifications about events you have joined or created, and personalizing your experience with AI-powered recommendations.",
      "We may use aggregated, anonymized data for analytics and to improve the platform. We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We take the security of your data seriously. All passwords are hashed using bcrypt with industry-standard salt rounds. Authentication uses JWT tokens with automatic expiration. All data is transmitted over HTTPS with TLS encryption.",
      "Our backend implements rate limiting, input validation, and CORS protection to prevent unauthorized access. Payment data is handled entirely by Stripe and never touches our servers.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "Planora integrates with the following third-party services:",
      "Stripe: We use Stripe for payment processing. When you pay for an event, your payment information is handled directly by Stripe according to their privacy policy. We never store your credit card details.",
      "Google: If you use Google Sign-In, your authentication is handled by Google Identity Services. We only receive your name and email address.",
      "Google Gemini: Our AI assistant may use Google Gemini to generate responses. Conversation history is stored only in your browser session and is not persisted on our servers.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, update, or delete your personal information at any time through your dashboard settings. You can update your name, email, and password from the Settings tab.",
      "You may request a complete deletion of your account and associated data by contacting our support team. We will process deletion requests within 30 days.",
      "You can opt out of our newsletter at any time by using the unsubscribe link in our emails or contacting support.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions about this Privacy Policy or our data practices, please contact us:",
      "Email: hello@planora.com",
      "You can also reach us through our Contact page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: April 2026
        </p>
      </div>

      <p className="text-muted-foreground">
        At Planora, we take your privacy seriously. This policy outlines how we
        collect, use, and protect your personal information when you use our
        platform. By using Planora, you agree to the practices described in this
        policy.
      </p>

      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          <div className="space-y-3">
            {section.content.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-lg border bg-muted/30 p-6 mt-8">
        <p className="text-sm text-muted-foreground">
          This privacy policy is effective as of April 2026. We may update this
          policy from time to time. Changes will be posted on this page with an
          updated revision date. For questions, visit our{" "}
          <Link
            href="/contact"
            className="text-primary hover:underline"
          >
            Contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
