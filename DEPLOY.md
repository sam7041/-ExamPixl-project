# How to Deploy ExamPixl for Free

## Option 1 — Vercel (Recommended ✅)

**Why:** Zero config, automatic HTTPS, global CDN, 100GB bandwidth/month free, auto-deploys on every git push.

### Steps

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/exampixl.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub → **Add New Project**

3. Import your `exampixl` repo

4. Vercel auto-detects Vite. Leave all settings as-is.

5. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini key

6. Click **Deploy** → Live in ~60 seconds

7. Your site is live at `https://exampixl.vercel.app`

### Custom domain (free)
- In Vercel dashboard → Settings → Domains → Add `exampixl.com`
- Point your domain's DNS to Vercel's nameservers
- HTTPS is automatic

---

## Option 2 — Netlify

**Why:** Similar to Vercel, 100GB bandwidth/month free, great for static sites.

1. Push to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add env variable: `GEMINI_API_KEY`
6. Click **Deploy site**

Live at `https://exampixl.netlify.app`

---

## Option 3 — Cloudflare Pages (Fastest CDN ⚡)

**Why:** Cloudflare has 300+ edge locations globally — your site loads fast even in Tier 2/3 Indian cities. Unlimited bandwidth on free tier.

1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → Create a project
3. Connect GitHub → Select your repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Build output: `dist`
7. Add env variable: `GEMINI_API_KEY`
8. Deploy

Live at `https://exampixl.pages.dev`

---

## Option 4 — GitHub Pages (No env vars)

Only works if you don't use the Gemini API key (AI Summarizer / Translate won't work).

Add to `vite.config.ts`:
```ts
base: '/exampixl/', // your repo name
```

Then run:
```bash
npm run build
npx gh-pages -d dist
```

Live at `https://YOUR_USERNAME.github.io/exampixl/`

---

## What to do after deploying

### 1. Submit to Google Search Console
- Go to [search.google.com/search-console](https://search.google.com/search-console)
- Add your domain → verify ownership (Vercel/Netlify make this one-click)
- Submit your sitemap: `https://your-domain.com/sitemap.xml`

### 2. Create a sitemap
Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://exampixl.com/</loc><priority>1.0</priority></url>
  <url><loc>https://exampixl.com/image/exam-photo</loc><priority>0.9</priority></url>
  <url><loc>https://exampixl.com/pdf/compress</loc><priority>0.8</priority></url>
  <url><loc>https://exampixl.com/pdf/merge</loc><priority>0.8</priority></url>
  <url><loc>https://exampixl.com/image/compress</loc><priority>0.8</priority></url>
</urlset>
```

### 3. Submit to free directories
- [alternativeto.net](https://alternativeto.net) — add ExamPixl as an alternative to iLovePDF
- [toolify.ai](https://toolify.ai) — AI tool directory
- [ProductHunt](https://producthunt.com) — launch for free, huge exposure

### 4. Free domain options
- **Freenom** — free `.tk`, `.ml`, `.ga` domains (unreliable, avoid)
- **js.org** — free `exampixl.js.org` for open source projects
- **is-a.dev** — free `exampixl.is-a.dev` subdomain for developers
- Best: buy `exampixl.in` from GoDaddy/Namecheap (~₹800/year) and point it to Vercel

---

## My recommendation for you

**Vercel + Cloudflare DNS combo:**
1. Deploy on Vercel (free)
2. Buy `exampixl.in` (₹800/year)
3. Add domain to Vercel
4. Use Cloudflare for DNS (free) — this adds Cloudflare's CDN on top of Vercel for extra speed in India

This gives you enterprise-level performance for under ₹1000/year.
