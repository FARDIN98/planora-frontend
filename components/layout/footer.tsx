import Link from "next/link";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-8">
          {/* Brand */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Planora</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Discover, join, and manage events seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-sm text-muted-foreground text-center">
          2026 Planora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
