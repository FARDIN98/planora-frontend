import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Planora",
  description: "Discover, join, and manage events seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster position="bottom-right" duration={4000} />
        </QueryProvider>
      </body>
    </html>
  );
}
