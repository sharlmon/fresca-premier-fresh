// Fresca shelf-ready display tray (12 × 250 g punnets): structure + artwork, shared by the die-line and the 3D renders.
//
// Structure (all mm, outside dimensions):
//   base        390 × 290
//   front lip   75 high, with a 18 mm thumb dip in the middle so punnets lift out and the produce shows
//   back wall   200 high, double layer: the header folds over its top crease and hangs inside, so its printed
//               face looks forward over the punnets (one-side print, two-layer strength)
//   side walls  sweep down from 200 at the back to 75 at the front
//   glue flaps  on both ends of the front and back walls, glued to the inside of the side walls
// Board: white-top E/B flute, 4 mm; print side is the outside of the blank (white), inside is kraft.
//
// Panel art is described in each panel's own coordinates: u to the right and v up, as the person looking at that
// face sees it. The die-line rotates each panel into the flat blank; the renderer maps it onto the 3D face.

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, '01_client-assets/logo/fresca-logo-transparent.png')).toString('base64');
const LOGO_AR = 936 / 730;

const D = { L: 390, W: 290, hF: 75, hB: 200, hI: 150, dip: 18, dipW: 92, ch: 22, t: 4, flap: 32 };
const INK = { forest: '#145211', side: '#1b6418', mid: '#408117', pea: '#9bc43a', sub: '#3b7a1c', gold: '#e2a617', board: '#fafbf6', kraft: '#b58a5a' };
const FONT = "'Avenir Next', 'Avenir', sans-serif";

const PRODUCTS = {
  mangetout: { slug: 'mangetout', name: 'MANGETOUT', aka: ['Snow Peas', 'Pois Gourmands', 'Peultjes', 'Zuckerschoten'], art: 'pods', photo: '05_website/site/public/img/factory/snow-peas-tray.webp' },
  beans: { slug: 'french-beans', name: 'FRENCH BEANS', aka: ['Haricots Verts', 'Sperziebonen', 'Feine Bohnen', 'Judías Verdes'], art: 'beans', photo: '05_website/site/public/img/factory/french-beans-tray.webp' },
};
const INFO = 'PRODUCT OF KENYA  ·  CLASS I  ·  12 × 250 G';

// ---------- outlines (panel coords, mm, v up) ----------
const N = 64;
const frontTop = (u) => { const s = (u - D.L / 2) / D.dipW; return D.hF - (Math.abs(s) < 1 ? D.dip * (Math.cos(Math.PI * s) + 1) / 2 : 0); };
const sideTop = (x) => D.hF + (D.hB - D.hF) * Math.pow(1 - x / D.W, 1.6); // x = distance from the back
const outline = {
  front: () => { const p = [[0, 0], [D.L, 0]]; for (let i = N; i >= 0; i--) { const u = (D.L * i) / N; p.push([u, frontTop(u)]); } return p; },
  back: () => [[0, 0], [D.L, 0], [D.L, D.hB - D.ch], [D.L - D.ch, D.hB], [D.ch, D.hB], [0, D.hB - D.ch]],
  // header inner: hangs from the top crease; narrower so it clears the side walls
  header: () => { const w = D.L - 2 * D.t - 2, c = (w - (D.L - 2 * D.ch)) / 2; /* crease as long as the back wall's */ return [[0, 0], [w, 0], [w, D.hI - c], [w - c, D.hI], [c, D.hI], [0, D.hI - c]]; },
  // left side seen from outside the left: back is on the viewer's left
  sideL: () => { const p = [[0, 0], [D.W, 0]]; for (let i = N; i >= 0; i--) { const u = (D.W * i) / N; p.push([u, sideTop(u)]); } return p; },
  sideR: () => { const p = [[0, 0], [D.W, 0]]; for (let i = N; i >= 0; i--) { const u = (D.W * i) / N; p.push([u, sideTop(D.W - u)]); } return p; },
};
const size = { front: [D.L, D.hF], back: [D.L, D.hB], header: [D.L - 2 * D.t - 2, D.hI], sideL: [D.W, D.hB], sideR: [D.W, D.hB], base: [D.L, D.W] };

// ---------- drawing helpers (svg units = mm) ----------
const f = (n) => +(+n).toFixed(2);
const T = (x, y, txt, { size: s, weight = 700, fill, anchor = 'middle', ls = 0.06 }) =>
  `<text x="${f(x)}" y="${f(y)}" font-family="${FONT}" font-weight="${weight}" font-size="${f(s)}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${f(s * ls)}">${txt}</text>`;
const logo = (cx, cy, w, plate = true) => {
  const h = w / LOGO_AR;
  let s = '';
  if (plate) s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w * .6)}" ry="${f(h * .62)}" fill="${INK.board}"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w * .56)}" ry="${f(h * .58)}" fill="none" stroke="${INK.gold}" stroke-width="${f(w * .012)}"/>`;
  return s + `<image href="${LOGO}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
};
// pea pod in the approved lid style: dark body, lighter seam, light peas when open
function pod(cx, cy, L, W, rot, open) {
  const h = L / 2;
  let s = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})">`;
  s += `<path d="M${f(-h)} 0 C${f(-h * .5)} ${f(-W * 1.05)} ${f(h * .55)} ${f(-W * 1.0)} ${f(h)} ${f(-W * .15)} C${f(h * .5)} ${f(W * .8)} ${f(-h * .45)} ${f(W * .85)} ${f(-h)} 0Z" fill="${INK.forest}"/>`;
  s += `<path d="M${f(-h - L * .03)} ${f(-W * .05)} q${f(-L * .06)} ${f(W * .05)} ${f(-L * .11)} ${f(W * .55)}" fill="none" stroke="${INK.forest}" stroke-width="${f(W * .16)}" stroke-linecap="round"/>`;
  s += `<path d="M${f(-h * .1)} ${f(-W * .62)} l${f(-W * .5)} ${f(-W * .3)} M${f(-h * .7)} ${f(-W * .35)} l${f(-W * .35)} ${f(-W * .45)}" stroke="${INK.forest}" stroke-width="${f(W * .1)}" stroke-linecap="round"/>`;
  if (open) {
    s += `<path d="M${f(-h * .78)} ${f(-W * .02)} C${f(-h * .3)} ${f(-W * .28)} ${f(h * .45)} ${f(-W * .26)} ${f(h * .86)} ${f(-W * .1)} L${f(h * .82)} ${f(W * .12)} C${f(h * .4)} ${f(W * .22)} ${f(-h * .3)} ${f(W * .25)} ${f(-h * .78)} ${f(W * .05)}Z" fill="${INK.mid}"/>`;
    for (let i = 0; i < 5; i++) { const x = -h * .5 + i * (h * 1.15 / 4); s += `<circle cx="${f(x)}" cy="${f(-W * .03)}" r="${f(W * (i === 4 ? .17 : .21))}" fill="${INK.pea}"/>`; }
  } else {
    s += `<path d="M${f(-h * .8)} ${f(-W * .3)} C${f(-h * .3)} ${f(-W * .62)} ${f(h * .45)} ${f(-W * .58)} ${f(h * .88)} ${f(-W * .22)}" fill="none" stroke="${INK.mid}" stroke-width="${f(W * .2)}" stroke-linecap="round"/>`;
  }
  return s + '</g>';
}
// French bean: long, slim, a little curved, with a light ridge and a thin tail
function bean(cx, cy, L, W, rot, bend = .07) {
  const h = L / 2, b = L * bend;
  let s = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})">`;
  s += `<path d="M${f(-h)} ${f(b * .2)} C${f(-h * .5)} ${f(-W * .9 + b)} ${f(h * .5)} ${f(-W * .7 + b)} ${f(h)} ${f(-b * .4)} C${f(h * .55)} ${f(W * .55 + b)} ${f(-h * .5)} ${f(W * .7 + b)} ${f(-h)} ${f(b * .2)}Z" fill="${INK.forest}"/>`;
  s += `<path d="M${f(-h * .78)} ${f(b * .3 - W * .08)} C${f(-h * .3)} ${f(-W * .42 + b)} ${f(h * .4)} ${f(-W * .32 + b)} ${f(h * .86)} ${f(-b * .3 - W * .05)}" fill="none" stroke="${INK.mid}" stroke-width="${f(W * .22)}" stroke-linecap="round"/>`;
  s += `<path d="M${f(-h + .3)} ${f(b * .2)} q${f(-L * .05)} ${f(-W * .1)} ${f(-L * .085)} ${f(-W * .9)}" fill="none" stroke="${INK.forest}" stroke-width="${f(W * .16)}" stroke-linecap="round"/>`;
  return s + '</g>';
}
// a small group of the product, fitted in a box (x, y = centre; w = width)
const produce = (p, cx, cy, w) => p.art === 'pods'
  ? pod(cx + w * .03, cy - w * .15, w * .86, w * .15, -5, false) + pod(cx - w * .02, cy + w * .12, w * .92, w * .16, -2, true)
  : bean(cx, cy - w * .14, w * .92, w * .085, -6) + bean(cx - w * .02, cy, w * .96, w * .09, -2.5, .09) + bean(cx + w * .02, cy + w * .14, w * .9, w * .082, 1.5, .06);

// ---------- panel art. Returns svg content for a panel of size[panel], y down (v = H - y) ----------
const art = {
  front: (p) => {
    const [W, H] = size.front;
    let s = `<rect width="${W}" height="${H}" fill="${INK.board}"/>`;
    s += `<rect y="${H - 20}" width="${W}" height="20" fill="${INK.forest}"/><rect y="${H - 21.6}" width="${W}" height="1.6" fill="${INK.gold}"/>`;
    s += T(W / 2, H - 7.2, INFO, { size: 6.2, fill: INK.board, ls: .14, weight: 600 });
    s += logo(36, H - 46, 46);
    s += T(W / 2, H - 29, p.name, { size: p.name.length > 10 ? 19 : 21, fill: INK.forest, ls: .06 });
    s += produce(p, W - 44, H - 44, 58);
    return s;
  },
  header: (p) => {
    const [W, H] = size.header;
    let s = `<rect width="${W}" height="${H}" fill="${INK.board}"/>`;
    s += `<rect x="7" y="7" width="${W - 14}" height="${H - 58}" fill="none" stroke="${INK.gold}" stroke-width="1.1"/>`;
    s += `<rect y="${H - 42}" width="${W}" height="42" fill="${INK.forest}"/><rect y="${H - 43.6}" width="${W}" height="1.6" fill="${INK.gold}"/>`;
    s += T(W / 2, H - 25, INFO, { size: 6.6, fill: INK.board, ls: .14, weight: 600 });
    s += logo(78, 50, 104, false);
    s += T(258, 66, p.name, { size: p.name.length > 10 ? 20 : 23, fill: INK.forest, ls: .06 });
    s += T(258, 78, p.aka.join('  ·  '), { size: 5.6, weight: 500, fill: INK.sub, ls: .01 });
    s += `<rect x="234" y="70" width="48" height="1.3" fill="${INK.gold}"/>`;
    s += produce(p, 258, 27, 70);
    return s;
  },
  back: (p) => {
    const [W, H] = size.back;
    let s = `<rect width="${W}" height="${H}" fill="${INK.forest}"/>`;
    s += `<rect y="14" width="${W}" height="1.6" fill="${INK.gold}"/>`;
    s += logo(82, 78, 92);
    s += T(260, 62, p.name, { size: 17, fill: INK.board, ls: .06, anchor: 'middle' });
    s += `<rect x="236" y="68" width="48" height="1.3" fill="${INK.gold}"/>`;
    s += T(260, 80, p.aka.join('  ·  '), { size: 5, weight: 500, fill: INK.board, ls: .01 });
    s += T(260, 96, INFO, { size: 5.6, weight: 600, fill: INK.gold, ls: .12 });
    // exporter block and a lot / pack-date field for the packhouse stamp
    s += `<rect x="30" y="128" width="200" height="54" rx="4" fill="${INK.board}"/>`;
    s += T(42, 141, 'Packed &amp; exported by', { size: 5, weight: 500, fill: INK.forest, anchor: 'start', ls: 0 });
    s += T(42, 152, 'FRESCA PREMIER FRESH LTD', { size: 7.4, fill: INK.forest, anchor: 'start', ls: .04 });
    s += T(42, 162, 'P.O. Box 3468 – 00200, Nairobi, Kenya', { size: 5, weight: 500, fill: INK.forest, anchor: 'start', ls: 0 });
    s += T(42, 172, 'frescapremierfresh.com', { size: 5.2, weight: 600, fill: INK.forest, anchor: 'start', ls: 0 });
    s += `<rect x="246" y="128" width="114" height="54" rx="4" fill="none" stroke="${INK.board}" stroke-width=".9"/>`;
    for (const [i, k] of ['LOT', 'PACKED', 'BEST BEFORE'].entries()) {
      s += T(254, 143 + i * 15, k, { size: 4.6, weight: 600, fill: INK.board, anchor: 'start', ls: .1 });
      s += `<line x1="292" y1="${144 + i * 15}" x2="352" y2="${144 + i * 15}" stroke="${INK.board}" stroke-width=".5"/>`;
    }
    return s;
  },
  side: (p, mirror) => {
    const [W, H] = size.sideL;
    // content sits toward the back (tall end); mirror for the right side so it is always near the back
    const X = (u) => (mirror ? W - u : u);
    let s = `<rect width="${W}" height="${H}" fill="${INK.side}"/>`;
    s += logo(X(74), H - 92, 70);
    s += T(X(76), H - 34, p.name, { size: p.name.length > 10 ? 11 : 12.5, fill: INK.board, ls: .06, anchor: 'middle' });
    s += `<rect x="${X(76) - 18}" y="${H - 29.5}" width="36" height="1.1" fill="${INK.gold}"/>`;
    s += T(X(76), H - 21, '12 × 250 G', { size: 6, weight: 600, fill: INK.gold, ls: .12 });
    return s;
  },
  base: (p) => {
    const [W, H] = size.base;
    let s = `<rect width="${W}" height="${H}" fill="${INK.board}"/>`;
    s += T(W / 2, H / 2 - 6, 'FRESCA PREMIER FRESH', { size: 9, fill: INK.forest, ls: .2 });
    s += T(W / 2, H / 2 + 8, `${p.name}  ·  12 × 250 G  ·  KEEP REFRIGERATED 2–4 °C`, { size: 5.4, weight: 600, fill: INK.forest, ls: .1 });
    return s;
  },
};
const panelSVG = (panel, p) => {
  const [W, H] = size[panel === 'sideL' || panel === 'sideR' ? 'sideL' : panel];
  const body = panel === 'sideL' ? art.side(p, false) : panel === 'sideR' ? art.side(p, true) : art[panel](p);
  return { W, H, body };
};

module.exports = { D, INK, FONT, PRODUCTS, INFO, outline, size, panelSVG, frontTop, sideTop, LOGO };
