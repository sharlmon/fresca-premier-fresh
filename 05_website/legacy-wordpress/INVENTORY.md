# Current website – inventory (frescapremierfresh.com)

Pulled from the public site on 2026-10-05 (read-only; nothing on the server was touched).

## Hosting & stack
- **Host:** Truehost, *WebHosting Starter* plan (Ksh 2,500/yr, account `freiticglobal.com`). `frescapremierfresh.com` is an add-on domain.
- **Document root:** `/home/xfluoqgh/frescapremierfresh` (not `public_html`, which belongs to freiticglobal.com).
- **CMS:** WordPress + Astra theme. Plugins seen: Spectra, Pagelayer, Formlayer, Astra Starter Sites.
- **Analytics:** none detected (no GA / GTM tag).
- **Contact form:** the Formlayer plugin loads but there is **no form on the Contact page** – only static contact details.

## Pages (8 in WordPress, 6 real)
| URL | Notes |
|---|---|
| `/` Home | Hero, "Why choose Fresca" (4 pillars), product teasers, commitment, 4-step process, stats (20+ markets / 500+ farmers / 100% quality) |
| `/about-us/` | Company overview, quality & food safety, vision, mission, products, "why choose" list |
| `/products/` | 10 items: haricot verts, mangetouts, sugar snaps, avocados, mangoes, passion fruit, carrots, rosemary, chillies, chives |
| `/packages/` | Cartons and punnets (haricot verts, mangetouts, baby corn, fine beans, sugar snaps, snow peas, chillies) |
| `/team-at-fresca-premier-fresh/` | Bios: Brenda Ogollah (Owner & Director), Andrea Ogada (Administrator), Fredrick Harrison Kabuu (Agronomist & Compliance Auditor), Allan Omondi (Compliance Officer), Jackson Muthee (Accountant) |
| `/team/` | Duplicate – Jackson Muthee only |
| `/contact-us/` | info@frescapremierfresh.com · +254 700 752 341 · Trystar Go Down, Airport North Road, P.O. Box 3468-00200 Nairobi |
| `/sample-page/`, `/2026/07/03/hello-world/` | WordPress placeholders – to delete |

**Menu:** Home · About Us · Our Products (`#ourproducts`) · Quality & Safety (`#quality`) · Sustainability (`#sustainability`) · Contact. Three items are anchors on the home page, not pages.

## Decisions confirmed by the developer (2026-10-05)
- **Legal company name: "Fresca Premier Fresh Ltd"** (not Premier Veg / Premier Veg Mondo). Use it in the footer, legal text and page titles; "Fresca Premier Fresh" for the brand.

## Domain facts (public RDAP lookup)
- Registered 2026-04-14, **expires 2027-04-14** (renew!). Registrar: OwnRegistrar, Inc. (Truehost's registrar). Nameservers: Cloudoon (Truehost) – DNS is managed in the Truehost client area / cPanel Zone Editor.
- Mail: MX points to the hosting server; SPF includes Truehost. IP 135.125.155.64.

## Content problems to fix in the redesign
- **Inconsistent company name:** pages say "Fresca Premier Fresh", the team bios say "Premier Veg", "Premier Veg Mondo" and "Premier Veg Mondo Ltd". **Resolved: Fresca Premier Fresh Ltd** – rewrite the bios.
- **Typos / weak copy:** "These have sup and fibre content", "flexible packing according according to…", "Premium quality fresh vegetables" repeated, etc.
- **Products mismatch:** About page lists 3 products; Products page lists 10; the brochure lists 3 + baby corn. One agreed catalogue is needed.
- **Duplicate pages and placeholders** (see above).
- **Team page lacks the people we made business cards for** (Lucas Omollo – Director, Judy Ogolla – Commercial & Operations Manager).
- **SEO:** page descriptions are auto-generated from page text; titles are generic ("Home - Fresca Premier Fresh").
- **No working contact form** and no analytics.

## Media (`media/`, git-ignored)
- 89 files, 79 MB. 51 are under 800 px wide (too small for full-width use on modern screens). 32 are ≥ 1200 px.
- Best assets: product 2048×2048 photos (beans, snow peas, sugar snaps), `Fresca_Page1_Full_Artwork`, `Hero-02`, `fresca_featured`, `sustainability`, the `Package-*` series, team portraits, plus the 13 real WhatsApp photos in `01_client-assets` (packhouse, crates, trucks).
- Several images are AI-generated; the real WhatsApp photos are more authentic and should lead where possible.

## What's in this folder
- `api/` – WordPress REST API dumps (pages, posts, media list, site info)
- `content/` – plain-text copy of every page (ready to reuse)
- `html/` – raw rendered HTML of each page (git-ignored)
- `media/` – every uploaded image at full size (git-ignored)
