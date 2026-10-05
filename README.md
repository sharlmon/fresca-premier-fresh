# Fresca Premier Fresh – project folder

```
frescape/
├── 01_client-assets/        what the client gave us (never edited)
│   ├── company-profile/       original company profile PDF
│   ├── photos-whatsapp/       13 original photos from WhatsApp
│   └── logo/                  Fresca logo (hi-res + transparent)
│
├── 02_ecards/               digital business cards (Lucas + Judy)
│   ├── web/
│   │   ├── card/              the website folder -> upload to /frescapremierfresh on cPanel
│   │   └── card.zip           same folder zipped for upload (Extract on the server)
│   ├── print-cards/           printable card PDFs (front + QR back, 90x55mm + 3mm bleed)
│   └── demo-video/            26-second demo video for the client
│
├── 03_brochure/             A4 landscape brochure (297 x 210 mm), 6 pages
│   ├── final/
│   │   ├── bold/              APPROVED version: full PDF + pages/1.pdf ... 6.pdf (+ PNGs)
│   │   ├── classic/           softer colour version, same structure
│   │   └── Fresca-Brochure-A4-both-versions.zip   ready to send
│   └── source/                editable HTML (brochure-bold.html / brochure-classic.html),
│                              img/ (assets used) and photos/ (photos used)
│
├── 04_tools/                build scripts (see below)
├── 05_website/              new Nuxt website: site/ (source), legacy-wordpress/ (old-site crawl), LAUNCH.md (go-live plan)
└── _archive/                superseded files – safe to delete once you are sure
```

## Live links
- https://frescapremierfresh.com/card/lucas/
- https://frescapremierfresh.com/card/judy/
- cPanel document root for the site: `/frescapremierfresh` (NOT public_html – that is freiticglobal.com)

## Rebuilding things (from 04_tools)
Needs: Node, Google Chrome, and for the brochure `python3` with `pymupdf` (`pip install pymupdf`).
Run `npm install` once in 04_tools.

| Task | Command |
|---|---|
| Brochure (both colours, PDF + separate pages + zip) | `./build-brochure.sh` |
| Printable card PDFs | `./ecard-print-cards.sh` |
| Web e-cards (HTML, QR codes, .vcf) | `node ecard-build.js` then re-zip `02_ecards/web/card` |
| Check every e-card QR still decodes | `node ecard-qr-check.js` |
| SEO / AEO audit of the built website | `python3 seo-audit.py` (see `05_website/SEO.md`) |
| Health / launch check of the website | `./check-launch.sh https://frescapremierfresh.com` |
| Demo video | `node ecard-demo-video.js` (needs ffmpeg-static, see script) |

Edit content in `brochure-build.js` (text, photos, colours) or `ecard-build.js` (people, links), then rebuild.
After changing the e-card CSS/JS, bump the `?v=` number in `ecard-build.js` so browsers do not use a cached copy.

## Open questions for the client
- Is Baby Corn a product they sell? (added from the photos)
- Are "20+ markets / 500+ farmers / 100% quality" still correct? (taken from the website)
- Printer specs: bleed (3 mm?) and colour (CMYK?). Files are RGB with no bleed.
