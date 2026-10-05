const fs = require('fs'), path = require('path'), QR = require('qrcode');
const OUT = '/Users/admin/Desktop/frescape/02_ecards/web/card';
const BASE = 'https://frescapremierfresh.com/card';
const ORG = 'Fresca Premier Fresh';
const SITE = 'https://frescapremierfresh.com';
const people = [
  { slug: 'lucas', first: 'Lucas', last: 'Omollo', title: 'Director', email: 'lucas@frescapremierfresh.com', phone: '+254726262679', phoneShow: '+254 726 262 679' },
  { slug: 'judy', first: 'Judy', last: 'Ogolla', title: 'Commercial & Operations Manager', email: 'judy@frescapremierfresh.com', phone: '+254731615135', phoneShow: '+254 731 615 135' },
];
const ic = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  globe: ic('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  phone: ic('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  chat: ic('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'),
  mail: ic('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  check: ic('<path d="M20 6 9 17l-5-5"/>'),
  shield: ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  truck: ic('<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  users: ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const vcard = p => ['BEGIN:VCARD', 'VERSION:3.0', `N:${p.last};${p.first};;;`, `FN:${p.first} ${p.last}`, `ORG:${ORG}`, `TITLE:${p.title}`,
  `TEL;TYPE=CELL,VOICE:${p.phone}`, `EMAIL;TYPE=WORK:${p.email}`, `URL:${SITE}`,
  'ADR;TYPE=WORK:;;P.O. Box 3468-00200;Nairobi;;00200;Kenya', 'END:VCARD', ''].join('\r\n');
const svg = async (text) => (await QR.toString(text, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#2f5a30', light: '#ffffff' } }));

const matrix = (text) => { const q = QR.create(text, { errorCorrectionLevel: 'L' }).modules; return { n: q.size, bits: Array.from(q.data).join('') }; };
const vcardQR = p => ['BEGIN:VCARD', 'VERSION:3.0', `N:${p.last};${p.first}`, `FN:${p.first} ${p.last}`, `ORG:${ORG}`, `TITLE:${p.title}`, `TEL:${p.phone}`, `EMAIL:${p.email}`, `URL:${SITE}`, 'END:VCARD'].join('\n');

(async () => {
  for (const p of people) {
    const dir = path.join(OUT, p.slug); fs.mkdirSync(dir, { recursive: true });
    const v = vcard(p);
    fs.writeFileSync(path.join(dir, `${p.first}-${p.last}.vcf`), v);
    const qrSave = await svg(vcardQR(p)), qrLink = await svg(`${BASE}/${p.slug}/`);
    const mSave = matrix(vcardQR(p)), mLink = matrix(`${BASE}/${p.slug}/`);
    const wa = p.phone.replace('+', '');
    const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${p.first} ${p.last} · ${ORG}</title>
<meta name="description" content="${esc(p.title)} at ${ORG}. Save contact, call, email or WhatsApp.">
<meta name="theme-color" content="#487a49">
<meta property="og:title" content="${p.first} ${p.last} · ${ORG}"><meta property="og:description" content="${esc(p.title)}"><meta property="og:image" content="${BASE}/assets/logo.png">
<link rel="icon" href="../assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
<script>try{if(sessionStorage.getItem("fresca_intro"))document.documentElement.classList.add("skip-intro")}catch(e){}</script>
<link rel="stylesheet" href="../assets/card.css?v=3">
<noscript><style>.intro{display:none}</style></noscript>
</head><body>
<div class="intro" id="intro" aria-hidden="true">
  <svg class="pod" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb27f"/><stop offset="1" stop-color="#2f5a30"/></linearGradient>
      <clipPath id="top"><rect x="0" y="0" width="200" height="50"/></clipPath>
      <clipPath id="bot"><rect x="0" y="50" width="200" height="50"/></clipPath>
    </defs>
    <g class="peas"><circle cx="45" cy="50" r="11"/><circle cx="75" cy="50" r="12"/><circle cx="105" cy="50" r="12"/><circle cx="135" cy="50" r="11"/><circle cx="160" cy="50" r="8"/></g>
    <g class="half h1" clip-path="url(#top)"><path d="M8 50Q100-14 192 50Q100 114 8 50Z" fill="url(#pg)" stroke="#2f5a30" stroke-width="3"/></g>
    <g class="half h2" clip-path="url(#bot)"><path d="M8 50Q100-14 192 50Q100 114 8 50Z" fill="url(#pg)" stroke="#2f5a30" stroke-width="3"/></g>
  </svg>
  <img class="intrologo" src="../assets/logo.png" alt="">
  <button class="skip" id="skip" type="button">Tap to skip</button>
</div>
<div class="leaf l1"></div><div class="leaf l2"></div><div class="leaf l3"></div>
<main class="wrap">
  <section class="stage" id="stage">
    <div class="float"><div class="tilt" id="tilt">
      <div class="flip" id="flip" tabindex="0" role="button" aria-label="Flip the card">
        <div class="face front">
          <div class="fl"><img src="../assets/logo.png" alt="${ORG}"></div>
          <div class="fr">
            <h1>${p.first} ${p.last}</h1>
            <p class="frole">${esc(p.title)}</p>
            <p class="forg">${ORG}</p>
            <span class="fbar"></span>
            <p class="fc">${p.phoneShow}<br>${p.email}</p>
          </div>
          <i class="shine"></i>
        </div>
        <div class="face back">
          <div class="qrbox">
            <div class="qrimg on" id="qr-save">${qrSave}<canvas class="qc" data-n="${mSave.n}" data-bits="${mSave.bits}"></canvas></div>
            <div class="qrimg" id="qr-link">${qrLink}<canvas class="qc" data-n="${mLink.n}" data-bits="${mLink.bits}"></canvas></div>
            <i class="scan"></i>
          </div>
          <div class="bt"><strong id="qtitle">Scan to save contact</strong><span id="hint">Point your phone camera at the code</span><em>frescapremierfresh.com</em></div>
          <i class="shine"></i>
        </div>
      </div>
    </div></div>
    <p class="tap">Tap the card to flip it</p>
    <div class="tabs" role="tablist">
      <button class="tab on" data-t="save" role="tab">Save contact</button>
      <button class="tab" data-t="link" role="tab">Share card</button>
    </div>
  </section>
<div class="sheet">
  <section class="actions">
    <a class="btn primary pulse" href="${p.first}-${p.last}.vcf" download>${I.plus}Save Contact</a>
    <a class="btn site" href="${SITE}" target="_blank" rel="noopener">${I.globe}Visit Our Website</a>
    <div class="row">
      <a class="btn" href="tel:${p.phone}">${I.phone}Call</a>
      <a class="btn" href="https://wa.me/${wa}" target="_blank" rel="noopener">${I.chat}WhatsApp</a>
      <a class="btn" href="mailto:${p.email}">${I.mail}Email</a>
    </div>
  </section>
  <section class="prods">
    <h2>Fresh from our farms</h2>
    <div class="strip">
      <a href="${SITE}/products/" target="_blank" rel="noopener"><img src="../assets/beans.png" alt="French beans" loading="lazy"><span>French Beans<small>Extra fine &amp; fine</small></span></a>
      <a href="${SITE}/products/" target="_blank" rel="noopener"><img src="../assets/snow.png" alt="Snow peas" loading="lazy"><span>Snow Peas<small>Mangetout</small></span></a>
      <a href="${SITE}/products/" target="_blank" rel="noopener"><img src="../assets/snap.png" alt="Sugar snap peas" loading="lazy"><span>Sugar Snap Peas</span></a>
      <a href="${SITE}/products/" target="_blank" rel="noopener"><img src="../assets/veg.png" alt="Other fresh vegetables" loading="lazy"><span>Other Fresh Vegetables</span></a>
    </div>
    <a class="more" href="${SITE}/products/" target="_blank" rel="noopener">View all products →</a>
  </section>
  <section class="why">
    <h2>Why Fresca</h2>
    <div class="grid">
      <div><b>${I.check}</b><strong>Premium Quality</strong><small>Graded to international standards</small></div>
      <div><b>${I.shield}</b><strong>Food Safety</strong><small>Full traceability, every step</small></div>
      <div><b>${I.truck}</b><strong>Reliable Supply</strong><small>Consistent volumes, on-time delivery</small></div>
      <div><b>${I.users}</b><strong>Partnership</strong><small>Long-term trust and integrity</small></div>
    </div>
  </section>
  <ul class="info">
    <li><span>Phone</span><a href="tel:${p.phone}">${p.phoneShow}</a></li>
    <li><span>Email</span><a href="mailto:${p.email}">${p.email}</a></li>
    <li><span>Website</span><a href="${SITE}" target="_blank" rel="noopener">frescapremierfresh.com</a></li>
    <li><span>Address</span><em>P.O. Box 3468-00200, Nairobi, Kenya</em></li>
  </ul>
  <footer>Quality · Reliability · Trust</footer>
</div>
</main>
<script src="../assets/card.js?v=3"></script>
</body></html>`;
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  console.log('built');
})();
