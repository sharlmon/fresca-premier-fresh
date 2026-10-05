# SEO & AEO (search engines and AI answer engines)

AEO = "answer engine optimisation": making the site easy for ChatGPT, Perplexity, Google AI Overviews, Claude etc. to understand and quote.

## What is built into the site
**Pages that can rank**
- 21 indexable pages: Home, About, Quality, Sustainability, Team, Contact, FAQ, Privacy, Accessibility, Products + **11 product pages** (`/products/<name>/`) so searches like "French beans exporter Kenya" have a page to land on.
- Each page has a unique title (≤ 60 characters) and description (≤ 160), a canonical URL, one H1, a breadcrumb trail and Open Graph/Twitter share tags (product pages share their own photo).
- `robots` meta: `index, follow, max-image-preview:large` on the live site; the GitHub preview is `noindex`.

**Structured data (JSON-LD, one connected graph per page)**
`Organization` (name, legal name, address, contact, certifications, knowsAbout) · `WebSite` · `WebPage`/`AboutPage`/`ContactPage`/`CollectionPage` · `BreadcrumbList` · `Product` (+ `PropertyValue` facts) on product pages · `ItemList` on /products/ · `FAQPage` on /faq/ and on every product page.
Checked against schema.org's own term list: every property and type is real.

**Answer-engine content**
- `/faq/` and per-product FAQs: short, self-contained answers (about 40–60 words) that only state confirmed facts.
- "At a glance" fact block on the home page (a definition list: company, location, products, customers, certifications, packing, quality).
- `/llms.txt`: a plain-text summary of the company, products and FAQs for AI assistants.
- `robots.txt` explicitly welcomes search and AI crawlers (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended). To opt one out, change its `Allow: /` to `Disallow: /` in `server/routes/robots.txt.ts`.

**Technical**
- Static HTML (fast, fully crawlable), WebP images with width/height, self-hosted fonts, first hero image preloaded.
- `sitemap.xml` lists every page with `lastmod` and product images; old WordPress addresses 301-redirect to the new pages (`.htaccess`).
- Consistent trailing-slash URLs, favicon + apple-touch icon + web manifest, custom 404.

## How to re-check (any time, takes a minute)
```
cd 05_website/site && nvm use 22 && npm run generate
python3 ../../04_tools/seo-audit.py            # titles, descriptions, H1s, canonicals, links, images, sitemap, JSON-LD
../../04_tools/check-launch.sh https://frescapremierfresh.com   # after launch: live pages, redirects, form, headers
```
Rule of thumb: when you add a page, add it to `server/routes/sitemap.xml.ts`; when you add a product, add it to `app/data/products.ts` (its page, sitemap entry, llms.txt line and FAQ appear automatically).

## Launch-day steps that actually move rankings (needs your Google/Bing accounts)
1. **Google Search Console** → add `frescapremierfresh.com` as a *Domain* property (DNS TXT record) → submit `https://frescapremierfresh.com/sitemap.xml` → URL-inspect the home page and request indexing. Repeat for 2–3 product pages.
2. **Bing Webmaster Tools** → import from Search Console (Bing also feeds ChatGPT search and Copilot).
3. **Google Business Profile** → claim/verify "Fresca Premier Fresh Ltd", category "Fruit and vegetable exporter" (or similar), add the address, phone, website, photos and the same opening hours the office keeps. Keep name/address/phone **identical** to the site footer.
4. **Backlinks and citations (the biggest lever after launch)**: ask **Premier Veg Mondo** and **Mitrofresh** for a link to the site; list the company with Kenyan and trade bodies the client belongs to (for example the Fresh Produce Exporters Association of Kenya), B2B directories (Tridge, Kompass, Europages), and create a LinkedIn company page. Then add those profile URLs as `sameAs` in `app/utils/schema.ts`.
5. **Fix the preview/live difference**: build the live site WITHOUT `PREVIEW=1`. Check `curl https://frescapremierfresh.com/robots.txt` shows `Allow: /` and the home page has no `noindex`.
6. After 2–4 weeks: Search Console → *Performance* (queries, pages) and *Pages* (anything "Excluded").

## Honest expectations
Good technical SEO removes the obstacles; it does not buy rankings. New domains take weeks to months to rank, and competition for terms like "fresh vegetable exporter Kenya" is real. What moves rankings after launch is **fresh, specific content** (seasonal availability, packing specs, certificates, shipment/market news), **real photos and videos**, **reviews/citations/backlinks** and a **fast, working site**. Each of those is easy to add on top of this foundation.

## Needs input from the client to strengthen further
- GLOBALG.A.P. **GGN** and certificate details; what exactly KEPHIS / AFA credentials are (then the FAQ and Product schema can be made specific).
- Seasonal availability by product and market; typical pack sizes, grades, minimum order and lead time (all become answerable FAQs).
- Social profile URLs (LinkedIn, Instagram, Facebook) for `sameAs`.
- Founding year, number of farmers/markets with a source (adds trust and quotable facts).
