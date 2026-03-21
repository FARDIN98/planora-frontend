export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Contact Us</h1>
      <p className="text-muted-foreground">
        Have questions, feedback, or need support? We would love to hear from you.
        Reach out to us at{" "}
        <a
          href="mailto:support@planora.com"
          className="text-primary hover:underline"
        >
          support@planora.com
        </a>{" "}
        and our team will get back to you as soon as possible.
      </p>
    </div>
  );
}
