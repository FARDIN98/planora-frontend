"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Menu, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    cn(
      "text-sm transition-colors",
      isActive(href)
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground"
    );

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="border-b bg-background" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl">Planora</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          <ThemeToggle />

          {session ? (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              {session.user.role === "admin" && (
                <Link href="/admin" className={linkClass("/admin")}>
                  Admin
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full" aria-label="User menu">
                    <Avatar>
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-xl">Planora</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pt-4">
                {publicLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} className={linkClass(link.href)}>
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {session ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/dashboard" className={linkClass("/dashboard")}>
                        Dashboard
                      </Link>
                    </SheetClose>
                    {session.user.role === "admin" && (
                      <SheetClose asChild>
                        <Link href="/admin" className={linkClass("/admin")}>
                          Admin
                        </Link>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
                        Profile
                      </Link>
                    </SheetClose>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-muted-foreground hover:text-foreground text-left flex items-center gap-2 min-h-11"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/login" className={linkClass("/login")}>
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register" className={linkClass("/register")}>
                        Sign Up
                      </Link>
                    </SheetClose>
                  </>
                )}

                <Separator className="my-2" />
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
