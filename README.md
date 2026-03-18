# ENV.ART — 3D Environment Artist Portfolio

Professional 3D environment art portfolio built with **React + Vite + TypeScript + Tailwind CSS**, powered by **Lovable Cloud** for backend (database, edge functions, file storage, auth).

---

## 🚀 Deployment

### Option 1: Lovable (Recommended — Zero Config)

1. Open [Lovable](https://lovable.dev) and go to your project
2. Click **Share → Publish**
3. Done! Backend (database, edge functions, storage) is already connected via Lovable Cloud

To add a custom domain: **Project → Settings → Domains → Connect Domain**

### Option 2: Vercel (Frontend Only)

> ⚠️ Vercel will only host the **frontend**. The backend (database, edge functions) stays on Lovable Cloud automatically.

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add these **Environment Variables** in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://xtjjiqabyaddmsyielne.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0amppcWFieWFkZG1zeWllbG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTk2NzIsImV4cCI6MjA4ODk5NTY3Mn0.IjMoj_VomORZULduYBY_j7LFb7pJMfN5Y_pBN8GFwK8
   VITE_SUPABASE_PROJECT_ID=xtjjiqabyaddmsyielne
   ```
5. Click **Deploy**

### Option 3: Netlify (Frontend Only)

Same as Vercel — use `npm run build` with `dist` output. Add the same environment variables.

### Option 4: Self-Host (VPS / Docker)

```bash
# Clone and build
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run build

# Serve the dist/ folder with nginx, caddy, or any static server
# Example with serve:
npx serve dist -s -l 3000
```

Add the environment variables to a `.env` file before building.

---

## 🗄️ Backend / Database

The backend runs on **Lovable Cloud** (powered by Supabase). It includes:

| Feature | Details |
|---------|---------|
| **Database** | PostgreSQL with tables: `blog_posts`, `portfolio_projects`, `subscribers`, `resources`, `tutorials`, `download_logs` |
| **Edge Functions** | `auto-generate-blog`, `auto-generate-portfolio`, `generate-blog-image`, `subscribe`, `admin-analytics`, `send-notification` |
| **File Storage** | For portfolio project files and resource downloads |
| **Scheduled Tasks** | Daily blog generation (8 AM UTC), weekly portfolio updates (Monday 10 AM UTC) via `pg_cron` |
| **Row Level Security** | All tables have RLS policies for data protection |

The database and edge functions are **automatically deployed** when you use Lovable. No separate database setup needed.

If deploying to Vercel/Netlify, the frontend connects to the same Lovable Cloud backend via the environment variables above.

---

## 📄 Per-Page SEO

Every page has unique meta tags via the `PageMeta` component:

```tsx
<PageMeta
  title="Portfolio"
  description="3D environment art portfolio..."
  path="/portfolio"
  type="website"
/>
```

This generates: `<title>`, `<meta description>`, Open Graph tags, Twitter cards, canonical URLs, JSON-LD structured data, and robots directives — all per page.

---

## 🛠️ Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:8080
```

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **3D**: React Three Fiber + Three.js
- **Animation**: Framer Motion
- **State**: TanStack React Query
- **SEO**: react-helmet-async
- **Backend**: Lovable Cloud (PostgreSQL, Edge Functions, Storage)
- **AI**: Gemini via Lovable AI Gateway (blog/portfolio auto-generation)
# beginnercgartist
