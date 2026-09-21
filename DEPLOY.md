# Deploy

Hosted on **Cloudflare Pages**: https://whoami-dev.pages.dev

GitHub Pages was dropped on 2026-09-21. The repo is private, and Pages does not
serve private repos on a free plan — making the repo private silently unpublished
the site (`has_pages: false`), which is why it 404'd. `.github/workflows/deploy.yml`
was removed because it would fail on every push.

Deploy is a direct upload; the repo is not connected to Cloudflare and stays private:

```
wrangler pages deploy . --project-name=whoami-dev --branch=main --commit-dirty=true
```

Run from the repo root. All asset paths in `index.html` are relative, so the site
works from any host root with no base-path config.

Cloudflare account: mason.contact@gmail.com (same as toolbox / copperops-crm).
