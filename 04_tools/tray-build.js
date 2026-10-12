// Display tray: flat artwork panels + die-line (the unfolded blank, print side up) for each product.
//   node tray-build.js            -> 06_packaging/art/tray/<product>/<panel>.png
//                                    06_packaging/dielines/<product>-tray-dieline.{svg,pdf,png}
// Geometry and artwork come from tray-spec.js. Units are millimetres; the PDF is 1:1.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { D, INK, FONT, PRODUCTS, outline, size, panelSVG } = require('./tray-spec');

const ROOT = path.resolve(__dirname, '..');
const ART = path.join(ROOT, '06_packaging/art/tray');
const OUT = path.join(ROOT, '06_packaging/dielines');
const PX = 10; // px per mm for the artwork PNGs

// ---------- blank layout ----------
// Page: x right, y down. Base in the middle with the back edge on top. Seen from the print side (outside),
// page right is the box's left side. Each panel's art is placed with a matrix from art coords (u, y = H - v).
const M = 40;                                   // page margin
const bx = M + D.hB, by = M + D.hI + D.hB;      // base top-left
const Wh = size.header[0], x0 = bx + (D.L - Wh) / 2;
const PANELS = {
  base:   { m: [1, 0, 0, 1, bx, by] },
  back:   { m: [1, 0, 0, 1, bx, by - D.hB] },
  header: { m: [-1, 0, 0, -1, x0 + Wh, by - D.hB] },
  front:  { m: [-1, 0, 0, -1, bx + D.L, by + D.W + D.hF] },
  sideL:  { m: [0, 1, -1, 0, bx + D.L + D.hB, by] },
  sideR:  { m: [0, -1, 1, 0, bx - D.hB, by + D.W] },
};
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const localPoly = (panel) => {
  if (panel === 'base') return [[0, 0], [D.L, 0], [D.L, D.W], [0, D.W]];
  const H = size[panel][1];
  return outline[panel]().map(([u, v]) => [u, H - v]);   // to art coords (y down)
};
const blankPoly = (panel) => localPoly(panel).map((p) => apply(PANELS[panel].m, p));

// glue flaps on the ends of the back and front walls (fold 90°, glued inside the side walls)
const F = D.flap;
const flaps = [
  { name: 'back-left',  pts: [[bx, by - 4], [bx - F, by - 4 - F * .6], [bx - F, by - D.hB + D.ch + 26], [bx, by - D.hB + D.ch + 4]], crease: [[bx, by - 4], [bx, by - D.hB + D.ch + 4]] },
  { name: 'back-right', pts: [[bx + D.L, by - 4], [bx + D.L + F, by - 4 - F * .6], [bx + D.L + F, by - D.hB + D.ch + 26], [bx + D.L, by - D.hB + D.ch + 4]], crease: [[bx + D.L, by - 4], [bx + D.L, by - D.hB + D.ch + 4]] },
  { name: 'front-left',  pts: [[bx, by + D.W + 3], [bx - F, by + D.W + 3 + F * .5], [bx - F, by + D.W + D.hF - 18], [bx, by + D.W + D.hF - 4]], crease: [[bx, by + D.W + 3], [bx, by + D.W + D.hF - 4]] },
  { name: 'front-right', pts: [[bx + D.L, by + D.W + 3], [bx + D.L + F, by + D.W + 3 + F * .5], [bx + D.L + F, by + D.W + D.hF - 18], [bx + D.L, by + D.W + D.hF - 4]], crease: [[bx + D.L, by + D.W + 3], [bx + D.L, by + D.W + D.hF - 4]] },
];
const creases = [
  [[bx, by], [bx + D.L, by]], [[bx, by + D.W], [bx + D.L, by + D.W]],           // base back / front
  [[bx, by], [bx, by + D.W]], [[bx + D.L, by], [bx + D.L, by + D.W]],           // base sides
  [[bx + D.ch, by - D.hB], [bx + D.L - D.ch, by - D.hB]],                       // header fold (180°)
  ...flaps.map((fl) => fl.crease),
];
const onSeg = (p, [a, b]) => {
  const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  if (Math.abs(cross) > 0.05 * Math.hypot(b[0] - a[0], b[1] - a[1])) return false;
  const t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
  return t > -1e-3 && t < 1 + 1e-3;
};
// split polygon edges into cut pieces, leaving out the parts that run along a crease
function cutEdges(poly) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const cr = creases.find((c) => onSeg(a, c) && onSeg(b, c));
    if (cr) continue;
    // an edge that partly overlaps a crease (wall end with a flap): cut only the part outside the crease
    const part = creases.find((c) => (onSeg(c[0], [a, b]) && onSeg(c[1], [a, b])));
    if (part) {
      const [c0, c1] = part, d = (p) => Math.hypot(p[0] - a[0], p[1] - a[1]);
      const [n, fa] = d(c0) < d(c1) ? [c0, c1] : [c1, c0];
      if (d(n) > .01) out.push([a, n]);
      if (Math.hypot(b[0] - fa[0], b[1] - fa[1]) > .01) out.push([fa, b]);
      continue;
    }
    out.push([a, b]);
  }
  return out;
}

const f = (n) => +(+n).toFixed(2);
const pts = (p) => p.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const line = ([a, b], cls) => `<line class="${cls}" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
function dim(a, b, off, label, vertical) {
  // dimension line parallel to a–b, offset by `off` (mm), with ticks and a label
  const [x1, y1] = a, [x2, y2] = b;
  if (!vertical) {
    const y = y1 + off;
    return `<g class="dim"><line x1="${f(x1)}" y1="${f(y)}" x2="${f(x2)}" y2="${f(y)}"/><line x1="${f(x1)}" y1="${f(y - 3)}" x2="${f(x1)}" y2="${f(y + 3)}"/><line x1="${f(x2)}" y1="${f(y - 3)}" x2="${f(x2)}" y2="${f(y + 3)}"/><line class="ext" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x1)}" y2="${f(y)}"/><line class="ext" x1="${f(x2)}" y1="${f(y2)}" x2="${f(x2)}" y2="${f(y)}"/><text x="${f((x1 + x2) / 2)}" y="${f(y - 2.2)}">${label}</text></g>`;
  }
  const x = x1 + off;
  return `<g class="dim"><line x1="${f(x)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y2)}"/><line x1="${f(x - 3)}" y1="${f(y1)}" x2="${f(x + 3)}" y2="${f(y1)}"/><line x1="${f(x - 3)}" y1="${f(y2)}" x2="${f(x + 3)}" y2="${f(y2)}"/><line class="ext" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y1)}"/><line class="ext" x1="${f(x2)}" y1="${f(y2)}" x2="${f(x)}" y2="${f(y2)}"/><text transform="translate(${f(x - 2.2)} ${f((y1 + y2) / 2)}) rotate(-90)">${label}</text></g>`;
}

function dieline(p, png) {
  const PW = 2 * M + 2 * D.hB + D.L, PH = 2 * M + D.hI + D.hB + D.W + D.hF + 52;
  let defs = '', body = '', cuts = [];
  for (const panel of Object.keys(PANELS)) {
    const poly = blankPoly(panel), m = PANELS[panel].m, [W, H] = panel === 'base' ? [D.L, D.W] : size[panel];
    defs += `<clipPath id="c-${panel}"><polygon points="${pts(poly)}"/></clipPath>`;
    body += `<g clip-path="url(#c-${panel})"><image href="${png[panel]}" width="${W}" height="${H}" transform="matrix(${m.join(' ')})" preserveAspectRatio="none"/></g>`;
    cuts.push(...cutEdges(poly));
  }
  for (const fl of flaps) {
    body += `<polygon points="${pts(fl.pts)}" fill="#fff"/><polygon points="${pts(fl.pts)}" fill="url(#glue)"/>`;
    cuts.push(...cutEdges(fl.pts));
  }
  let lines = cuts.map((c) => line(c, 'cut')).join('') + creases.map((c) => line(c, 'crease')).join('');
  // dimensions
  const top = by - D.hB - D.hI, bot = by + D.W + D.hF;
  let dims = '';
  dims += dim([bx, top], [bx + D.L, top], -14, `${D.L}`);
  dims += dim([bx - D.hB, bot], [bx + D.L + D.hB, bot], 26, `${2 * D.hB + D.L}  overall`);
  dims += dim([bx - D.hB, bot], [bx, bot], 12, `${D.hB}`);
  dims += dim([bx + D.L, bot], [bx + D.L + D.hB, bot], 12, `${D.hB}`);
  dims += dim([bx + D.L + D.hB, top], [bx + D.L + D.hB, bot], 26, `${D.hI + D.hB + D.W + D.hF}  overall`, true);
  dims += dim([bx + D.L + D.hB, top], [bx + D.L + D.hB, by - D.hB], 12, `${D.hI}`, true);
  dims += dim([bx + D.L + D.hB, by - D.hB], [bx + D.L + D.hB, by], 12, `${D.hB}`, true);
  dims += dim([bx + D.L + D.hB, by], [bx + D.L + D.hB, by + D.W], 12, `${D.W}`, true);
  dims += dim([bx + D.L + D.hB, by + D.W], [bx + D.L + D.hB, bot], 12, `${D.hF}`, true);
  dims += dim([bx - D.hB, by], [bx - D.hB, by + D.W], -12, `${D.W}`, true);
  // labels on the blank (outside the art, in the margins of each panel)
  const lab = (x, y, t, r = 0) => `<text class="lab" transform="translate(${f(x)} ${f(y)}) rotate(${r})">${t}</text>`;
  let labels = lab(bx - D.hB + 4, by - 6, 'SIDE (right) — folds up 90°') + lab(bx + D.L + 4, by - 6, 'SIDE (left) — folds up 90°')
    + lab(x0 + 4, top - 4, 'HEADER — folds 180° over the top crease, hangs inside; printed face looks forward')
    + lab(bx + 4, by - D.hB - 4, 'header fold') + lab(bx - F + 1, by - 64, 'GLUE', -90) + lab(bx + D.L + F - 1, by - 98, 'GLUE', 90)
    + lab(bx - F + 1, by + D.W + 52, 'GLUE', -90) + lab(bx + D.L + F - 1, by + D.W + 22, 'GLUE', 90)
    + lab(bx + 4, by + D.W + D.hF + 8, 'FRONT LIP — 18 mm thumb dip');
  // title block
  const ty = bot + 44;
  let title = `<g class="title"><rect x="${M}" y="${ty}" width="${PW - 2 * M}" height="${PH - ty - 10}" fill="none" stroke="#999" stroke-width=".35"/>`;
  title += `<text x="${M + 6}" y="${ty + 11}" class="tt">FRESCA PREMIER FRESH  ·  Display tray 12 × 250 g  ·  ${p.name}</text>`;
  title += `<text x="${M + 6}" y="${ty + 21}" class="ts">Die-line v1, print side up, scale 1:1, mm. Outside ${D.L} × ${D.W} × ${D.hB} (front lip ${D.hF}). Board: white-top E/B flute, ${D.t} mm. Inks: forest, mid green, gold + full-colour logo.</text>`;
  title += `<text x="${M + 6}" y="${ty + 29}" class="ts">Structure and art by sharl-tech for Fresca, 12 Oct 2026. Confirm board calliper and punnet size with the converter before cutting tools are made.</text>`;
  const lx = PW - M - 210;
  title += `<line class="cut" x1="${lx}" y1="${ty + 10}" x2="${lx + 18}" y2="${ty + 10}"/><text x="${lx + 22}" y="${ty + 12}" class="ts">cut</text>`;
  title += `<line class="crease" x1="${lx + 50}" y1="${ty + 10}" x2="${lx + 68}" y2="${ty + 10}"/><text x="${lx + 72}" y="${ty + 12}" class="ts">crease / fold</text>`;
  title += `<rect x="${lx + 120}" y="${ty + 6}" width="14" height="8" fill="url(#glue)" stroke="#999" stroke-width=".3"/><text x="${lx + 138}" y="${ty + 12}" class="ts">glue</text></g>`;
  const css = `<style>.cut{stroke:#111;stroke-width:.6;fill:none}.crease{stroke:#e0002a;stroke-width:.6;stroke-dasharray:4 2.5;fill:none}
.dim line{stroke:#0067c5;stroke-width:.3}.dim line.ext{stroke-dasharray:1 1.2}.dim text{font:600 4.2px ${FONT};fill:#0067c5;text-anchor:middle}
.lab{font:600 3.6px ${FONT};fill:#e0002a;letter-spacing:.2px}.tt{font:700 6.5px ${FONT};fill:#145211}.ts{font:500 3.8px ${FONT};fill:#333}</style>`;
  defs += `<pattern id="glue" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="#fff"/><line x1="0" y1="0" x2="0" y2="3" stroke="#e0002a" stroke-width=".5" opacity=".55"/></pattern>`;
  return { PW, PH, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}mm" height="${PH}mm" viewBox="0 0 ${PW} ${PH}">${css}<defs>${defs}</defs><rect width="${PW}" height="${PH}" fill="#fff"/>${body}${lines}${dims}${labels}${title}</svg>` };
}

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage();
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of Object.values(PRODUCTS)) {
    const dir = path.join(ART, p.slug); fs.mkdirSync(dir, { recursive: true });
    const png = {};
    for (const panel of ['base', 'back', 'header', 'front', 'sideL', 'sideR']) {
      const { W, H, body } = panelSVG(panel, p);
      await page.setViewportSize({ width: Math.round(W * PX), height: Math.round(H * PX) });
      await page.setContent(`<!doctype html><style>html,body{margin:0}svg{display:block}</style><svg xmlns="http://www.w3.org/2000/svg" width="${W * PX}" height="${H * PX}" viewBox="0 0 ${W} ${H}">${body}</svg>`);
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(dir, panel + '.png');
      await page.screenshot({ path: file });
      png[panel] = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
      console.log('art', p.slug, panel);
    }
    const { PW, PH, svg } = dieline(p, png);
    const base = path.join(OUT, `${p.slug}-tray-dieline`);
    fs.writeFileSync(base + '.svg', svg);
    await page.setViewportSize({ width: Math.round(PW * 4), height: Math.round(PH * 4) });
    await page.setContent(`<!doctype html><style>html,body{margin:0}svg{display:block;width:${PW * 4}px;height:${PH * 4}px}</style>${svg}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: base + '.png' });
    await page.pdf({ path: base + '.pdf', width: `${PW}mm`, height: `${PH}mm`, printBackground: true, pageRanges: '1' });
    console.log('dieline', p.slug, `${PW} × ${PH} mm`);
  }
  await b.close();
})();
