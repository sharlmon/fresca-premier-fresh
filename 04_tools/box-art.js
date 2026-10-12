// Fresca carton artwork: flat print panels for the export boxes, rendered to PNG (10 px per mm).
//   node box-art.js            -> 06_packaging/art/<concept>/<panel>.png + art/<concept>-sheet.png
// Concepts:  kanga (chosen)  ·  kraft  ·  field   (only kanga has every panel; the others are lid studies)
// Inks: forest #1e4a2e + marigold #e8a317 on white board (kraft: forest on brown board). Logo is the client's full-colour mark.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '06_packaging/art');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, '01_client-assets/logo/fresca-logo-transparent.png')).toString('base64');
const LOGO_AR = 936 / 730;
const C = { forest: '#1e4a2e', gold: '#e8a317', board: '#fbfaf5', kraft: '#c49a6c' };
const FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@500;600;700&display=block';

// ---------- products (facts from 05_website/site/app/data/products.ts) ----------
const P = {
  mangetout: { name: 'MANGETOUT', aka: 'Snow peas · Pois gourmands · Peultjes · Zuckerschoten' },
  beans: { name: 'FRENCH BEANS', aka: 'Haricots verts · Sperziebonen · Feine Bohnen · Judías verdes' },
};

// ---------- drawing primitives (all hand-built, no clip-art) ----------
const f = (n) => +n.toFixed(1);
// a pea pod lying along +x, centred on 0,0. open = peas visible.
function pod(L, W, { fill, pea, open = true, n = 5, stem = true }) {
  const h = L / 2;
  let s = `<path d="M${f(-h)} 0 C${f(-h * .55)} ${f(-W * 1.05)} ${f(h * .5)} ${f(-W * 1.1)} ${f(h)} ${f(-W * .08)} C${f(h * .45)} ${f(W * .95)} ${f(-h * .5)} ${f(W * .9)} ${f(-h)} 0Z" fill="${fill}"/>`;
  // short stalk at the stem end
  if (stem) s += `<path d="M${f(-h + W * .05)} ${f(-W * .05)} Q${f(-h - L * .05)} ${f(-W * .12)} ${f(-h - L * .09)} ${f(-W * .42)}" fill="none" stroke="${fill}" stroke-width="${f(W * .16)}" stroke-linecap="round"/>`;
  if (open) {
    const r = W * .36, step = (L * .72) / (n - 1);
    for (let i = 0; i < n; i++) {
      const x = -L * .36 + i * step, rr = r * (i === 0 || i === n - 1 ? .78 : 1);
      s += `<circle cx="${f(x)}" cy="${f(-W * .02)}" r="${f(rr)}" fill="${pea}"/>`;
    }
  }
  return s;
}
const diamond = (x, y, r, fill) => `<path d="M${f(x)} ${f(y - r)}L${f(x + r)} ${f(y)}L${f(x)} ${f(y + r)}L${f(x - r)} ${f(y)}Z" fill="${fill}"/>`;

// kanga border strip: horizontal band, length len, height h. Pods alternate tilt; diamonds between.
function pindo(len, h, { bg, ink, pea }) {
  const u = h * 2.1, n = Math.max(1, Math.round(len / u)), uu = len / n;
  let s = `<rect width="${f(len)}" height="${f(h)}" fill="${bg}"/>`;
  for (let i = 0; i < n; i++) {
    const cx = uu * i + uu * .5, tilt = i % 2 ? -9 : 9;
    s += `<g transform="translate(${f(cx)} ${f(h / 2)}) rotate(${tilt})">${pod(uu * .62, h * .3, { fill: ink, pea, n: 4 })}</g>`;
    if (i < n - 1) s += diamond(uu * (i + 1), h / 2, h * .13, ink);
  }
  // fine rules either side
  s += `<rect y="${f(h * .08)}" width="${f(len)}" height="${f(h * .03)}" fill="${ink}"/><rect y="${f(h * .89)}" width="${f(len)}" height="${f(h * .03)}" fill="${ink}"/>`;
  return s;
}
// teeth along a line (kanga sawtooth), pointing +y
function teeth(len, t, fill) {
  const n = Math.round(len / (t * 1.4)), w = len / n;
  let d = '';
  for (let i = 0; i < n; i++) d += `M${f(i * w)} 0L${f(i * w + w / 2)} ${f(t)}L${f((i + 1) * w)} 0Z`;
  return `<path d="${d}" fill="${fill}"/>`;
}
// sunburst of pods around a centre, with a white disc + logo
function medallion(cx, cy, R, { ink, gold, board, logo = true, pods = 18 }) {
  let s = `<g transform="translate(${f(cx)} ${f(cy)})">`;
  for (let i = 0; i < pods; i++) {
    const a = (360 / pods) * i;
    s += `<g transform="rotate(${f(a)}) translate(${f(R * .74)} 0)">${pod(R * .46, R * .1, { fill: ink, pea: board, n: 4, stem: false })}</g>`;
    s += `<g transform="rotate(${f(a + 180 / pods)})">${diamond(R * .93, 0, R * .035, gold)}</g>`;
  }
  s += `<circle r="${f(R * .5)}" fill="${gold}"/><circle r="${f(R * .465)}" fill="${board}"/>`;
  s += `<circle r="${f(R * .44)}" fill="none" stroke="${ink}" stroke-width="${f(R * .006)}" stroke-dasharray="${f(R * .02)} ${f(R * .02)}"/>`;
  if (logo) { const w = R * .78; s += `<image href="${LOGO}" x="${f(-w / 2)}" y="${f(-w / LOGO_AR / 2)}" width="${f(w)}" height="${f(w / LOGO_AR)}"/>`; }
  return s + '</g>';
}
// diamond lattice of small dots (kanga field texture), knocked out by circles/rects in `holes`
function dots(W, H, step, r, fill, id) {
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><circle cx="${step / 2}" cy="${step / 2}" r="${r}" fill="${fill}"/><circle cx="0" cy="0" r="${r * .6}" fill="${fill}"/><circle cx="${step}" cy="0" r="${r * .6}" fill="${fill}"/><circle cx="0" cy="${step}" r="${r * .6}" fill="${fill}"/><circle cx="${step}" cy="${step}" r="${r * .6}" fill="${fill}"/></pattern>`;
}
const T = (x, y, txt, { size, weight = 700, fill, anchor = 'middle', family = 'Barlow Condensed', ls = 0, extra = '' }) =>
  `<text x="${f(x)}" y="${f(y)}" font-family="${family}" font-weight="${weight}" font-size="${f(size)}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${f(ls)}" ${extra}>${txt}</text>`;

// framed kanga border around a W×H panel. b = border width
function kangaFrame(W, H, b) {
  const o = { bg: C.forest, ink: C.gold, pea: C.forest };
  let s = '';
  s += `<g transform="translate(${b} 0)">${pindo(W - 2 * b, b, o)}</g>`;
  s += `<g transform="translate(${b} ${H - b})">${pindo(W - 2 * b, b, o)}</g>`;
  s += `<g transform="translate(${b} ${b}) rotate(90)">${pindo(H - 2 * b, b, o)}</g>`;
  s += `<g transform="translate(${W} ${b}) rotate(90)">${pindo(H - 2 * b, b, o)}</g>`;
  // corner blocks: four-pod flower
  for (const [x, y] of [[0, 0], [W - b, 0], [0, H - b], [W - b, H - b]]) {
    s += `<rect x="${x}" y="${y}" width="${b}" height="${b}" fill="${C.forest}"/>`;
    s += `<g transform="translate(${x + b / 2} ${y + b / 2})">`;
    for (let i = 0; i < 4; i++) s += `<g transform="rotate(${45 + i * 90}) translate(${f(b * .2)} 0)">${pod(b * .36, b * .1, { fill: C.gold, pea: C.forest, n: 3, stem: false })}</g>`;
    s += `<circle r="${f(b * .06)}" fill="${C.gold}"/></g>`;
  }
  // inner sawtooth, forest teeth into the field
  const t = b * .22;
  s += `<g transform="translate(${b} ${b})">${teeth(W - 2 * b, t, C.forest)}</g>`;
  s += `<g transform="translate(${W - b} ${H - b}) rotate(180)">${teeth(W - 2 * b, t, C.forest)}</g>`;
  s += `<g transform="translate(${b} ${H - b}) rotate(-90)">${teeth(H - 2 * b, t, C.forest)}</g>`;
  s += `<g transform="translate(${W - b} ${b}) rotate(90)">${teeth(H - 2 * b, t, C.forest)}</g>`;
  return s;
}

// ================= KANGA concept =================
const kanga = {
  // lid, 400 × 300 mm
  lid: (p) => {
    const W = 4000, H = 3000, b = 300;
    let s = `<rect width="${W}" height="${H}" fill="${C.board}"/>`;
    s += `<defs>${dots(W, H, 90, 7, C.forest, 'dt')}</defs><rect x="${b}" y="${b}" width="${W - 2 * b}" height="${H - 2 * b}" fill="url(#dt)" opacity=".9"/>`;
    // white knockouts behind medallion + type
    s += `<circle cx="${W / 2}" cy="1260" r="800" fill="${C.board}"/>`;
    s += `<rect x="700" y="2080" width="${W - 1400}" height="560" rx="40" fill="${C.board}"/>`;
    s += kangaFrame(W, H, b);
    s += medallion(W / 2, 1260, 740, { ink: C.forest, gold: C.gold, board: C.board });
    s += T(W / 2, 2370, p.name, { size: 330, weight: 800, fill: C.forest, ls: 22 });
    s += T(W / 2, 2490, p.aka, { size: 74, weight: 600, family: 'Barlow', fill: C.forest, ls: 2 });
    // jina: the kanga message, in a marigold-ruled box
    s += `<rect x="1050" y="2535" width="1900" height="96" fill="${C.gold}"/>`;
    s += T(W / 2, 2608, 'MAZAO BORA KUTOKA KENYA', { size: 74, weight: 700, fill: C.forest, ls: 18 });
    return [W, H, s];
  },
  // long side, 400 × 110 mm (hand holes at ~19–24 % and ~80–85 % of the length)
  side: (p, { weight = 'NET 12 × 250 g', klass = 'CLASS I' } = {}) => {
    const W = 4000, H = 1100, sb = 150;
    let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>`;
    s += pindo(W, sb, { bg: C.gold, ink: C.forest, pea: C.gold });
    s += `<g transform="translate(0 ${H - sb})">${pindo(W, sb, { bg: C.gold, ink: C.forest, pea: C.gold })}</g>`;
    s += T(2080, 690, p.name, { size: 330, weight: 800, fill: C.board, ls: 18 });
    s += T(2080, 820, `PRODUCE OF KENYA  ·  ${klass}  ·  ${weight}`, { size: 78, weight: 600, family: 'Barlow', fill: C.gold, ls: 10 });
    s += medallion(380, H / 2, 300, { ink: C.board, gold: C.gold, board: C.board, logo: false, pods: 12 });
    s += `<g transform="translate(380 ${H / 2})"><circle r="128" fill="${C.board}"/>${(() => { const w = 230; return `<image href="${LOGO}" x="${-w / 2}" y="${f(-w / LOGO_AR / 2)}" width="${w}" height="${f(w / LOGO_AR)}"/>`; })()}</g>`;
    s += `<g transform="translate(3710 ${H / 2})">${pod(440, 100, { fill: C.gold, pea: C.forest, n: 5 })}</g>`;
    return [W, H, s];
  },
  // end, 300 × 110 mm (hand holes at ~14–21 % and ~65–73 %)
  end: (p, { gross = 'GROSS WEIGHT 2.0 KG', klass = 'CLASS I' } = {}) => {
    const W = 3000, H = 1100, sb = 150;
    let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>`;
    s += pindo(W, sb, { bg: C.gold, ink: C.forest, pea: C.gold });
    s += `<g transform="translate(0 ${H - sb})">${pindo(W, sb, { bg: C.gold, ink: C.forest, pea: C.gold })}</g>`;
    // address block (white board left unprinted)
    s += `<rect x="760" y="270" width="1100" height="560" rx="46" fill="${C.board}"/>`;
    s += T(1310, 365, 'Packed &amp; exported by', { size: 56, weight: 500, family: 'Barlow', fill: C.forest });
    s += T(1310, 470, 'FRESCA PREMIER FRESH LTD', { size: 92, weight: 800, fill: C.forest, ls: 3 });
    s += T(1310, 575, 'P.O. Box 3468 – 00200', { size: 58, weight: 500, family: 'Barlow', fill: C.forest });
    s += T(1310, 650, 'Nairobi, Kenya', { size: 58, weight: 500, family: 'Barlow', fill: C.forest });
    s += T(1310, 760, 'frescapremierfresh.com', { size: 60, weight: 700, family: 'Barlow', fill: C.forest });
    s += T(2600, 520, klass, { size: 150, weight: 800, fill: C.gold, ls: 6 });
    s += T(2600, 650, gross.replace(/ ([\d.]+ ?KG)$/i, '|$1').split('|')[0], { size: 52, weight: 600, family: 'Barlow', fill: C.board, ls: 6 });
    s += T(2600, 740, (gross.match(/([\d.]+ ?KG)$/i) || [, ''])[1], { size: 96, weight: 800, fill: C.board, ls: 4 });
    s += `<g transform="translate(210 ${H / 2}) rotate(-90)">${T(0, 30, 'FRESCA', { size: 96, weight: 800, fill: C.board, ls: 22 })}</g>`;
    return [W, H, s];
  },
};

// ================= alternates (lid studies only) =================
const kraft = {
  lid: (p) => {
    const W = 4000, H = 3000, ink = C.forest;
    let s = `<rect width="${W}" height="${H}" fill="${C.kraft}"/>`;
    // manifest grid
    s += `<rect x="180" y="180" width="${W - 360}" height="${H - 360}" fill="none" stroke="${ink}" stroke-width="14"/>`;
    s += `<line x1="180" y1="2240" x2="${W - 180}" y2="2240" stroke="${ink}" stroke-width="10"/>`;
    for (const x of [1340, 2500]) s += `<line x1="${x}" y1="2240" x2="${x}" y2="${H - 180}" stroke="${ink}" stroke-width="10"/>`;
    s += T(320, 1030, p.name, { size: 640, weight: 800, fill: ink, anchor: 'start', ls: -6 });
    s += T(330, 1260, p.aka.toUpperCase(), { size: 78, weight: 600, family: 'Barlow', fill: ink, anchor: 'start', ls: 8 });
    s += `<g transform="translate(2900 1680) rotate(-8)"><circle r="400" fill="#f6efe0"/>${(() => { const w = 640; return `<image href="${LOGO}" x="${-w / 2}" y="${f(-w / LOGO_AR / 2)}" width="${w}" height="${f(w / LOGO_AR)}"/>`; })()}</g>`;
    s += `<g transform="translate(1300 1720) rotate(-6)" opacity=".92"><rect x="-470" y="-170" width="940" height="340" rx="26" fill="none" stroke="${ink}" stroke-width="22"/><rect x="-440" y="-140" width="880" height="280" rx="14" fill="none" stroke="${ink}" stroke-width="8"/>${T(0, 50, 'CLASS I', { size: 170, weight: 800, fill: ink, ls: 16 })}</g>`;
    const cell = (x, k, v) => T(x, 2440, k, { size: 64, weight: 600, family: 'Barlow', fill: ink, anchor: 'start', ls: 10 }) + T(x, 2640, v, { size: 150, weight: 800, fill: ink, anchor: 'start' });
    s += cell(300, 'ORIGIN', 'KENYA') + cell(1460, 'NET WEIGHT', '2.0 KG') + cell(2620, 'PACKED BY', 'FRESCA');
    return [W, H, s];
  },
};
const field = {
  lid: (p) => {
    const W = 4000, H = 3000;
    let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>`;
    s += `<g transform="translate(2350 1300) rotate(-24)">${pod(4600, 1050, { fill: C.gold, pea: C.forest, n: 6 })}</g>`;
    s += `<g transform="translate(2350 1300) rotate(-24)"><path d="M-2100 -40 C-900 -560 900 -600 2250 -90" fill="none" stroke="${C.forest}" stroke-width="26"/></g>`;
    s += `<rect x="0" y="2180" width="${W}" height="820" fill="${C.forest}"/>`;
    s += T(260, 2620, p.name, { size: 400, weight: 800, fill: C.board, anchor: 'start', ls: 10 });
    s += T(270, 2800, `${p.aka}  ·  PRODUCE OF KENYA`, { size: 72, weight: 600, family: 'Barlow', fill: C.gold, anchor: 'start', ls: 3 });
    s += `<g transform="translate(3420 2520)"><circle r="330" fill="${C.board}"/>${(() => { const w = 540; return `<image href="${LOGO}" x="${-w / 2}" y="${f(-w / LOGO_AR / 2)}" width="${w}" height="${f(w / LOGO_AR)}"/>`; })()}</g>`;
    return [W, H, s];
  },
};

// ---------- tray panels (12 × 250 g punnet trays) ----------
// front wall of the open tray: low, long band. ~400 × 75 mm visible
kanga.trayFront = (p) => {
  const W = 4000, H = 900, sb = 120;
  let s = `<rect width="${W}" height="${H}" fill="${C.board}"/>`;
  s += pindo(W, sb, { bg: C.forest, ink: C.gold, pea: C.forest });
  s += `<g transform="translate(0 ${sb})">${teeth(W, 60, C.forest)}</g>`;
  s += `<rect y="${H - 110}" width="${W}" height="110" fill="${C.forest}"/>`;
  s += T(W / 2 + 330, 470 + 60, p.name, { size: 270, weight: 800, fill: C.forest, ls: 16 });
  s += T(W / 2 + 330, 640, p.aka, { size: 64, weight: 600, family: 'Barlow', fill: C.forest, ls: 2 });
  s += T(W / 2, H - 38, 'PRODUCE OF KENYA  ·  CLASS I  ·  12 × 250 g  ·  MAZAO BORA KUTOKA KENYA', { size: 54, weight: 700, family: 'Barlow', fill: C.gold, ls: 10 });
  s += medallion(560, 470, 330, { ink: C.forest, gold: C.gold, board: C.board, pods: 14 });
  return [W, H, s];
};
// tray end wall / corner post: forest panel
kanga.trayEnd = (p) => {
  const W = 1600, H = 900, sb = 120;
  let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>`;
  s += pindo(W, sb, { bg: C.gold, ink: C.forest, pea: C.gold });
  s += T(W / 2, 470, p.name.split(' ').length > 1 ? p.name.split(' ')[0] : p.name, { size: 190, weight: 800, fill: C.board, ls: 10 });
  if (p.name.split(' ').length > 1) s += T(W / 2, 640, p.name.split(' ').slice(1).join(' '), { size: 190, weight: 800, fill: C.board, ls: 10 });
  s += T(W / 2, 780, '12 × 250 g  ·  CLASS I', { size: 70, weight: 600, family: 'Barlow', fill: C.gold, ls: 8 });
  return [W, H, s];
};
// plain forest panel with border strip (inner walls, flaps)
kanga.plain = () => {
  const W = 1600, H = 900;
  return [W, H, `<rect width="${W}" height="${H}" fill="${C.forest}"/>${pindo(W, 120, { bg: C.gold, ink: C.forest, pea: C.gold })}`];
};
// ---------- display tray (French beans, 12 × 250 g): front wall 400 × 125 mm with a window cut from 18 % to 74 % ----------
kanga.tray2Front = (p) => {
  const W = 4000, H = 1250, sb = 130;
  let s = `<rect width="${W}" height="${H}" fill="${C.board}"/>`;
  s += pindo(W, sb, { bg: C.forest, ink: C.gold, pea: C.forest });
  s += `<g transform="translate(0 ${sb})">${teeth(W, 64, C.forest)}</g>`;
  s += `<rect y="${H - 150}" width="${W}" height="150" fill="${C.forest}"/>`;
  s += T(W / 2, H - 55, 'PRODUCE OF KENYA  ·  CLASS I  ·  MAZAO BORA KUTOKA KENYA', { size: 62, weight: 700, family: 'Barlow', fill: C.gold, ls: 12 });
  s += medallion(370, 620, 330, { ink: C.forest, gold: C.gold, board: C.board, pods: 14 });
  s += T(1850, 790, p.name, { size: 330, weight: 800, fill: C.forest, ls: 14 });
  s += T(1850, 925, p.aka, { size: 64, weight: 600, family: 'Barlow', fill: C.forest, ls: 2 });
  s += `<g transform="translate(3470 420) rotate(-6)">${pod(700, 130, { fill: C.forest, pea: C.board, n: 6 })}</g>`;
  s += `<rect x="3080" y="690" width="800" height="250" fill="${C.gold}"/>`;
  s += T(3480, 800, 'NET WEIGHT', { size: 56, weight: 700, family: 'Barlow', fill: C.forest, ls: 10 });
  s += T(3480, 905, '12 × 250 g', { size: 110, weight: 800, fill: C.forest, ls: 4 });
  return [W, H, s];
};
// end panel beside the front (≈ 5 : 6): forest, logo, name
kanga.tray2End = (p) => {
  const W = 1000, H = 1200;
  let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>`;
  s += pindo(W, 120, { bg: C.gold, ink: C.forest, pea: C.gold });
  s += `<g transform="translate(${W / 2} 470)"><circle r="250" fill="${C.gold}"/><circle r="232" fill="${C.board}"/>${(() => { const w = 400; return `<image href="${LOGO}" x="${-w / 2}" y="${f(-w / LOGO_AR / 2)}" width="${w}" height="${f(w / LOGO_AR)}"/>`; })()}</g>`;
  p.name.split(' ').forEach((w, i) => { s += T(W / 2, 900 + i * 150, w, { size: 150, weight: 800, fill: C.board, ls: 8 }); });
  return [W, H, s];
};
// tall end wall with a hand cut at the foot (≈ 5 : 8): marigold flood, forest type
kanga.tray2Tall = (p) => {
  const W = 1000, H = 1600;
  let s = `<rect width="${W}" height="${H}" fill="${C.gold}"/>`;
  s += `<rect y="240" width="${W}" height="16" fill="${C.forest}"/>`;
  s += `<g transform="translate(0 270)">${teeth(W, 50, C.forest)}</g>`;
  p.name.split(' ').forEach((w, i) => { s += T(W / 2, 470 + i * 160, w, { size: 165, weight: 800, fill: C.forest, ls: 8 }); });
  p.aka.split(' · ').forEach((w, i) => { s += T(W / 2, 750 + i * 64, w, { size: 52, weight: 600, family: 'Barlow', fill: C.forest }); });
  s += T(W / 2, 1040, 'PRODUCE OF KENYA', { size: 50, weight: 700, family: 'Barlow', fill: C.forest, ls: 10 });
  return [W, H, s];
};
// solid ink (used to repaint flaps, corner posts and inner walls the photo shows in the old green)
kanga.solid = () => [400, 400, `<rect width="400" height="400" fill="${C.forest}"/>`];
// blank board (paints out old marks on white board, lit from the photo)
kanga.board = () => [400, 400, `<rect width="400" height="400" fill="${C.board}"/>`];
// exporter sticker for the tray flap, 100 × 60 mm, rounded label on forest
kanga.label = (p) => {
  const W = 1000, H = 600;
  let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/><rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="70" fill="${C.board}"/>`;
  s += T(W / 2, 110, 'Packed &amp; exported by', { size: 50, weight: 500, family: 'Barlow', fill: C.forest });
  s += T(W / 2, 205, 'FRESCA PREMIER FRESH', { size: 84, weight: 800, fill: C.forest, ls: 2 });
  s += `<rect x="350" y="235" width="300" height="10" fill="${C.gold}"/>`;
  s += T(W / 2, 320, 'P.O. Box 3468 – 00200', { size: 52, weight: 500, family: 'Barlow', fill: C.forest });
  s += T(W / 2, 390, 'Nairobi, Kenya', { size: 52, weight: 500, family: 'Barlow', fill: C.forest });
  s += T(W / 2, 470, 'frescapremierfresh.com', { size: 54, weight: 700, family: 'Barlow', fill: C.forest });
  s += T(W / 2, 545, `${p.name} · 12 × 250 g`, { size: 50, weight: 800, fill: C.forest, ls: 4 });
  return [W, H, s];
};
kanga.info = (p) => {
  const W = 1600, H = 900;
  let s = `<rect width="${W}" height="${H}" fill="${C.forest}"/>${pindo(W, 120, { bg: C.gold, ink: C.forest, pea: C.gold })}`;
  s += `<rect x="150" y="230" width="1300" height="560" rx="40" fill="${C.board}"/>`;
  s += T(800, 320, 'Packed &amp; exported by', { size: 58, weight: 500, family: 'Barlow', fill: C.forest });
  s += T(800, 430, 'FRESCA PREMIER FRESH LTD', { size: 96, weight: 800, fill: C.forest, ls: 3 });
  s += T(800, 540, 'P.O. Box 3468 – 00200, Nairobi, Kenya', { size: 58, weight: 500, family: 'Barlow', fill: C.forest });
  s += T(800, 640, 'frescapremierfresh.com', { size: 62, weight: 700, family: 'Barlow', fill: C.forest });
  s += T(800, 740, `${p.name}  ·  12 × 250 g`, { size: 62, weight: 800, fill: C.forest, ls: 6 });
  return [W, H, s];
};

// ================= approved family (the client-approved 2 kg mangetout carton) =================
// Avenir Next, forest #145211, mid green #408117, gold #e2a617 on white board. These are overlays (transparent background)
// laid over the approved mockups in the flattened frames measured from them, so only the product-specific parts change.
const A = { forest: '#145211', mid: '#408117', sub: '#3b7a1c', gold: '#e2a617', white: '#fbfaf5', font: "'Avenir Next', 'Avenir', sans-serif" };
// text that is fitted to a width: size shrinks until it fits (letter-spacing is in em)
const fitText = (x, y, txt, { size, max, weight = 700, fill, anchor = 'middle', ls = 0.06 }) =>
  `<text class="fit" data-max="${max}" x="${x}" y="${y}" font-family="${A.font}" font-weight="${weight}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${f(size * ls)}" data-ls="${ls}">${txt}</text>`;
// one French bean: long, slim, gently curved, darker body with a lighter ridge and a thin stem
function bean(L, W, { dark = A.forest, light = A.mid, bend = 0.06 } = {}) {
  const h = L / 2, b = L * bend;
  let s = `<path d="M${f(-h)} ${f(b * .2)} C${f(-h * .5)} ${f(-W * .9 + b)} ${f(h * .5)} ${f(-W * .7 + b)} ${f(h)} ${f(-b * .4)} C${f(h * .55)} ${f(W * .55 + b)} ${f(-h * .5)} ${f(W * .7 + b)} ${f(-h)} ${f(b * .2)}Z" fill="${dark}"/>`;
  s += `<path d="M${f(-h * .78)} ${f(b * .3 - W * .08)} C${f(-h * .3)} ${f(-W * .42 + b)} ${f(h * .4)} ${f(-W * .32 + b)} ${f(h * .86)} ${f(-b * .3 - W * .05)}" fill="none" stroke="${light}" stroke-width="${f(W * .22)}" stroke-linecap="round"/>`;
  s += `<path d="M${f(-h + 2)} ${f(b * .2)} q${f(-L * .05)} ${f(-W * .1)} ${f(-L * .085)} ${f(-W * .9)}" fill="none" stroke="${dark}" stroke-width="${f(W * .16)}" stroke-linecap="round"/>`;
  s += `<path d="M${f(h - 2)} ${f(-b * .4)} l${f(L * .03)} ${f(-W * .18)}" fill="none" stroke="${dark}" stroke-width="${f(W * .12)}" stroke-linecap="round"/>`;
  return s;
}
const fam = {
  // lid, in the flattened frame of the approved photo (2000 × 1500): name block centred on x 1023, pods box 1053–1790 × 241–572
  lidPatch: (p) => {
    const W = 2000, H = 1500;
    let s = fitText(1023, 1100, p.name, { size: 208, max: 1700, fill: A.forest, ls: 0.06 });
    s += fitText(1015, 1200, p.aka, { size: 70, max: 1760, weight: 500, fill: A.sub, ls: 0.01 });
    // three beans, fanned like a handful laid on the lid
    s += `<g transform="translate(1440 300) rotate(-5)">${bean(690, 66, { bend: 0.07 })}</g>`;
    s += `<g transform="translate(1415 415) rotate(-1.5)">${bean(730, 70, { bend: 0.09 })}</g>`;
    s += `<g transform="translate(1450 528) rotate(2.5)">${bean(670, 62, { bend: 0.06 })}</g>`;
    return [W, H, s];
  },
  // long side (2000 × 550 frame): name left-aligned at x 1093 between the logo and the hand hole
  sidePatch: (p) => {
    const W = 2000, H = 550;
    let s = fitText(1093, 213, p.name, { size: 80, max: 525, fill: A.white, anchor: 'start', ls: 0.06 });
    s += `<rect x="1091" y="232" width="110" height="6" fill="${A.gold}"/>`;
    s += fitText(1093, 292, p.aka, { size: 20, max: 525, weight: 500, fill: A.white, anchor: 'start', ls: 0.01 });
    return [W, H, s];
  },
  // end (1500 × 550 frame): centred name above the gold rule; NET 2 KG below is kept from the photo
  endPatch: (p) => {
    const W = 1500, H = 550;
    let s = fitText(622, 248, p.name, { size: 106, max: 600, fill: A.white, ls: 0.06 });
    s += `<rect x="567" y="255" width="110" height="7" fill="${A.gold}"/>`;
    return [W, H, s];
  },
};
const P2 = { beans: { name: 'FRENCH BEANS', aka: 'Haricots Verts · Sperziebonen · Feine Bohnen · Judías Verdes' } };

// ---------- the approved family on the existing 12 × 250 g trays (stackable, same structure the client ships today) ----------
// Same panel names and sizes as the kanga tray panels, so scenes.json places them unchanged (art/family/, falls back to kanga).
A.side = '#1b6418'; // the approved carton's green side panels
P2.mangetout = { name: 'MANGETOUT', aka: 'Snow Peas · Pois Gourmands · Peultjes · Zuckerschoten' };
const logo = (cx, cy, w) => `<image href="${LOGO}" x="${f(cx - w / 2)}" y="${f(cy - w / LOGO_AR / 2)}" width="${w}" height="${f(w / LOGO_AR)}"/>`;
// the oval logo badge from the approved carton's side: white oval, gold ring
const badge = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .74)}" fill="${A.white}" stroke="${A.gold}" stroke-width="${f(rx * .05)}"/>${logo(cx, cy, rx * 1.55)}`;
// the approved lid's pair of pods: one closed, one open; or three beans for French beans
const produce = (p, x, y, L) => p === P2.beans
  ? `<g transform="translate(${x} ${y - L * .1}) rotate(-6)">${bean(L, L * .09, { bend: .07 })}</g><g transform="translate(${x - L * .03} ${y + L * .06}) rotate(-2)">${bean(L * 1.04, L * .095, { bend: .09 })}</g><g transform="translate(${x + L * .02} ${y + L * .22}) rotate(2)">${bean(L * .96, L * .088, { bend: .06 })}</g>`
  : `<g transform="translate(${x} ${y}) rotate(-14)">${pod(L, L * .1, { fill: A.forest, pea: A.mid, open: false })}</g><g transform="translate(${x + L * .04} ${y + L * .26}) rotate(-12)">${pod(L * 1.06, L * .11, { fill: A.forest, pea: A.mid, n: 6 })}</g>`;
const fwhite = (W, H, band) => `<rect width="${W}" height="${H}" fill="${A.white}"/><rect x="40" y="40" width="${W - 80}" height="${H - band - 80}" fill="none" stroke="${A.gold}" stroke-width="9"/><rect y="${H - band}" width="${W}" height="${band}" fill="${A.side}"/><rect y="${H - band}" width="${W}" height="10" fill="${A.gold}"/>`;
Object.assign(fam, {
  // mangetout tray front, 4000 × 900; window cut from x 23 % to 80 %, down to 35 %
  trayFront: (p) => {
    const W = 4000, H = 900, band = 150;
    let s = fwhite(W, H, band);
    s += logo(470, 400, 700);
    s += fitText(2060, 560, p.name, { size: 250, max: 2100, fill: A.forest, ls: 0.08 });
    s += fitText(2060, 665, p.aka, { size: 70, max: 2100, weight: 500, fill: A.sub, ls: 0.01 });
    s += produce(p, 3560, 300, 620);
    s += fitText(W / 2, H - 52, 'PRODUCT OF KENYA  ·  CLASS I  ·  12 × 250 G', { size: 64, max: 3600, weight: 600, fill: A.white, ls: 0.16 });
    return [W, H, s];
  },
  // mangetout tray end, 1600 × 900 (hand hole kept from the photo): like the approved carton's end
  trayEnd: (p) => {
    const W = 1600, H = 900;
    let s = `<rect width="${W}" height="${H}" fill="${A.side}"/>`;
    s += fitText(W / 2, 470, p.name, { size: 170, max: 1350, fill: A.white, ls: 0.06 });
    s += `<rect x="${W / 2 - 90}" y="505" width="180" height="12" fill="${A.gold}"/>`;
    s += fitText(W / 2, 640, 'NET 12 × 250 G  ·  CLASS I', { size: 70, max: 1300, weight: 600, fill: A.white, ls: 0.12 });
    return [W, H, s];
  },
  // exporter sticker, 1000 × 600
  label: (p) => {
    const W = 1000, H = 600;
    let s = `<rect width="${W}" height="${H}" fill="${A.side}"/><rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="60" fill="${A.white}" stroke="${A.gold}" stroke-width="10"/>`;
    s += fitText(W / 2, 110, 'Packed &amp; exported by', { size: 46, max: 800, weight: 500, fill: A.sub, ls: 0.02 });
    s += fitText(W / 2, 200, 'FRESCA PREMIER FRESH', { size: 78, max: 860, fill: A.forest, ls: 0.04 });
    s += `<rect x="${W / 2 - 80}" y="228" width="160" height="8" fill="${A.gold}"/>`;
    s += fitText(W / 2, 315, 'P.O. Box 3468 – 00200, Nairobi, Kenya', { size: 44, max: 860, weight: 500, fill: A.forest, ls: 0.01 });
    s += fitText(W / 2, 390, 'frescapremierfresh.com', { size: 48, max: 860, weight: 600, fill: A.forest, ls: 0.02 });
    s += fitText(W / 2, 520, `${p.name}  ·  12 × 250 G`, { size: 50, max: 860, fill: A.forest, ls: 0.06 });
    return [W, H, s];
  },
  // French beans tray front, 4000 × 1250; window from x 18 % to 74 %, down to 36 %
  tray2Front: (p) => {
    const W = 4000, H = 1250, band = 170;
    let s = fwhite(W, H, band);
    s += logo(370, 560, 600);
    s += fitText(1850, 830, p.name, { size: 290, max: 2050, fill: A.forest, ls: 0.07 });
    s += fitText(1850, 945, p.aka, { size: 66, max: 2050, weight: 500, fill: A.sub, ls: 0.01 });
    s += produce(p, 3460, 380, 760);
    s += fitText(3460, 905, 'NET 12 × 250 G', { size: 92, max: 900, fill: A.forest, ls: 0.06 });
    s += fitText(W / 2, H - 62, 'PRODUCT OF KENYA  ·  CLASS I', { size: 70, max: 3600, weight: 600, fill: A.white, ls: 0.18 });
    return [W, H, s];
  },
  // end beside the front, 1000 × 1200: the approved side panel (oval badge, name, gold rule)
  tray2End: (p) => {
    const W = 1000, H = 1200;
    let s = `<rect width="${W}" height="${H}" fill="${A.side}"/>` + badge(W / 2, 470, 330);
    p.name.split(' ').forEach((w, i) => { s += fitText(W / 2, 880 + i * 135, w, { size: 125, max: 860, fill: A.white, ls: 0.06 }); });
    s += `<rect x="${W / 2 - 70}" y="${p.name.includes(' ') ? 1060 : 925}" width="140" height="10" fill="${A.gold}"/>`;
    return [W, H, s];
  },
  // tall end, 1000 × 1600 (hand cut at the foot)
  tray2Tall: (p) => {
    const W = 1000, H = 1600;
    let s = `<rect width="${W}" height="${H}" fill="${A.side}"/>`;
    p.name.split(' ').forEach((w, i) => { s += fitText(W / 2, 470 + i * 160, w, { size: 150, max: 860, fill: A.white, ls: 0.06 }); });
    const y = 470 + (p.name.split(' ').length - 1) * 160 + 50;
    s += `<rect x="${W / 2 - 80}" y="${y}" width="160" height="11" fill="${A.gold}"/>`;
    p.aka.split(' · ').forEach((w, i) => { s += fitText(W / 2, y + 120 + i * 66, w, { size: 50, max: 860, weight: 500, fill: A.white, ls: 0.01 }); });
    return [W, H, s];
  },
});

// ---------- render ----------
const JOBS = [
  ['approved', 'lid-beans', () => fam.lidPatch(P2.beans), true],
  ['approved', 'side-beans', () => fam.sidePatch(P2.beans), true],
  ['approved', 'end-beans', () => fam.endPatch(P2.beans), true],
  ['family', 'tray-front-mangetout', () => fam.trayFront(P2.mangetout)],
  ['family', 'tray-end-mangetout', () => fam.trayEnd(P2.mangetout)],
  ['family', 'label-mangetout', () => fam.label(P2.mangetout)],
  ['family', 'tray2-front-beans', () => fam.tray2Front(P2.beans)],
  ['family', 'tray2-end-beans', () => fam.tray2End(P2.beans)],
  ['family', 'tray2-tall-beans', () => fam.tray2Tall(P2.beans)],
  ['family', 'solid', () => [400, 400, `<rect width="400" height="400" fill="${A.side}"/>`]],
  // scenes repaint the old orange flaps with "gold.png"; in this family those flaps are the green side colour
  ['family', 'gold', () => [400, 400, `<rect width="400" height="400" fill="${A.side}"/>`]],
  ['kanga', 'lid-mangetout', () => kanga.lid(P.mangetout)],
  ['kanga', 'side-mangetout', () => kanga.side(P.mangetout, { weight: 'NET 2 KG' })],
  ['kanga', 'end-mangetout', () => kanga.end(P.mangetout)],
  ['kanga', 'tray-front-mangetout', () => kanga.trayFront(P.mangetout)],
  ['kanga', 'tray-end-mangetout', () => kanga.trayEnd(P.mangetout)],
  ['kanga', 'tray-info-mangetout', () => kanga.info(P.mangetout)],
  ['kanga', 'tray-front-beans', () => kanga.trayFront(P.beans)],
  ['kanga', 'tray-end-beans', () => kanga.trayEnd(P.beans)],
  ['kanga', 'tray-info-beans', () => kanga.info(P.beans)],
  ['kanga', 'plain', () => kanga.plain()],
  ['kanga', 'solid', () => kanga.solid()],
  ['kanga', 'board', () => kanga.board()],
  ['kanga', 'gold', () => [400, 400, `<rect width="400" height="400" fill="${C.gold}"/>`]],
  ['kanga', 'tray2-front-beans', () => kanga.tray2Front(P.beans)],
  ['kanga', 'tray2-end-beans', () => kanga.tray2End(P.beans)],
  ['kanga', 'tray2-tall-beans', () => kanga.tray2Tall(P.beans)],
  ['kanga', 'label-mangetout', () => kanga.label(P.mangetout)],
  ['kanga', 'label-beans', () => kanga.label(P.beans)],
  ['kraft', 'lid-mangetout', () => kraft.lid(P.mangetout)],
  ['field', 'lid-mangetout', () => field.lid(P.mangetout)],
];

(async () => {
  const only = process.argv[2];
  const b = await chromium.launch();
  const page = await b.newPage();
  for (const [concept, name, fn, transparent] of JOBS) {
    if (only && !`${concept}/${name}`.includes(only)) continue;
    const [W, H, svg] = fn();
    const dir = path.join(OUT, concept); fs.mkdirSync(dir, { recursive: true });
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(`<!doctype html><link href="${FONTS}" rel="stylesheet"><style>html,body{margin:0;background:transparent}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>`);
    await page.evaluate(() => document.fonts.ready);
    // shrink fitted text until it is no wider than its data-max
    await page.evaluate(() => document.querySelectorAll('text.fit').forEach((t) => {
      const max = +t.dataset.max, ls = +t.dataset.ls;
      for (let i = 0; i < 60 && t.getBBox().width > max; i++) {
        const sz = parseFloat(t.getAttribute('font-size')) * 0.97;
        t.setAttribute('font-size', sz); t.setAttribute('letter-spacing', sz * ls);
      }
    }));
    await page.screenshot({ path: path.join(dir, name + '.png'), omitBackground: !!transparent });
    console.log(concept + '/' + name, W + '×' + H);
  }
  await b.close();
})();
