// A4-landscape folded brochure (4 x A5 portrait pages) from config.json
//   node build-brochure.js  -> brochure/print.html (2 A4 landscape sheets, imposed) + brochure/pages.html (4 x A5 in reading order)
const fs = require('fs'), path = require('path');
const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const d = new Date(C.dateISO + 'T12:00:00');
const ord = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
const WD = d.toLocaleDateString('en-GB', { weekday: 'long' }), MON = d.toLocaleDateString('en-GB', { month: 'long' });
const DATE_LONG = `${WD} ${ord(d.getDate())} ${MON} ${d.getFullYear()}`;
const I = f => 'file://' + path.join(__dirname, 'img/' + f);
const gold = 'linear-gradient(135deg,#a8770a,#f3d77a 45%,#b8860b 70%,#e8c765)';
const cross = (w = 9) => `<svg viewBox="0 0 40 56" style="height:${w}mm;width:auto" aria-hidden="true"><defs><linearGradient id="g${w}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8770a"/><stop offset=".5" stop-color="#f3d77a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs><path fill="url(#g${w})" d="M17 0h6v16h14v6H23v34h-6V22H3v-6h14z"/></svg>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const CSS = `
:root{--cream:#fffbea;--ink:#2a2418;--soft:#5f5646;--gold:#b8860b;--gold2:#e8c765;--green:#1f3b24;--serif:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Snell Roundhand',cursive;--sans:'Montserrat','Helvetica Neue',Arial,sans-serif}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;background:#777}
.sheet{width:297mm;height:210mm;display:flex;page-break-after:always;margin:0 auto;overflow:hidden}.sheet:last-child{page-break-after:auto}
.pgs .panel{margin:0 auto;page-break-after:always}.pgs .panel:last-child{page-break-after:auto}
.panel{position:relative;width:148.5mm;height:210mm;overflow:hidden;background:var(--cream);color:var(--ink);font-family:var(--sans);text-align:center;flex:none}
.bg{position:absolute;inset:0;background-repeat:no-repeat;background-size:cover}
.veil{position:absolute;inset:0;background:rgba(255,251,235,.82)}
.frame{position:absolute;inset:6mm;border:.9mm solid var(--gold);pointer-events:none}.frame:after{content:"";position:absolute;inset:1.6mm;border:.3mm solid var(--gold2)}
.in{position:absolute;inset:12mm 12mm 12mm}
.eyebrow{font:700 7pt var(--sans);letter-spacing:.26em;text-transform:uppercase;color:var(--gold)}
h2{font:700 20pt/1.1 var(--serif);letter-spacing:.04em;text-transform:uppercase;margin:2mm 0 0}
.rule{width:22mm;height:.7mm;margin:3mm auto;background:${gold}}
.script{font:400 40pt/1.2 var(--script);color:var(--gold)}
/* cover */
.cover{background:var(--green)}
.cover .render{position:absolute;left:0;right:0;top:0;height:83mm;background:url(${I('render.jpg')}) center/cover no-repeat}
.cover .chip{position:absolute;background:rgba(31,59,36,.86);color:#f6e7b0;font:700 6.6pt var(--sans);letter-spacing:.22em;padding:1.8mm 4mm;border-radius:99mm;border:.3mm solid var(--gold2)}
.cover .c1{top:5mm;left:50%;transform:translateX(-50%)}.cover .c2{bottom:4mm;left:5mm}
.cover .today{position:absolute;left:0;right:0;top:83mm;padding:2.6mm 0 0;border-top:.8mm solid var(--gold2)}
.cover .lab{font:700 6.4pt var(--sans);letter-spacing:.24em;color:var(--gold2);padding:0 5mm 1.8mm;text-align:left}
.cover .strip{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2mm}.cover .strip div{height:33mm;background-size:cover;background-position:center}
.cover .body{position:absolute;left:0;right:0;top:125mm;bottom:0;padding:0 10mm;color:#fff}
.cover .church{font:700 11.5pt/1.25 var(--serif);letter-spacing:.08em;text-transform:uppercase;color:#fff}
.cover .inv{font:500 8pt var(--sans);color:#e9dfba;margin-top:2.2mm}
.cover .line{display:flex;align-items:flex-end;gap:2mm;margin:1.5mm 2mm 0;font:500 6.6pt var(--sans);color:#e9dfba;text-align:left}.cover .line span{flex:none}.cover .line i{flex:1;border-bottom:.3mm dotted #e9dfba;height:5mm}
.cover .place{font:600 6.8pt var(--sans);letter-spacing:.26em;color:var(--gold2);margin-top:1mm}
.cover .script{font-size:34pt;color:#f3d77a;line-height:1.2;margin-top:1mm}
.cover .head{font:600 11.5pt/1.25 var(--serif);margin:0 auto;max-width:118mm}
.cover .date{margin:2.8mm auto 0;display:inline-block;padding:2mm 6mm;border-top:.3mm solid var(--gold2);border-bottom:.3mm solid var(--gold2)}
.cover .date b{display:block;font:700 12pt var(--serif);letter-spacing:.04em}.cover .date span{font:500 7.5pt var(--sans);color:#e9dfba}
/* invitation page */
.dear{font:600 13pt var(--serif);margin:1mm 0 0}
.sub2{font:600 6.4pt var(--sans);letter-spacing:.24em;color:var(--gold);margin-top:1.5mm}
.line2{display:flex;align-items:flex-end;gap:2mm;margin:2mm 4mm 0;font:500 7.5pt var(--sans);text-align:left}.line2 span{flex:none}.line2 i{flex:1;border-bottom:.35mm dotted var(--ink);height:6mm}
.box em{font-style:normal;color:var(--soft)}
.p{font:500 10pt/1.6 var(--sans);color:var(--ink);margin:0 auto;max-width:112mm}
.box{margin:4.5mm auto 0;background:rgba(255,255,255,.78);border:.35mm solid var(--gold);padding:3.5mm 4mm;text-align:left;font:500 8.8pt/1.5 var(--sans)}
.box div{display:flex;gap:3mm;padding:.8mm 0}.box b{flex:none;width:22mm;font:700 6.8pt var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--gold);padding-top:.5mm}
h3{font:700 7.5pt var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin:5.5mm 0 3mm}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}.steps div{font:500 8.4pt/1.45 var(--sans)}
.steps b{display:flex;width:8mm;height:8mm;margin:0 auto 1.8mm;border-radius:50%;background:#a8770a;color:#fff;font:700 10pt var(--sans);align-items:center;justify-content:center}
.rsvp{display:flex;justify-content:center;gap:7mm;font:500 9.4pt/1.5 var(--sans)}.rsvp b{display:block;font:700 6.5pt var(--sans);letter-spacing:.2em;color:var(--gold)}
.verse{font:italic 500 11.5pt/1.3 var(--serif);color:var(--soft);margin-top:5mm}.verse small{display:block;font:600 6pt var(--sans);font-style:normal;letter-spacing:.16em}
/* tables */
.bh{font:700 15pt/1.1 var(--serif);letter-spacing:.05em;text-transform:uppercase}
.bs{font:500 7.2pt var(--sans);color:var(--soft);margin:1mm 0 3.5mm}
.t{width:100%;border-collapse:collapse;font:500 9pt var(--sans)}
.t th{background:var(--ink);color:#fff6d8;font:700 6.6pt var(--sans);letter-spacing:.08em;text-transform:uppercase;padding:1.8mm 1mm;border:.3mm solid var(--ink)}
.t td{border:.3mm solid #5b5340;background:rgba(255,255,255,.72);height:10.1mm;padding:0 1.5mm;text-align:left}
.t .n{width:10mm;text-align:center;color:var(--gold);font-weight:700;font-size:8pt}.t .a{width:32mm}
.more{font:500 7pt var(--sans);color:var(--soft);margin-top:2.5mm;text-align:right;font-style:italic}
.tot{display:grid;grid-template-columns:1fr 1fr;gap:4mm 5mm;margin-top:4mm;text-align:left;font:600 8pt var(--sans)}
.tot div{display:flex;gap:2mm;align-items:flex-end;border-bottom:.35mm solid var(--ink);height:8mm}
.tot .big{grid-column:1/3;background:#fbf1c9;border:.5mm solid var(--gold);padding:0 3mm;height:10mm;align-items:center;font-size:10pt}
.thx{font:400 30pt/1.1 var(--script);color:var(--gold);margin-top:4mm}.cn{font:500 7.3pt/1.4 var(--sans);color:var(--soft);margin-top:0}
.fine{font:500 6.8pt/1.5 var(--sans);color:var(--soft);margin-top:3mm}
`;

const bgFor = (f, pos = 'center') => `background-image:url(${I(f)});background-position:${pos}`;
const rows = (from, n) => Array.from({ length: n }, (_, i) => `<tr><td class="n">${from + i}</td><td></td><td></td></tr>`).join('');
const table = (from, n) => `<table class="t"><thead><tr><th class="n">No.</th><th>Name of contributor</th><th class="a">Amount (KES)</th></tr></thead><tbody>${rows(from, n)}</tbody></table>`;
const wrap = (cls, inner, bg) => `<div class="panel ${cls}"><div class="bg" style="${bg}"></div><div class="veil"></div><div class="frame"></div><div class="in">${inner}</div></div>`;
const guests = () => {
  const g = [];
  if (C.guestOfHonour) g.push(`<div><b>Guest of honour</b><span>${esc(C.guestOfHonour)}${C.assistedBy ? ', assisted by ' + esc(C.assistedBy) : ''}</span></div>`);
  if (C.otherGuests.length) g.push(`<div><b>Guests</b><span>${C.otherGuests.map(esc).join(' · ')}</span></div>`);
  return g.join('');
};

// 1 FRONT COVER: the vision (render) + where we are today (3 photos) + title
const p1 = `<div class="panel cover"><div class="render"><div class="chip c1">HARAMBEE ${d.getFullYear()}</div><div class="chip c2">OUR VISION · THE COMPLETED CHURCH</div></div>
<div class="today"><div class="lab">WHERE WE ARE TODAY</div><div class="strip"><div style="background-image:url(${I('exterior.jpg')})"></div><div style="background-image:url(${I('porch.jpg')});background-position:45% 50%"></div><div style="background-image:url(${I('interior.jpg')})"></div></div></div>
<div class="body"><div class="church">${esc(C.church)}<br>${esc(C.project)}</div><div class="place">${esc(C.place.toUpperCase())}</div>
<div class="inv">cordially invite</div><div class="line"><span>${esc(C.inviteeLine)}</span><i></i></div>
<div class="script">${esc(C.eventName)}</div>
<div class="head">Fundraising towards completion, finishing and equipping of the Church and ICT Hub</div>
<div class="date"><b>${esc(DATE_LONG)}</b><span>${esc(C.venue)}${C.time ? ' · ' + esc(C.time) : ''}</span></div></div></div>`;

// 2 INSIDE LEFT – the invitation
const p2 = wrap('p2', `
<div class="eyebrow">You are invited</div>
<h2 style="font-size:12.5pt;line-height:1.3;letter-spacing:.06em;margin-top:3mm">${esc(C.church)}<br>${esc(C.project)}</h2>
<div class="sub2">${esc(C.place.toUpperCase())}</div><div class="rule"></div>
<div class="dear">cordially invite</div>
<div class="line2"><span>${esc(C.inviteeLine)}</span><i></i></div>
<p class="p" style="margin-top:4mm">To a fundraising towards ${esc(C.purpose)}.</p>
<p class="p" style="margin-top:2.5mm">The fund drive will be held on <b>${esc(DATE_LONG)}</b> in the church’s Precinct, Gongo.</p>
${C.guestOfHonour ? `<div class="box"><div><b>Guest of honour will be</b><span><strong>${esc(C.guestOfHonour)}</strong>${C.assistedBy ? `<br><em>Assisted by</em> <strong>${esc(C.assistedBy)}</strong>` : ''}</span></div>${C.otherGuests.length ? `<div><b>Other guests</b><span>${C.otherGuests.map(esc).join(' · ')}</span></div>` : ''}</div>` : ''}
<h3>How to take part</h3>
<div class="steps"><div><b>1</b>Take this card and share it with family and friends</div><div><b>2</b>Write each giver’s name and amount on the next pages</div><div><b>3</b>Bring the card to church on ${esc(ord(d.getDate()))} ${esc(MON)}</div></div>
<h3>R.S.V.P</h3>
<div class="rsvp">${C.rsvp.map(r => `<div><b>${esc(r.name.toUpperCase())}</b>${esc(r.phone)}</div>`).join('')}</div>
<div class="verse">“${esc(C.verse)}”<small>${esc(C.verseRef.toUpperCase())}</small></div>`, bgFor('render.jpg', '50% 60%'));

// 3 INSIDE RIGHT – contribution entries (1)
const N3 = 14, N4 = 12;
const p3 = wrap('p3', `
<div class="eyebrow">Gifts from family &amp; friends</div><h2 style="font-size:16pt">Contribution entries</h2><p class="bs">Write the name of each giver and the amount given</p>
${table(1, N3)}<div class="more">continued overleaf →</div>`, bgFor('exterior.jpg', '40% 60%'));

// 4 BACK COVER – entries (2), totals, thanks
const p4 = wrap('p4', `
<div class="eyebrow">Contribution entries (continued)</div>
${table(N3 + 1, N4)}
<div class="tot"><div class="big"><span>Total this card: KES</span></div><div><span>Collected by:</span></div><div><span>Phone:</span></div></div>
<div class="thx">Thank you</div><div class="cn">Every gift, big or small, helps us complete, finish and equip the Church and ICT Hub.</div>
<div class="fine">${esc(C.church)} ${esc(C.project)}<br>${esc(C.place)}<br>${C.rsvp.map(r => esc(r.name) + ' ' + esc(r.phone)).join(' · ')}</div>`, bgFor('interior.jpg', '8% 50%'));

const head = t => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${t}</title>${FONTS}<style>${CSS}`;
// print: sheet 1 (outside) = [back | front], sheet 2 (inside) = [p2 | p3]; flip on short edge
const print = head('Musanda Harambee brochure – print (A4 landscape)') + `@page{size:297mm 210mm;margin:0}</style></head><body>
<div class="sheet">${p4}${p1}</div><div class="sheet">${p2}${p3}</div></body></html>`;
const pages = head('Musanda Harambee brochure – pages (A5)') + `@page{size:148.5mm 210mm;margin:0}</style></head><body class="pgs">${p1}${p2}${p3}${p4}</body></html>`;
fs.mkdirSync(path.join(__dirname, 'brochure'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'brochure/print.html'), print);
fs.writeFileSync(path.join(__dirname, 'brochure/pages.html'), pages);
console.log('brochure built:', DATE_LONG, '| entries:', N3 + N4);
