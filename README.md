# Planora — Frontend

The client application for **Planora**, a full-stack event management platform built with Next.js. Users can discover, create, join, and manage events — with Stripe payments, an invitation system, reviews, and an admin dashboard.

**Live URL:** https://planora-frontend.vercel.app
---

---
## Admin Credentials

```
Email    : admin@planora.com
Password : admin123
```
---

## Features

### Public Pages
- **Homepage** — Hero with featured event, upcoming events auto-scrolling slider, event category filters, call-to-action section
- **Events Discovery** — Search by title/organizer, filter by visibility (Public/Private) and type (Free/Paid), paginated results
- **Event Details** — Full event info with context-aware action buttons, owner controls, and review section

### Authentication
- **Register & Login** — JWT-based auth with form validation and error handling
- **Route Protection** — Edge middleware blocks unauthorized access before page load
- **Role-Based UI** — Admin features visible only to admin users

### Dashboard
- **My Events** — Create, edit, and delete events with participant management (approve/reject/ban)
- **Invitations** — Accept, decline, or Pay & Accept invitations for paid events
- **My Reviews** — View, edit, and delete submitted reviews
- **Settings** — Update profile name and notification preferences

### Admin Panel
- **Event Management** — View all events, delete inappropriate content, set featured event
- **User Management** — View all users, delete accounts
- **Access Denied Page** — Non-admin users see a clear error page

### Payments
- **Stripe Integration** — Seamless checkout for paid events and paid invitations
- **Post-Payment Flow** — Redirect handling with success/cancel notifications

### UI/UX
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **Dark/Light Mode** — Theme toggle with system preference detection
- **Loading States** — Skeleton loaders and spinner indicators throughout
- **Toast Notifications** — Success, error, and info feedback via Sonner
- **Animations** — Page transitions, staggered grids, auto-scrolling slider

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16                          |
| Language         | TypeScript 5                        |
| UI Components    | shadcn/ui + Radix UI                |
| Styling          | Tailwind CSS 4                      |
| State Management | Zustand + React Context             |
| Server State     | TanStack React Query v5             |
| Icons            | Lucide React                        |
| Animations       | Motion (Framer Motion)              |
| Notifications    | Sonner                              |
| Theme            | next-themes                         |
| Deployment       | Vercel                              |

---

## Project Structure

```
app/
├── (public)/           # Public pages (home, events, about, contact, privacy)
│   ├── page.tsx        # Homepage with 4 sections
│   └── events/         # Events listing and detail pages
├── (auth)/             # Login and register pages
├── dashboard/          # User dashboard (events, invitations, reviews, settings)
├── admin/              # Admin panel (events, users management)
├── unauthorized/       # Access denied page
├── layout.tsx          # Root layout with providers
├── not-found.tsx       # Custom 404 page
└── error.tsx           # Error boundary
components/
├── ui/                 # shadcn/ui components (Button, Card, Dialog, etc.)
├── layout/             # Navbar, Footer, PageTransition
├── events/             # EventCard, StarRating, InviteUserDialog
├── dashboard/          # DashboardSidebar, DashboardHeader
├── admin/              # AdminSidebar
├── shared/             # EmptyState, AnimatedSection, StaggeredGrid
└── providers/          # QueryProvider, ThemeProvider
hooks/                  # Custom hooks (useEvents, useRegistrations, etc.)
lib/                    # API client, auth context, utilities
middleware.ts           # Edge route protection
```

---

## Pages Overview

| Route                         | Description                        | Access     |
| ----------------------------- | ---------------------------------- | ---------- |
| `/`                           | Homepage                           | Public     |
| `/events`                     | Events listing with search/filter  | Public     |
| `/events/:id`                 | Event details + reviews            | Public     |
| `/login`                      | Login page                         | Guest only |
| `/register`                   | Register page                      | Guest only |
| `/dashboard`                  | Dashboard home                     | Auth       |
| `/dashboard/events`           | My events management               | Auth       |
| `/dashboard/events/create`    | Create new event                   | Auth       |
| `/dashboard/events/:id/edit`  | Edit event                         | Auth       |
| `/dashboard/invitations`      | Pending invitations                | Auth       |
| `/dashboard/reviews`          | My reviews                         | Auth       |
| `/dashboard/settings`         | Profile & notification settings    | Auth       |
| `/admin`                      | Admin overview                     | Admin      |
| `/admin/events`               | Manage all events                  | Admin      |
| `/admin/users`                | Manage all users                   | Admin      |
| `/about`                      | About page                         | Public     |
| `/contact`                    | Contact page                       | Public     |
| `/privacy`                    | Privacy policy                     | Public     |
| `/unauthorized`               | Access denied                      | Public     |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1.0+
- Planora backend running locally or deployed

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/planora-frontend.git
cd planora-frontend

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

For production, point to your deployed backend:

```env
NEXT_PUBLIC_API_URL=render_url
```

### Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun run start
```

---

## Deployment

Deployed on **Vercel** with automatic builds from the `main` branch. The `next.config.ts` includes API rewrites to proxy `/api/*` requests to the backend.
