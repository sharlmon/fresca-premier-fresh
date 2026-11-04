// Wall stickers for the Fresca premises: 8 large posters, A1 portrait (594 x 841 mm) + 3 mm bleed = 600 x 847 mm.
// Output: 07_wall-stickers/source/*.html, 07_wall-stickers/final/*.pdf (one per sticker + all together).
// Run via wall-stickers.sh. Edit the text in STICKERS below and rebuild.
const fs = require('fs'), path = require('path'), QR = require('qrcode');
const ROOT = '/Users/admin/Desktop/frescape';
const OUT = `${ROOT}/07_wall-stickers/source`;
const IMG = `file://${ROOT}/03_brochure/source/img`;
const LOGO = `${IMG}/logo_t.png`;
fs.mkdirSync(OUT, { recursive: true });

const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  hands: ic('<path d="M12 3c-2 3-5 5-5 9a5 5 0 0 0 10 0c0-4-3-6-5-9z"/><path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5"/>'),
  hair: ic('<path d="M4 13a8 8 0 0 1 16 0z"/><path d="M3 13h18v2H3z"/><path d="M8 17v3M16 17v3"/>'),
  ring: ic('<circle cx="12" cy="15" r="6"/><path d="m9 6 3-3 3 3-3 3z"/><path d="M4 4l16 16"/>'),
  noeat: ic('<circle cx="12" cy="12" r="10"/><path d="M5 5l14 14"/><path d="M9 7v4a1.5 1.5 0 0 0 3 0V7M10.5 7v10M15 7c-1 1-1.5 3-1.5 5h1.5v5"/>'),
  plaster: ic('<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M10 10l4 4"/>'),
  sparkle: ic('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>'),
  search: ic('<circle cx="11" cy="11" r="7"/><path d="m21 21-5-5"/>'),
  layers: ic('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>'),
  box: ic('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  tag: ic('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>'),
  snow: ic('<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/>'),
  truck: ic('<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  shield: ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  users: ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  lift: ic('<circle cx="12" cy="4" r="2"/><path d="M12 6v7l-3 3v5M12 13l3 3v5M7 9l5-1 5 1"/>'),
  walk: ic('<circle cx="13" cy="4" r="2"/><path d="m9 21 3-6-3-3 2-5 4 3 3 1M12 15l3 2v4"/>'),
  alert: ic('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  exit: ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>'),
  stack: ic('<rect x="3" y="14" width="18" height="7"/><rect x="5" y="7" width="14" height="7"/><rect x="8" y="2" width="8" height="5"/>'),
  leaf: ic('<path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 16-10 16z"/><path d="M4 21c2-6 6-9 10-11"/>'),
  heart: ic('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'),
  pin: ic('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  mail: ic('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  phone: ic('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  globe: ic('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  eye: ic('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
};

const CSS = `
@page{size:600mm 847mm;margin:0}
:root{--g:#3f9b2f;--gd:#145a2c;--gm:#1d6b34;--gold:#ffb81c;--or:#f28c00;--mist:#fff7e0;--ink:#1d2a22}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:600mm}
body{font-family:Montserrat,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:600mm;height:847mm;position:relative;overflow:hidden;page-break-after:always;background:var(--mist)}
.pg:last-child{page-break-after:auto}
h1,h2,h3,.serif{font-family:'DM Serif Display',serif;font-weight:400}
svg{display:block}
.abs{position:absolute}
.top{position:absolute;left:0;right:0;top:0;height:86mm;background:linear-gradient(90deg,rgba(20,90,44,.93),rgba(20,90,44,.72));color:#fff;display:flex;align-items:center;padding:0 33mm}
.top .nm{font-weight:700;font-size:20mm;letter-spacing:.3em;text-transform:uppercase;line-height:1.25}
.top .nm small{display:block;font-weight:600;font-size:9mm;letter-spacing:.16em;color:var(--gold);margin-top:3mm}
.top .no{margin-left:auto;font:400 30mm 'DM Serif Display';color:var(--gold);line-height:1}
.top .no small{font:600 8mm Montserrat;color:#fff;letter-spacing:.1em}
.foot{position:absolute;left:0;right:0;bottom:0;height:50mm;background:linear-gradient(90deg,rgba(242,140,0,.95),rgba(255,184,28,.8));color:#fff;display:flex;align-items:center;padding:0 33mm}
.foot b{font:400 15mm 'DM Serif Display'}
.body{position:absolute;left:33mm;right:33mm;top:86mm;bottom:50mm}
.eyebrow{font-weight:700;font-size:10mm;letter-spacing:.3em;text-transform:uppercase;color:var(--or)}
.title{font-size:62mm;line-height:1;color:var(--gm)}
.wht{color:#fff;text-shadow:0 1mm 5mm rgba(0,0,0,.35)}
.lead{font-size:12.5mm;line-height:1.45;color:#33403a;font-weight:500}
.ico{width:34mm;height:34mm;border-radius:50%;background:var(--or);color:#fff;display:grid;place-items:center;flex:none}
.ico svg{width:60%;height:60%}
.glass{background:rgba(255,255,255,.88);border:1.5mm solid rgba(255,255,255,.7);border-radius:10mm}
.glassd{background:rgba(20,90,44,.82);border:1.5mm solid rgba(255,255,255,.25);border-radius:10mm;color:#fff}
.circ{position:absolute;border-radius:50%;background-size:cover;background-position:center;border:4mm solid #fff;box-shadow:0 0 0 2.5mm rgba(255,184,28,.95)}
.ph{position:absolute;background-size:cover;background-position:center}
.leaf{position:absolute;width:300mm;height:300mm;color:#fff;opacity:.13}
.leaf svg{width:100%;height:100%;stroke-width:.5}
`;

const bgLayer = (img, pos, ov) => `<div class="abs" style="inset:0;background:url(${img}) ${pos}/cover"></div><div class="abs" style="inset:0;background:${ov}"></div>`;
const leaves = `<div class="leaf" style="right:-90mm;top:120mm;transform:rotate(25deg)">${ICON.leaf}</div><div class="leaf" style="left:-110mm;bottom:20mm;transform:rotate(-155deg)">${ICON.leaf}</div>`;

const wrap = (n, name, inner, bg = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Premier wall sticker ${n} - ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
<section class="pg">${bg}${leaves}
<div class="top"><div class="nm">Premier<small>${name}</small></div><div class="no">${n}<small> / 07</small></div></div>
<div class="body">${inner}</div>
<div class="foot"><b>Fresh from Kenya to the World</b></div>
</section></body></html>`;

const rules = (items, big = false) => `<div style="display:grid;gap:${big ? 10 : 9}mm">${items.map(([i, h, p]) =>
  `<div class="glass" style="display:flex;align-items:center;gap:12mm;padding:${big ? 12 : 9}mm 12mm"><div class="ico" style="${big ? 'width:42mm;height:42mm' : ''}">${ICON[i]}</div><div><h3 style="font-size:${big ? 25 : 21}mm;line-height:1.05;color:var(--gm)">${h}</h3><p style="font-size:${big ? 12.5 : 11}mm;line-height:1.35;margin-top:2mm;font-weight:500;color:#44524a">${p}</p></div></div>`).join('')}</div>`;

const U = f => `${IMG}/${f}`;
const W = f => `file://${ROOT}/05_website/site/public/img/products/${f}`;

(async () => {
  const S = [];

  // 01 welcome
  S.push(['01', 'Welcome', 'welcome', `
  <div class="eyebrow abs" style="left:0;top:20mm;color:var(--gold);text-shadow:0 1mm 4mm rgba(0,0,0,.4)">Who we are</div>
  <h1 class="title wht abs" style="left:0;top:38mm;font-size:64mm">Premium produce,<br>grown with care.</h1>
  <div class="circ" style="left:0;top:222mm;width:150mm;height:150mm;background-image:url(${U('field.jpg')})"></div>
  <div class="circ" style="left:192mm;top:222mm;width:150mm;height:150mm;background-image:url(${U('farmer.jpg')});background-position:35% 50%"></div>
  <div class="circ" style="left:384mm;top:222mm;width:150mm;height:150mm;background-image:url(${U('beans2.jpg')})"></div>
  <div class="glass abs" style="left:0;right:0;top:395mm;padding:9mm 12mm"><p class="lead" style="font-size:11.5mm">We are a Kenyan fresh produce export company. We supply premium-quality vegetables to international markets, packed to the highest standards for quality, food safety and traceability.</p></div>
  <div class="abs" style="left:0;right:0;top:505mm;display:grid;grid-template-columns:1fr 1fr;gap:12mm">
    <div class="glass" style="padding:9mm 12mm;border-left:5mm solid var(--gold)"><div style="display:flex;align-items:center;gap:6mm"><div class="ico" style="width:22mm;height:22mm">${ICON.eye}</div><h3 style="font-size:24mm;color:var(--gm)">Our Vision</h3></div><p style="font-size:9.5mm;line-height:1.4;margin-top:4mm;font-weight:500">To be a trusted supplier of premium Kenyan fresh vegetables to the world, through quality, consistency and exceptional service.</p></div>
    <div class="glass" style="padding:9mm 12mm;border-left:5mm solid var(--gold)"><div style="display:flex;align-items:center;gap:6mm"><div class="ico" style="width:22mm;height:22mm">${ICON.heart}</div><h3 style="font-size:24mm;color:var(--gm)">Our Mission</h3></div><p style="font-size:9.5mm;line-height:1.4;margin-top:4mm;font-weight:500">To provide fresh, safe, high-quality vegetables while building long-term partnerships on trust, integrity and reliability.</p></div>
  </div>
  <div class="glassd abs" style="left:0;right:0;bottom:14mm;height:54mm;display:grid;grid-template-columns:repeat(3,1fr);align-items:center;text-align:center">
    ${[['20+', 'International markets'], ['500+', 'Trusted farmers'], ['100%', 'Quality & food safety']].map(([a, b]) => `<div><div class="serif" style="font-size:28mm;line-height:1;color:var(--gold)">${a}</div><div style="font-size:8.5mm;font-weight:600;margin-top:2mm">${b}</div></div>`).join('')}
  </div>`,
    bgLayer(U('packhouseB.jpg'), '50% 25%', 'linear-gradient(180deg,rgba(20,90,44,.35) 0%,rgba(20,90,44,.45) 28%,rgba(255,247,224,.9) 52%,rgba(255,247,224,.96) 100%)')]);

  // 02 process
  const step = (k, h, p, img, pos) => `<div class="glass" style="position:relative;height:100mm;padding:0 12mm;display:flex;align-items:center;gap:12mm;margin-bottom:10mm">
    <div class="serif" style="width:40mm;height:40mm;border-radius:50%;background:${k % 2 ? 'var(--g)' : 'var(--or)'};color:#fff;font-size:26mm;display:grid;place-items:center;flex:none">${k}</div>
    <div style="flex:1"><h3 style="font-size:26mm;line-height:1;color:var(--gm)">${h}</h3><p style="font-size:10.5mm;line-height:1.35;margin-top:3mm;font-weight:500;color:#33403a">${p}</p></div>
    <div style="width:76mm;height:76mm;border-radius:50%;flex:none;background:url(${img}) ${pos || 'center'}/cover;border:3mm solid #fff;box-shadow:0 0 0 2mm var(--gold);margin-right:-8mm"></div></div>`;
  S.push(['02', 'Our Process', 'process', `
  <div class="eyebrow abs" style="left:0;top:14mm;color:var(--gold)">Our process</div>
  <h1 class="title wht abs" style="left:0;top:30mm;font-size:62mm">From Farm<br>to Export</h1>
  <div class="abs" style="left:0;right:0;top:182mm">
    ${step(1, 'Sourcing', 'Trusted farmers, finest produce, peak freshness.', U('farmer.jpg'), '35% 50%')}
    ${step(2, 'Grading', 'Every harvest inspected and graded to international standards.', U('packhouseA.jpg'), '50% 60%')}
    ${step(3, 'Packing', 'Packed with care in food-safe materials.', `file://${ROOT}/07_wall-stickers/source/photos/hero-workers.jpg`, '38% 66%')}
    ${step(4, 'Delivery', 'On time, in perfect condition, to markets worldwide.', U('loading.png'), '50% 50%')}
  </div>
  <div class="abs" style="left:0;right:0;bottom:12mm;text-align:center"><span style="display:inline-block;background:var(--or);color:#fff;border-radius:8mm;padding:5mm 12mm;font-weight:800;font-size:10mm;letter-spacing:.06em">FULL TRACEABILITY FROM FARM TO FINAL DELIVERY</span></div>`,
    bgLayer(U('field.jpg'), '50% 60%', 'linear-gradient(180deg,rgba(20,90,44,.78),rgba(20,90,44,.9))')]);

  // 03 products
  const prods = [['French Beans', 'Extra fine & fine', 'tray-beans.jpg'], ['Snow Peas', 'Mangetout', 'tray-snow.jpg'], ['Sugar Snap Peas', 'Crisp & sweet', 'tray-snap.jpg'], ['Baby Corn', 'Fresh, tray-packed', 'corn.jpg']];
  const range = [['Avocados', 'avocado.webp'], ['Mangoes', 'mango.webp'], ['Passion Fruit', 'passion-fruit.webp'], ['Carrots', 'carrots.webp'], ['Chillies', 'chillies.webp'], ['Rosemary', 'rosemary.webp'], ['Chives', 'chives.webp']];
  S.push(['03', 'Our Products', 'products', `
  <div class="eyebrow abs" style="left:0;top:14mm">What we grow</div>
  <h1 class="title abs" style="left:0;top:30mm;font-size:62mm">Our Products</h1>
  <div class="abs" style="left:0;right:0;top:105mm;display:grid;grid-template-columns:1fr 1fr;gap:12mm">
    ${prods.map(([n, t, f]) => `<div style="height:150mm;border-radius:10mm;overflow:hidden;position:relative;background:url(${U(f)}) center/cover;border:3mm solid #fff"><div style="position:absolute;left:0;right:0;bottom:0;padding:18mm 9mm 7mm;background:linear-gradient(0deg,rgba(20,90,44,.92),rgba(20,90,44,.55) 70%,rgba(20,90,44,0))"><h3 style="font-size:20mm;line-height:1;color:#fff">${n}</h3><div style="font-size:9.5mm;font-weight:700;color:var(--gold);margin-top:2mm">${t}</div></div></div>`).join('')}
  </div>
  <div class="abs" style="left:0;top:432mm;font:400 22mm 'DM Serif Display';color:var(--gm)">Also from our range</div>
  <div class="abs" style="left:0;right:0;top:468mm;display:flex;justify-content:space-between">
    ${range.map(([n, f]) => `<div style="width:66mm;text-align:center"><div style="width:66mm;height:66mm;border-radius:50%;background:url(${W(f)}) center/cover;border:3mm solid #fff;box-shadow:0 0 0 1.5mm var(--gold)"></div><div style="font-weight:700;font-size:7.2mm;margin-top:4mm;color:var(--gm);line-height:1.15">${n}</div></div>`).join('')}
  </div>
  <div class="glassd abs" style="left:0;right:0;bottom:14mm;padding:9mm 12mm"><p style="font-size:10.5mm;line-height:1.4;font-weight:500">Selected, graded and packed for importers, retailers and food service across Europe and beyond, <b style="color:var(--gold)">to your specification</b>, with strict quality control and full traceability. Volumes vary through the year: ask what is in season.</p></div>`,
    bgLayer(U('veg.png'), '50% 50%', 'linear-gradient(180deg,rgba(255,247,224,.93),rgba(255,247,224,.82))')]);

  // 04 hygiene
  S.push(['04', 'Food Safety', 'hygiene', `
  <div class="eyebrow abs" style="left:0;top:14mm;color:var(--gold);text-shadow:0 1mm 4mm rgba(0,0,0,.4)">Every worker, every day</div>
  <h1 class="title wht abs" style="left:0;top:30mm;font-size:62mm">Clean hands.<br>Safe food.</h1>
  <div class="circ" style="right:0;top:6mm;width:140mm;height:140mm;background-image:url(file://${ROOT}/03_brochure/source/photos/w06.jpg);background-position:50% 60%"></div>
  <div class="abs" style="left:0;right:0;top:182mm">${rules([
    ['hands', 'Wash your hands', 'Before you start, after every break, and after using the toilet.'],
    ['hair', 'Hair net and clean coat', 'Hair fully covered. Clean coat on and buttoned. Closed shoes.'],
    ['ring', 'No jewellery, watches or phones', 'Leave them in your locker. Nothing loose near the produce.'],
    ['noeat', 'No eating, drinking or smoking', 'Only in the rest area, never at the packing tables.'],
    ['plaster', 'Cut or unwell? Tell your supervisor', 'Cover cuts with a blue plaster. Report any illness before you start work.'],
    ['sparkle', 'Keep your table clean', 'Clear waste, wipe down, and keep crates off the floor.'],
  ], true)}</div>`,
    bgLayer(U('packhouseA.jpg'), '50% 35%', 'linear-gradient(180deg,rgba(20,90,44,.5) 0%,rgba(20,90,44,.45) 22%,rgba(255,247,224,.88) 40%,rgba(255,247,224,.93) 100%)')]);

  // 05 quality
  S.push(['05', 'Quality & Packing', 'quality', `
  <div class="eyebrow abs" style="left:0;top:14mm;color:var(--gold)">Our standard</div>
  <h1 class="title wht abs" style="left:0;top:30mm;width:330mm;font-size:62mm">Grade it.<br>Pack it.<br>Trace it.</h1>
  <div class="circ" style="right:0;top:18mm;width:190mm;height:190mm;background-image:url(${U('beans2.jpg')});background-position:50% 55%"></div>
  <div class="circ" style="right:128mm;top:200mm;width:90mm;height:90mm;background-image:url(${U('snowpacks.jpg')})"></div>
  <p class="abs" style="left:0;top:222mm;width:300mm;font:500 11mm/1.4 Montserrat;color:#fff;text-shadow:0 1mm 4mm rgba(0,0,0,.4)">Every pack carries our promise. Quality is everybody's job.</p>
  <div class="abs" style="left:0;right:0;top:310mm">${rules([
    ['search', 'Check every pod', 'Fresh, firm, bright green. Remove anything damaged, soft, or off-colour.'],
    ['layers', 'Sort by grade', 'Beans: extra fine and fine. Keep each grade separate.'],
    ['box', 'Pack to specification', 'Right weight, right pack, right count: 12 × 250 g where the order says so.'],
    ['tag', 'Label and record', 'Correct label on every carton. Traceability starts with you.'],
    ['sun', 'Keep it cool', 'Never leave produce in the sun. Move packed boxes to the cold room quickly.'],
  ])}</div>
  <p class="abs" style="left:0;right:0;bottom:6mm;text-align:center;font:400 17mm 'DM Serif Display';color:var(--gm)">Not sure? Ask your supervisor before you pack.</p>`,
    bgLayer(`file://${ROOT}/07_wall-stickers/source/photos/hero-workers.jpg`, '50% 55%', 'linear-gradient(180deg,rgba(20,90,44,.62) 0%,rgba(20,90,44,.5) 30%,rgba(255,247,224,.9) 48%,rgba(255,247,224,.94) 100%)')]);

  // 06 safety
  S.push(['06', 'Workplace Safety', 'safety', `
  <div class="eyebrow abs" style="left:0;top:14mm;color:var(--gold);text-shadow:0 1mm 4mm rgba(0,0,0,.4)">Look after yourself and each other</div>
  <h1 class="title wht abs" style="left:0;top:30mm;font-size:62mm">Safety first,<br>always.</h1>
  <div class="circ" style="right:0;top:44mm;width:112mm;height:112mm;background-image:url(${U('loading.png')});background-position:72% 50%"></div>
  <div class="abs" style="left:0;right:0;top:182mm">${rules([
    ['lift', 'Lift with your legs', 'Bend your knees, keep your back straight. Ask for help with heavy crates.'],
    ['stack', 'Stack crates safely', 'Stack straight and stable, never higher than the marked line.'],
    ['walk', 'Keep walkways clear', 'No crates, boxes or bags in the aisles. Walk, never run.'],
    ['alert', 'Wet floor? Clean it up', 'Wipe up spills at once and tell your supervisor.'],
    ['exit', 'Know your exits', 'Find the nearest fire exit and assembly point. Never block a door.'],
    ['users', 'Report every accident', 'Tell your supervisor about injuries and near misses straight away.'],
  ], true)}</div>`,
    bgLayer(U('packhouse.jpg'), '45% 50%', 'linear-gradient(180deg,rgba(20,90,44,.55) 0%,rgba(20,90,44,.45) 22%,rgba(255,247,224,.88) 40%,rgba(255,247,224,.93) 100%)')]);

  // 07 promise
  const pill = (i, h, p, img, pos = 'center') => `<div class="glass" style="overflow:hidden"><div style="height:62mm;background:url(${img}) ${pos}/cover;position:relative"><div class="ico" style="position:absolute;left:10mm;bottom:-14mm;width:28mm;height:28mm;border:2.5mm solid #fff">${ICON[i]}</div></div><div style="padding:18mm 12mm 10mm"><h3 style="font-size:21mm;line-height:1;color:var(--gm)">${h}</h3><p style="font-size:9.5mm;line-height:1.4;margin-top:3mm;font-weight:500;color:#44524a">${p}</p></div></div>`;
  S.push(['07', 'Our Promise', 'promise', `
  <div class="eyebrow abs" style="left:0;top:14mm;color:var(--gold)">Why choose us</div>
  <h1 class="title wht abs" style="left:0;top:30mm;font-size:70mm">Quality.<br>Reliability.<br>Trust.</h1>
  <div class="abs" style="left:0;right:0;top:262mm;display:grid;grid-template-columns:1fr 1fr;gap:12mm">
    ${pill('shield', 'Premium Quality', 'Carefully selected and graded to the highest international standards.', U('snowpacks.jpg'))}
    ${pill('leaf', 'Food Safety', 'Strict quality control and full traceability at every step.', U('packhouseA.jpg'))}
    ${pill('truck', 'Reliable Supply', 'Consistent volumes, flexible solutions and on-time delivery.', U('loading.png'), '75% 45%')}
    ${pill('users', 'Partnership', 'Long-term relationships built on trust, integrity and service.', U('farmer.jpg'))}
  </div>
  <div class="abs" style="left:0;right:0;bottom:14mm;height:92mm;border-radius:10mm;overflow:hidden;background:linear-gradient(90deg,rgba(20,90,44,.93) 55%,rgba(20,90,44,.3)),url(${U('sustain.png')}) 50% 30%/cover;border:1.5mm solid rgba(255,255,255,.3);padding:11mm 14mm"><h3 style="font-size:23mm;color:var(--gold);line-height:1;width:380mm">Sustainable today,<br>better tomorrow</h3><p style="font-size:9.5mm;line-height:1.4;margin-top:4mm;color:#e4f1dc;width:330mm">We work with local farmers and communities to promote sustainable agriculture and protect the environment.</p></div>`,
    bgLayer(U('packhouseA.jpg'), '50% 30%', 'linear-gradient(180deg,rgba(20,90,44,.6),rgba(20,90,44,.88))')]);

  for (const [n, name, slug, inner, bg] of S) fs.writeFileSync(`${OUT}/${n}-${slug}.html`, wrap(n, name, inner, bg));
  const body = S.map(([n, name, slug, inner, bg]) => wrap(n, name, inner, bg).match(/<section[\s\S]*<\/section>/)[0]).join('\n');
  const head = wrap('00', 'x', '', '').split('<body>')[0];
  fs.writeFileSync(`${OUT}/00-all.html`, `${head}<body>${body}</body></html>`);
  console.log('wrote', S.length, 'stickers + 00-all.html');
})();
