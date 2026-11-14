// Premier Veg wall panels: one artwork per printed panel, drawn at the exact size from the printer's quotation.
// Sizes are in cm (width x height). Output: 07_wall-stickers/panels/source/*.html (each sets @page to its real size).
// Render to PDF with wall-panels-render.mjs. Edit PANELS / THEMES below and rebuild.
const fs = require('fs');
const ROOT = '/Users/admin/Desktop/frescape';
const OUT = `${ROOT}/07_wall-stickers/panels/source`;
const IMG = `file://${ROOT}/03_brochure/source/img`;
const WEB = 'file:///Users/admin/Desktop/premierveg/public/img';
const PH = `file://${ROOT}/07_wall-stickers/source/photos`;
fs.mkdirSync(OUT, { recursive: true });

// reuse the icon set from the poster script
const src = fs.readFileSync(`${ROOT}/04_tools/wall-stickers-build.js`, 'utf8');
const iconSrc = src.slice(src.indexOf('const ic ='), src.indexOf('\n};', src.indexOf('const ICON')) + 3);
const ICON = new Function(iconSrc + '; return ICON;')();
const U = (f) => `${IMG}/${f}`;

// ---------- content ----------
const THEMES = {
  welcome: { eyebrow: 'Who we are', title: ['Premium produce,', 'grown with care.'], bg: [`${WEB}/hero-workers.webp`, '50% 40%'], vis: [`${WEB}/sugar-snaps.webp`, '50% 50%'], items: [
    ['globe', '3 export markets', 'France, the Netherlands and Switzerland.'], ['pin', 'Established 2022', 'Based in Nairobi, Kenya.'], ['shield', '2 audited standards', 'GlobalG.A.P. and SMETA.'], ['leaf', 'Grown with care', 'Selected, graded and packed to your specification.']] },
  process: { eyebrow: 'Our process', title: ['From farm', 'to export.'], bg: [U('field.jpg'), '50% 60%'], dark: true, vis: [`${WEB}/export-mangetout-carton.webp`, '50% 55%'], items: [
    ['leaf', '1  Sourcing', 'Trusted farmers, finest produce, peak freshness.'], ['search', '2  Grading', 'Every harvest inspected and graded to international standards.'], ['box', '3  Packing', 'Packed with care in food-safe materials.'], ['truck', '4  Delivery', 'On time, in perfect condition, to markets worldwide.']] },
  products: { eyebrow: 'What we grow', title: ['Our products.'], bg: [`${WEB}/beans-bunch.webp`, '50% 50%'], light: true, vis: [`${WEB}/beans-tray.webp`, '50% 50%'], items: [
    ['leaf', 'Haricot Verts', 'Extra fine and fine, tender and dependable.'], ['leaf', 'Mangetouts', 'Flat-podded peas, excellent fibre.'], ['leaf', 'Sugar Snaps', 'Crisp and sweet.'], ['leaf', 'Baby Corn', 'Fresh, tray-packed.'], ['sun', 'Fruits and herbs', 'Avocados, mangoes, passion fruit, chillies, rosemary, chives.']] },
  hygiene: { eyebrow: 'Every worker, every day', title: ['Clean hands.', 'Safe food.'], bg: [`${WEB}/hero-workers-2.webp`, '50% 35%'], vis: [`${WEB}/hero-workers-2.webp`, '50% 55%'], items: [
    ['hands', 'Wash your hands', 'Before you start, after every break, and after using the toilet.'], ['hair', 'Hair net and clean coat', 'Hair fully covered. Clean coat on and buttoned. Closed shoes.'], ['ring', 'No jewellery, watches or phones', 'Leave them in your locker.'], ['noeat', 'No eating, drinking or smoking', 'Only in the rest area.'], ['plaster', 'Cut or unwell? Tell your supervisor', 'Cover cuts with a blue plaster.'], ['sparkle', 'Keep your table clean', 'Clear waste, wipe down, crates off the floor.']] },
  quality: { eyebrow: 'Our standard', title: ['Grade it.', 'Pack it.', 'Trace it.'], bg: [`${WEB}/hero-workers.webp`, '50% 55%'], vis: [U('beans2.jpg'), '50% 55%'], items: [
    ['search', 'Check every pod', 'Fresh, firm, bright green. Remove anything damaged or off-colour.'], ['layers', 'Sort by grade', 'Beans: extra fine and fine. Keep each grade separate.'], ['box', 'Pack to specification', 'Right weight, right pack, right count.'], ['tag', 'Label and record', 'Correct label on every carton. Traceability starts with you.'], ['sun', 'Keep it cool', 'Never leave produce in the sun.']] },
  safety: { eyebrow: 'Look after yourself and each other', title: ['Safety first,', 'always.'], bg: [`${WEB}/about/packhouse.jpg`, '45% 50%'], vis: [U('crates.jpg'), '50% 40%'], items: [
    ['lift', 'Lift with your legs', 'Bend your knees, keep your back straight.'], ['stack', 'Stack crates safely', 'Straight and stable, never above the marked line.'], ['walk', 'Keep walkways clear', 'No crates or bags in the aisles. Walk, never run.'], ['alert', 'Wet floor? Clean it up', 'Wipe up spills at once.'], ['exit', 'Know your exits', 'Find the nearest fire exit. Never block a door.'], ['users', 'Report every accident', 'Tell your supervisor straight away.']] },
  promise: { eyebrow: 'Why choose us', title: ['Quality.', 'Reliability.', 'Trust.'], bg: [`${WEB}/hero-workers-2.webp`, '50% 30%'], dark: true, vis: [`${WEB}/export-pallet-strapped.webp`, '50% 40%'], items: [
    ['shield', 'Premium quality', 'Carefully selected and graded to the highest international standards.'], ['leaf', 'Food safety', 'Strict quality control and full traceability at every step.'], ['truck', 'Reliable supply', 'Consistent volumes and on-time delivery.'], ['users', 'Partnership', 'Long-term relationships built on trust, integrity and service.']] },
  crates: { eyebrow: 'Look after every crate', title: ['Crates:', 'handle with care.'], bg: [`${WEB}/about/packhouse.jpg`, '45% 50%'], vis: [U('trays.jpg'), '50% 50%'], items: [
    ['stack', 'Stack straight', 'Same-size crates together, never above the marked line.'], ['box', 'Fill, do not overfill', 'Keep the top clear so produce is never crushed.'], ['sparkle', 'Clean crates only', 'No cracks, dirt or old produce.'], ['lift', 'Lift together', 'Full crates are heavy. Ask for help.'], ['layers', 'Crates off the floor', 'Use pallets or racks.']] },
  packed: { eyebrow: 'Packed for export', title: ['Packed. Palletised.', 'Ready to fly.'], bg: [`${WEB}/export-haricot-warehouse.webp`, '50% 30%'], dark: true, vis: [`${WEB}/export-haricot-pallet.webp`, '50% 45%'], items: [
    ['box', 'Branded cartons', 'Graded and packed before it leaves our export office.'], ['layers', 'Built into pallets', 'Strapped and corner-protected for the journey.'], ['truck', 'Ready to ship', 'Haricot verts and mangetouts, on time.'], ['tag', 'Fully traceable', 'From the farm to the final delivery.']] },
  markets: { eyebrow: 'From Nairobi to your market', title: ['Nairobi to the', "world's tables."], bg: [`${WEB}/beans-bunch.webp`, '50% 50%'], light: true, vis: [`${PH}/globe.png`, '50% 50%', 'contain'], items: [
    ['pin', 'France', 'Paris'], ['pin', 'Netherlands', 'Amsterdam'], ['pin', 'Switzerland', 'Zurich'], ['shield', 'GlobalG.A.P.', 'Good agricultural practice, from farm to harvest.'], ['users', 'SMETA', 'Ethical trade audit: labour, safety, environment.']] },
};

// narrow strips: single message
const STRIPS = {
  hands: ['hands', ['Wash', 'your', 'hands'], 'Before you start, after every break, and after the toilet.', [`${WEB}/hero-workers-2.webp`, '50% 55%']],
  lift: ['lift', ['Lift', 'with your', 'legs'], 'Bend your knees, keep your back straight. Ask for help.', [U('crates.jpg'), '50% 40%']],
  hair: ['hair', ['Hair net', 'and clean', 'coat'], 'Hair fully covered, coat buttoned, closed shoes.', [`${WEB}/hero-workers.webp`, '50% 45%']],
  walk: ['walk', ['Keep', 'walkways', 'clear'], 'No crates, boxes or bags in the aisles.', [`${WEB}/about/packhouse.jpg`, '50% 50%']],
  exit: ['exit', ['Know', 'your', 'exits'], 'Never block a fire door or an exit route.', [U('truckload.jpg'), '50% 50%']],
  safe: ['shield', ['Safety', 'first,', 'always'], 'Look after yourself and each other.', [`${WEB}/beans-bunch.webp`, '50% 50%']],
  ring: ['ring', ['No', 'jewellery', 'or phones'], 'Leave them in your locker.', [U('packhouseA.jpg'), '50% 50%']],
};

// ---------- panels: room, no, w x h (cm), design ----------
const P = (room, no, w, h, kind, key) => ({ room, no, w, h, kind, key });
const PANELS = [
  P(1, 1, 120, 200, 'poster', 'welcome'), P(1, 2, 100, 200, 'poster', 'process'), P(1, 3, 114, 200, 'poster', 'hygiene'),
  P(1, 4, 118, 200, 'poster', 'quality'), P(1, 5, 116, 200, 'poster', 'safety'), P(1, 6, 52, 200, 'strip', 'hands'),
  P(1, 7, 57, 203, 'strip', 'lift'), P(1, 8, 121, 203, 'poster', 'products'), P(1, 9, 76, 187, 'poster', 'crates'),
  P(1, 10, 76, 187, 'poster', 'packed'), P(1, 11, 153, 21, 'banner', 'brand'), P(1, 12, 120, 203, 'poster', 'markets'),
  P(1, 13, 79, 191, 'poster', 'promise'), P(1, 14, 81, 16, 'banner', 'values'),
  P(2, 1, 145, 214, 'poster', 'process'), P(2, 2, 62, 214, 'strip', 'hair'), P(2, 3, 44, 203, 'strip', 'safe'),
  P(2, 4, 79, 184, 'poster', 'crates'), P(2, 5, 12, 203, 'thin', 'brand'), P(2, 6, 71, 203, 'strip', 'walk'),
  P(2, 7, 66, 203, 'strip', 'exit'), P(2, 8, 117, 203, 'poster', 'hygiene'), P(2, 9, 118, 203, 'poster', 'quality'),
  P(2, 10, 116, 203, 'poster', 'safety'), P(2, 11, 120, 200, 'poster', 'promise'), P(2, 12, 116, 240, 'poster', 'packed'),
  P(2, 13, 120, 240, 'poster', 'products'), P(2, 14, 128, 240, 'poster', 'markets'), P(2, 15, 23, 240, 'thin', 'brand'),
  P(2, 16, 116, 101, 'wide', 'hygiene'), P(2, 17, 120, 101, 'wide', 'quality'), P(2, 18, 120, 101, 'wide', 'safety'),
  P(2, 19, 23, 101, 'thin', 'brand'), P(2, 20, 236, 308, 'poster', 'welcome'), P(2, 21, 190, 173, 'wide', 'promise'),
];

// ---------- css ----------
const CSS = (w, h) => `
@page{size:${w}cm ${h}cm;margin:0}
:root{--g:#3f9b2f;--gd:#145a2c;--gm:#1d6b34;--gold:#ffb81c;--or:#f28c00;--mist:#fff7e0;--ink:#1d2a22}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}cm;height:${h}cm;overflow:hidden}
body{font-family:Montserrat,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p{width:${w}cm;height:${h}cm;position:relative;overflow:hidden;background:var(--mist);container-type:size;display:flex;flex-direction:column}
h1,h2,h3,.serif{font-family:'DM Serif Display',serif;font-weight:400}
svg{display:block}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.ov{position:absolute;inset:0}
.in{position:relative;z-index:1;display:flex;flex-direction:column;flex:1;min-height:0}
.brandbar{display:flex;align-items:center;gap:3cqw;background:linear-gradient(90deg,rgba(20,90,44,.95),rgba(20,90,44,.75));color:#fff;padding:0 5cqw;height:11cqw;flex:none}
.brandbar img{height:7.4cqw;width:7.4cqw;border-radius:50%;background:#fff;object-fit:contain}
.brandbar b{font-size:4cqw;letter-spacing:.28em;text-transform:uppercase;font-weight:700;white-space:nowrap}
.brandbar small{margin-left:auto;font-size:2.1cqw;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:600;white-space:nowrap}
.foot{flex:none;display:flex;align-items:center;justify-content:center;height:7cqw;background:linear-gradient(90deg,rgba(242,140,0,.96),rgba(255,184,28,.85));color:#fff}
.foot b{font:400 3.6cqw 'DM Serif Display',serif;white-space:nowrap}
.eyebrow{font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:var(--or)}
.wht{color:#fff;text-shadow:0 .3cqw 1.6cqw rgba(0,0,0,.35)}
.glass{background:rgba(255,255,255,.9);border:.4cqw solid rgba(255,255,255,.75);border-radius:2.4cqw}
.ico{border-radius:50%;background:var(--or);color:#fff;display:grid;place-items:center;flex:none}
.ico svg{width:58%;height:58%}
.photo{border-radius:2.4cqw;overflow:hidden;border:.8cqw solid #fff;background-size:cover;background-position:center;box-shadow:0 .8cqw 2.5cqw rgba(0,0,0,.25);flex:none}
.rule{display:flex;align-items:center;gap:3.4cqw;padding:0 3.6cqw;flex:1 1 0;min-height:0;max-height:26cqw}
.rule h3{line-height:1.05;color:var(--gm)}
.rule p{line-height:1.3;font-weight:500;color:#33403a}
`;

const dkOv = (a) => `linear-gradient(180deg,rgba(20,90,44,${a}) 0%,rgba(20,90,44,${a - .05}) 30%,rgba(255,247,224,.9) 52%,rgba(255,247,224,.95) 100%)`;
const bgFor = (t) => `<div class="bg" style="background-image:url(${t.bg[0]});background-position:${t.bg[1]}"></div><div class="ov" style="background:${t.light ? 'linear-gradient(180deg,rgba(255,247,224,.95),rgba(255,247,224,.9))' : t.dark ? 'linear-gradient(180deg,rgba(20,90,44,.78),rgba(20,90,44,.92))' : dkOv(.55)}"></div>`;
const head = () => `<div class="brandbar" style="justify-content:center"><span style="width:14cqw;height:.7cqw;border-radius:1cqw;background:var(--gold)"></span><span style="display:grid;place-items:center;width:7cqw;height:7cqw;border-radius:50%;background:var(--gold);color:var(--gd)"><span style="width:60%;height:60%;display:block">${ICON.leaf}</span></span><span style="width:14cqw;height:.7cqw;border-radius:1cqw;background:var(--gold)"></span></div>`;
const foot = () => `<div class="foot"><b>Fresh from Kenya to the World</b></div>`;
const maxLen = (lines) => Math.max(...lines.map((l) => l.length));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const titleSize = (lines, avail, cap) => Math.min(cap, avail / (maxLen(lines) * 0.52));
// text is white when the headline sits on the dark upper part of the photo
const hOn = (t) => (t.light ? 'color:var(--gm)' : 'color:#fff;text-shadow:0 .3cqw 1.6cqw rgba(0,0,0,.35)');
const eOn = (t) => (t.light ? '' : 'color:var(--gold)');
const lightSheet = (t) => t.light;

const rule = (it, S) => `<div class="glass rule"><div class="ico" style="width:${S.ic}cqw;height:${S.ic}cqw">${ICON[it[0]]}</div><div style="min-width:0"><h3 style="font-size:${S.h}cqw">${it[1]}</h3><p style="font-size:${S.p}cqw;margin-top:.6cqw">${it[2]}</p></div></div>`;

// ---------- layouts ----------
function poster(p) {
  const t = THEMES[p.key]; const H = (100 * p.h) / p.w;
  const fs = titleSize(t.title, 90, H > 190 ? 12 : 11);
  const titleH = 4.5 + t.title.length * fs * 1.02 + 3;
  const gap = 2.6;
  const avail = H - 11 - 7 - titleH - gap * 4;
  const visH = clamp(avail * (t.vis[2] === 'contain' ? 0.48 : 0.34), 28, t.vis[2] === 'contain' ? 90 : 62);
  const listH = avail - visH;
  const n = clamp(Math.floor(listH / 21), 2, t.items.length);
  const items = t.items.slice(0, n);
  const per = listH / n; // cqw per card
  const S = { ic: clamp(per * 0.52, 8, 15), h: clamp(per * 0.19, 3.2, 5.2), p: clamp(per * 0.125, 2.4, 3.6) };
  const vis = t.vis[2] === 'contain'
    ? `<div style="height:${visH}cqw;margin:0 5cqw;flex:none;background:url(${t.vis[0]}) center/contain no-repeat"></div>`
    : `<div class="photo" style="height:${visH}cqw;margin:0 5cqw;background-image:url(${t.vis[0]});background-position:${t.vis[1]}"></div>`;
  return `${bgFor(t)}<div class="in">${head()}
  <div style="padding:${gap + 1}cqw 5cqw 0;flex:none"><div class="eyebrow" style="font-size:2.3cqw;${eOn(t)}">${t.eyebrow}</div>
  <h1 style="font-size:${fs}cqw;line-height:1.02;margin-top:1cqw;${hOn(t)}">${t.title.join('<br>')}</h1></div>
  <div style="height:${gap}cqw;flex:none"></div>${vis}
  <div style="flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:${gap}cqw;padding:${gap}cqw 5cqw ${gap}cqw">${items.map((i) => rule(i, S)).join('')}</div>
  ${foot()}</div>`;
}

function wide(p) {
  const t = THEMES[p.key]; const fs = titleSize(t.title, 50, 8);
  const S = { ic: 7.5, h: 3, p: 2 };
  return `${bgFor({ ...t, light: true })}<div class="in">${head()}
  <div style="flex:1;min-height:0;display:flex;gap:4cqw;padding:3.5cqw 5cqw 3.5cqw">
    <div class="photo" style="width:34cqw;background-image:url(${t.vis[0]});background-position:${t.vis[1]}"></div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:1.6cqw"><div class="eyebrow" style="font-size:1.9cqw">${t.eyebrow}</div>
      <h1 style="font-size:${fs}cqw;line-height:1.02;color:var(--gm);margin-bottom:.6cqw">${t.title.join('<br>')}</h1>
      ${t.items.slice(0, 2).map((i) => rule(i, S)).join('')}</div>
  </div>${foot()}</div>`;
}

function strip(p) {
  const [icon, words, desc, ph] = STRIPS[p.key]; const H = (100 * p.h) / p.w;
  const fs = Math.min(18, 84 / (maxLen(words) * 0.52));
  return `<div class="bg" style="background-image:url(${ph[0]});background-position:${ph[1]}"></div><div class="ov" style="background:linear-gradient(180deg,rgba(20,90,44,.9),rgba(20,90,44,.82) 45%,rgba(255,247,224,.95) 70%)"></div>
  <div class="in" style="padding:8cqw 8cqw 0;align-items:center;text-align:center">
    <div class="ico" style="width:56cqw;height:56cqw">${ICON[icon]}</div>
    <h1 class="wht" style="font-size:${fs}cqw;line-height:1.03;margin-top:9cqw;color:#fff">${words.join('<br>')}</h1>
    <div style="width:30cqw;height:1.4cqw;background:var(--gold);border-radius:1cqw;margin:8cqw 0"></div>
    <p style="font-size:${clamp(fs * 0.5, 6.5, 9)}cqw;line-height:1.3;font-weight:600;color:var(--gd);margin-top:auto;padding-bottom:6cqw;${H > 330 ? '' : ''}">${desc}</p>
  </div>
  <div class="foot" style="position:relative;z-index:1;height:auto;padding:6cqw 3cqw;flex-direction:column;gap:2cqw;text-align:center"><div class="ico" style="width:34cqw;height:34cqw;background:#fff;color:var(--or)">${ICON.leaf}</div></div>`;
}

function thin(p) {
  const H = (100 * p.h) / p.w;
  const fs = Math.min(40, (H - 190) / (29 * 0.5));
  return `<div class="bg" style="background:linear-gradient(180deg,var(--gd),var(--gm))"></div>
  <div class="in" style="align-items:center;justify-content:space-between;padding:10cqw 0">
    <div class="ico" style="width:70cqw;height:70cqw;background:var(--gold);color:var(--gd)">${ICON.leaf}</div>
    <div class="serif" style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:${fs}cqw;color:#fff;letter-spacing:.04em;white-space:nowrap;line-height:1">Fresh from Kenya <span style="color:var(--gold)">to the World</span></div>
    <div class="ico" style="width:70cqw;height:70cqw;background:var(--or)">${ICON.globe}</div>
  </div>`;
}

function banner(p) {
  const brand = p.key === 'brand';
  const dotc = (c) => `<span style="width:10cqh;height:10cqh;border-radius:50%;background:${c};flex:none"></span>`;
  const leaf = `<div class="ico" style="width:84cqh;height:84cqh;background:var(--gold);color:var(--gd)">${ICON.leaf}</div>`;
  if (brand) return `<div class="bg" style="background:linear-gradient(90deg,var(--gd),var(--gm) 60%,var(--gd))"></div>
  <div class="in" style="flex-direction:row;align-items:center;justify-content:space-between;padding:0 4cqh;gap:6cqh">${leaf}<div class="serif" style="font-size:38cqh;color:#fff;white-space:nowrap;text-align:center">Fresh from Kenya <span style="color:var(--gold)">to the World</span></div>${leaf}</div>`;
  return `<div class="bg" style="background:linear-gradient(90deg,var(--gd),var(--gm) 60%,var(--gd))"></div>
  <div class="in" style="flex-direction:row;align-items:center;justify-content:center;gap:8cqh">${['Quality', 'Reliability', 'Trust'].map((x, i) => `${i ? dotc('var(--gold)') : ''}<span class="serif" style="font-size:36cqh;color:#fff;white-space:nowrap">${x}</span>`).join('')}</div>`;
}

const LAYOUT = { poster, wide, strip, thin, banner };
const name = (p) => `R${p.room}-${String(p.no).padStart(2, '0')}_${p.w}x${p.h}cm`;
for (const p of PANELS) {
  const inner = LAYOUT[p.kind](p);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${name(p)}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS(p.w, p.h)}</style></head><body><section class="p" data-w="${p.w}" data-h="${p.h}">${inner}</section></body></html>`;
  fs.writeFileSync(`${OUT}/${name(p)}.html`, html);
}
fs.writeFileSync(`${OUT}/panels.json`, JSON.stringify(PANELS.map((p) => ({ ...p, file: name(p) })), null, 1));
console.log('wrote', PANELS.length, 'panel pages');
