# CLAUDE.md — ENV.ART (Beginner CG Artist)

## Project Overview

ENV.ART is a 3D environment artist portfolio website built with **Lovable** (AI-generated, Supabase-backed). It combines a public-facing portfolio/blog/tutorial site with a password-protected admin CMS panel.

**What it does:**
- Showcases Blender 3D environment art projects
- Hosts tutorials, blog posts, and a resource library
- Captures email subscribers (download-gated content)
- Admin panel for full content management + analytics

**Built with:** Lovable + Supabase (backend), React + Vite (frontend)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.8 |
| Bundler | Vite 5.4 (port 8080) |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Animations | Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Forms | React Hook Form + Zod |
| Server State | TanStack React Query 5 |
| Backend | Supabase (PostgreSQL + Edge Functions + Storage) |
| SEO | react-helmet-async |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deployment | Vercel (frontend) + Lovable/Supabase (backend) |

---

## Commands

```bash
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
npm run test       # Run Vitest unit tests once
```

---

## Project Structure

```
src/
├── pages/             # Route-level page components
│   └── admin/         # Admin panel pages (password protected)
├── components/        # Reusable UI components
│   └── ui/            # shadcn/ui component library (40+ components)
├── services/          # Data access layer (Supabase queries + seed fallbacks)
├── contexts/          # React Context: AdminContext, SubscriberContext
├── integrations/
│   └── supabase/      # Supabase client + auto-generated DB types
├── data/              # Seed data and TypeScript type definitions
├── hooks/             # Custom React hooks
└── lib/utils.ts       # Shared utility functions
```

---

## Architecture & Key Patterns

### Service Layer
All database access goes through `src/services/*.ts`. Services:
- Abstract Supabase queries away from components
- Fall back to seed data (`src/data/`) if DB is unavailable
- Invoke edge functions via `supabase.functions.invoke()`

Do not query Supabase directly from pages or components — always use a service.

### Admin Authentication
- `AdminContext` (`src/contexts/AdminContext.tsx`) holds auth state
- Login calls the `admin-login` Supabase edge function
- Session token stored in `sessionStorage`
- Admin routes are protected via `AdminContext` state check

### Subscriber Authentication
- `SubscriberContext` tracks subscriber session (token for download access)
- Downloads are gated behind email subscription verification

### Data Types
- DB types are auto-generated in `src/integrations/supabase/types.ts` — do not edit manually
- Blog types live in `src/data/blogTypes.ts`
- Zod is used for runtime validation of forms and API responses

### SEO
- Every page uses the `PageMeta` component (`src/components/PageMeta.tsx`)
- Generates: title, meta description, Open Graph, Twitter card, JSON-LD structured data, canonical URL
- Always add `PageMeta` when creating a new page

### Content Protection
- `ContentProtection` and `ProtectedImage` components disable right-click on portfolio images
- Downloads restricted to verified subscribers only

---

## Database Schema (Supabase)

| Table | Purpose |
|---|---|
| `blog_posts` | Blog content (slug, title, content, category, tags) |
| `portfolio_projects` | Portfolio items (slug, title, gallery, workflow steps) |
| `subscribers` | Email subscribers (email, token, is_active) |
| `resources` | Downloadable resources with file IDs |
| `tutorials` | Learning tutorials with content |
| `download_logs` | Tracks which subscriber downloaded what |

All tables have Row Level Security (RLS) enabled.

## Supabase Edge Functions

| Function | Purpose |
|---|---|
| `admin-login` | Password auth → returns session token |
| `admin-analytics` | Subscriber & download stats |
| `subscribe` | Email capture + validation |
| `send-notification` | Email subscribers about new posts |
| `auto-generate-blog` | AI blog post generation (Gemini) |
| `auto-generate-portfolio` | AI portfolio item generation |
| `generate-blog-image` | AI blog featured image generation |

Scheduled cron jobs run daily blog generation (8 AM UTC) and weekly portfolio updates (Mondays, 10 AM UTC).

---

## Environment Variables

Required in `.env` (never commit this file):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

The `.env` file is gitignored. Get values from the Supabase dashboard.

---

## Routes

**Public:**
- `/` — Home
- `/portfolio` — Portfolio gallery
- `/portfolio/:slug` — Project detail
- `/blog` — Blog listing (filterable by category)
- `/blog/:slug` — Blog post
- `/tutorials` — Tutorial listing
- `/tutorials/:slug` — Tutorial detail
- `/resources` — Resource library
- `/workflow` — Workflow guide
- `/about` — About page
- `/contact` — Contact form

**Admin (password protected):**
- `/admin` — Login
- `/admin/dashboard` — Stats & overview
- `/admin/portfolio` — Manage projects
- `/admin/blog` — Manage posts
- `/admin/tutorials` — Manage tutorials
- `/admin/resources` — Manage resources
- `/admin/subscribers` — View subscriber list
- `/admin/emails` — Email logs
- `/admin/settings` — Settings

---

## Deployment

- **Frontend:** Vercel — `vercel.json` has a catch-all SPA rewrite rule for client-side routing
- **Backend:** Lovable Cloud / Supabase — no local backend needed
- **Build output:** `dist/` (standard Vite SPA)

To deploy frontend changes: `npm run build` then push to main (Vercel auto-deploys).

---

## Working with Lovable

This project was scaffolded by [Lovable](https://lovable.dev). The `lovable-tagger` package in `vite.config.ts` enables component tagging for Lovable's visual editor. Do not remove it.

When making changes:
- Lovable can regenerate components — avoid hand-editing files that Lovable manages if you plan to continue using the visual editor
- Database schema changes should be done via Lovable or Supabase migrations, not manual SQL

---

## Testing

```bash
npm run test          # Unit tests (Vitest + jsdom)
npx playwright test   # E2E tests (Playwright)
```

Tests live in `src/test/` (unit) and Playwright config at `playwright.config.ts`.

---

## Code Conventions

- **Path alias:** `@/` maps to `src/` — use it for all imports
- **Component naming:** PascalCase React components, camelCase files for hooks/services
- **Styling:** Tailwind utility classes + CSS variables for theming (defined in `index.css`)
- **Icons:** Lucide React only
- **Fonts:** Space Grotesk (headings) + Inter (body) — loaded via Tailwind config
- **No comments** unless the why is non-obvious
