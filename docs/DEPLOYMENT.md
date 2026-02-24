# LMS — Free Production Deployment Guide

This guide covers deploying the LMS to a **FREE** live URL suitable for sharing with clients (including in Australia).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Netlify Deployment](#netlify-deployment)
4. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
5. [Custom Domain (Australia)](#custom-domain-australia)
6. [CLI Deployment](#cli-deployment)
7. [Live URL Structure](#live-url-structure)
8. [Troubleshooting](#troubleshooting)
9. [Production Checklists](#production-checklists)

---

## Prerequisites

- Node.js 18+ and npm
- GitHub account
- (Optional) Custom domain for `.com.au` or similar

---

## Vercel Deployment (Recommended)

Vercel offers free hosting with automatic HTTPS, global CDN, and zero config for Vite projects.

### Step-by-Step

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click **Add New Project**
   - Import your repository

3. **Configure Project**
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)

4. **Deploy**
   - Click **Deploy**
   - Wait for the build to complete

5. **Get Live URL**
   - Your app will be at: `https://your-project-name.vercel.app`
   - Share this URL with clients

### Automatic Deployments

Every push to `main` triggers a new deployment. Preview deployments are created for pull requests.

---

## Netlify Deployment

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in with GitHub
   - Click **Add new site** → **Import an existing project**
   - Select your repository

3. **Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Netlify reads `netlify.toml` for SPA redirects

4. **Deploy**
   - Click **Deploy site**
   - Live URL: `https://random-name.netlify.app`

---

## Cloudflare Pages Deployment

1. **Push to GitHub**

2. **Connect to Cloudflare Pages**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
   - Connect to Git → Select repository

3. **Build Settings**
   - **Framework preset:** None (or Vite if available)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

4. **SPA Routing**
   - The `public/_redirects` file is copied to `dist/` during build
   - Cloudflare Pages uses it for SPA fallback: `/* /index.html 200`

5. **Deploy**
   - Live URL: `https://your-project.pages.dev`

---

## Custom Domain (Australia)

### Connecting a Custom Domain

**Vercel:**
1. Project → Settings → Domains
2. Add domain (e.g. `lms.yourcompany.com.au`)
3. Follow DNS instructions (A record or CNAME)
4. SSL is automatic (Let's Encrypt)

**Netlify:**
1. Site → Domain management → Add custom domain
2. Configure DNS as instructed
3. Free SSL via Let's Encrypt

**Cloudflare Pages:**
1. Pages project → Custom domains → Set up custom domain
2. If domain is on Cloudflare, SSL is automatic

### .com.au Domain Setup

1. Purchase a `.com.au` domain from a registrar (e.g. auDA-accredited)
2. Add the domain to your hosting provider (Vercel/Netlify/Cloudflare)
3. Add DNS records:
   - **A record:** Point to provider's IP (Vercel: `76.76.21.21`)
   - **CNAME:** `www` → `cname.vercel-dns.com` (or provider equivalent)
4. Wait for propagation (up to 48 hours, often faster)
5. SSL certificate is issued automatically

---

## CLI Deployment

### Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login (first time)
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

After `vercel --prod`, you receive a production URL.

### Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Cloudflare Pages (Wrangler)

```bash
npm install -g wrangler
wrangler pages project create lms
npm run build
wrangler pages deploy dist --project-name=lms
```

---

## Live URL Structure

After deployment, your app will have:

| Environment | Example URL |
|-------------|-------------|
| Vercel | `https://lms-frontend.vercel.app` |
| Netlify | `https://lms-demo.netlify.app` |
| Cloudflare | `https://lms.pages.dev` |
| Custom | `https://lms.yourcompany.com.au` |

**Key routes for clients:**
- `/` — Dashboard
- `/login` — Sign in (demo: any email / any password)
- `/courses` — Course catalog
- `/ai-insights` — AI learning path
- `/community` — Community hub

---

## Troubleshooting

### 404 on Refresh / Direct URL

**Cause:** SPA routing — server doesn't know about client routes.

**Fix:** Ensure SPA redirect is configured:
- **Vercel:** `vercel.json` rewrites `/(.*)` → `/index.html`
- **Netlify:** `netlify.toml` or `_redirects` with `/* /index.html 200`
- **Cloudflare:** `_redirects` in `public/` (copied to `dist/`)

### Blank Page After Deploy

**Cause:** Base path or asset path mismatch.

**Fix:** In `vite.config.js`, ensure `base: "/"`. For subpath (e.g. `/app/`), set `base: "/app/"`.

### Build Fails

**Cause:** Node version, missing deps, or env vars.

**Fix:**
- Set Node 18+ in build settings (Vercel/Netlify: `NODE_VERSION=18`)
- Run `npm ci` for reproducible installs
- Check `.env.example` for required variables

### Assets 404

**Cause:** Assets not in `dist/` or wrong path.

**Fix:** Run `npm run build` locally and verify `dist/assets/` contains JS/CSS. Ensure `base: "/"` in Vite config.

### CORS Errors (Future API)

When connecting to a backend API, configure CORS on the server to allow your deployment origin (e.g. `https://lms.vercel.app`).

---

## Production Checklists

### SEO Checklist

- [x] Meta description in `index.html`
- [x] Open Graph tags
- [x] Title tag
- [ ] Add `robots.txt` if needed
- [ ] Add sitemap for static routes (optional)

### Performance Checklist

- [x] Code splitting (lazy routes)
- [x] Vendor chunk separation
- [x] Source maps disabled in production
- [x] Asset caching headers (Vercel/Netlify config)
- [ ] Run Lighthouse and fix issues
- [ ] Consider image optimization for future assets

### Security Checklist

- [ ] Use HTTPS only (automatic on Vercel/Netlify/Cloudflare)
- [ ] No secrets in client code
- [ ] API keys in env vars (when backend is added)
- [ ] Content Security Policy headers (optional)

### Lighthouse Optimization

1. Run Lighthouse in Chrome DevTools (Production build)
2. Target: Performance 90+, Accessibility 90+, Best Practices 90+
3. Common fixes:
   - Lazy load below-fold images
   - Minimize main-thread work
   - Reduce unused JavaScript (tree-shaking is automatic with Vite)

---

## Demo Mode

When `DEMO_MODE` is enabled:

- **Demo credentials:** Any email / any password
- **Reset Demo Data:** Click "Reset Demo Data" in the amber demo banner to restore all sample data
- **Badge:** "Demo Mode" badge appears in the header when logged in

---

*End of Deployment Guide*
