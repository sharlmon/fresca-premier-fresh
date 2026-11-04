// Builds the Musanda Harambee cards from config.json
//   node build.js            -> ecard/ (invite page + link generator) and print/card-a4.html
//   ./build-pdf.sh           -> also renders print/Musanda-Harambee-Card-A4.pdf
const fs = require('fs'), path = require('path');
const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const d = new Date(C.dateISO + 'T12:00:00');
const WD = d.toLocaleDateString('en-GB', { weekday: 'long' });
const DAY = d.getDate(), MON = d.toLocaleDateString('en-GB', { month: 'long' }), YR = d.getFullYear();
const ord = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
const DATE_LONG = `${WD} ${ord(DAY)} ${MON} ${YR}`;
const wa = p => '254' + p.replace(/^0/, '');
const gold = 'linear-gradient(135deg,#b8860b,#f3d77a 45%,#a8770a 70%,#e8c765)';

// laurel branch drawn as SVG (stem + leaves), gold gradient
function branch(id) {
  let leaves = '';
  for (let i = 0; i < 9; i++) {
    const t = i / 8, x = 14 + t * 150, y = 120 - Math.sin(t * 1.6) * 70 - t * 10;
    const s = 1 - t * 0.45;
    leaves += `<ellipse cx="${x - 4}" cy="${y - 14 * s}" rx="${6 * s}" ry="${15 * s}" transform="rotate(${-35 - t * 20} ${x} ${y})"/>`;
    leaves += `<ellipse cx="${x + 5}" cy="${y + 12 * s}" rx="${6 * s}" ry="${15 * s}" transform="rotate(${40 - t * 20} ${x} ${y})"/>`;
  }
  return `<svg viewBox="0 0 190 150" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8770a"/><stop offset=".5" stop-color="#f3d77a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs><g fill="url(#${id})"><path d="M10 128 Q70 95 168 40" stroke="url(#${id})" stroke-width="2.4" fill="none"/>${leaves}</g></svg>`;
}
const cross = `<svg viewBox="0 0 40 56" width="34" aria-hidden="true"><defs><linearGradient id="gx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8770a"/><stop offset=".5" stop-color="#f3d77a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs><path fill="url(#gx)" d="M17 0h6v16h14v6H23v34h-6V22H3v-6h14z"/></svg>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">`;
const TOKENS = `:root{--cream:#fffdf2;--ink:#2a2418;--soft:#6b6150;--gold:#b8860b;--gold2:#e8c765;--green:#2f5a30;--serif:'Cormorant Garamond',Georgia,serif;--script:'Great Vibes','Snell Roundhand',cursive;--sans:'Montserrat','Helvetica Neue',Arial,sans-serif}`;

const guestsBlock = () => {
  const g = [];
  if (C.guestOfHonour) g.push(`<p class="goh"><small>Guest of honour</small><b>${esc(C.guestOfHonour)}</b>${C.assistedBy ? `<span>assisted by <b>${esc(C.assistedBy)}</b></span>` : ''}</p>`);
  if (C.otherGuests.length) g.push(`<h4>Other guests</h4><ol class="og">${C.otherGuests.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`);
  return g.join('');
};
const rsvpBlock = (tag) => C.rsvp.map(r => tag(r)).join('');

/* ============================== E-CARD ============================== */
const ecard = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>You are invited – ${esc(C.eventName)} ${YR}</title><meta name="robots" content="noindex">
<meta property="og:title" content="You are invited: ${esc(C.eventName)} – ${esc(C.church)}"><meta property="og:description" content="${esc(DATE_LONG)} · ${esc(C.venue)}">
<meta name="theme-color" content="#fffdf2">${FONTS}
<style>${TOKENS}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:#efe6c8;font-family:var(--sans);color:var(--ink);min-height:100vh;display:flex;justify-content:center;padding:16px}
.card{position:relative;width:100%;max-width:520px;background:var(--cream);padding:46px 28px 34px;text-align:center;overflow:hidden;box-shadow:0 10px 40px rgba(90,70,10,.25)}
.card:before{content:"";position:absolute;inset:10px;border:2px solid var(--gold);pointer-events:none}
.card:after{content:"";position:absolute;inset:16px;border:1px solid var(--gold2);pointer-events:none}
.br{position:absolute;width:120px;opacity:.95}.br.tl{top:6px;left:2px}.br.rb{bottom:6px;right:2px;transform:rotate(180deg)}
.cross{margin-bottom:8px}
h1{font:700 21px/1.25 var(--serif);letter-spacing:.06em;margin:0;color:var(--ink)}
.sub{font:600 12px/1.5 var(--sans);letter-spacing:.2em;color:var(--gold);margin:6px 0 0}
.rule{width:70px;height:2px;margin:18px auto;background:${gold}}
.to{font:500 13px var(--sans);color:var(--soft);margin:0}
.name{font:700 30px/1.15 var(--serif);margin:6px 0 2px;color:var(--ink);word-break:break-word}
.script{font:400 56px/1 var(--script);color:var(--gold);margin:10px 0 2px}
.purpose{font:500 18px/1.45 var(--serif);margin:0 auto;max-width:360px}
.date{margin:22px auto 0;padding:14px 10px;border-top:1px solid var(--gold2);border-bottom:1px solid var(--gold2);max-width:380px}
.date b{display:block;font:700 24px var(--serif);letter-spacing:.02em}.date span{font:500 13px var(--sans);color:var(--soft)}
.count{margin:18px 0 0;font:600 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--green)}
.count em{font:700 34px var(--serif);font-style:normal;display:block;letter-spacing:0}
.goh{margin:22px 0 0}.goh small{display:block;font:600 10px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}.goh b{font:700 20px var(--serif)}.goh span{display:block;font:500 15px var(--serif)}
h4{font:600 10px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin:20px 0 6px}
.og{list-style:none;padding:0;margin:0;font:500 15px/1.6 var(--serif)}
.verse{font:italic 500 17px/1.4 var(--serif);margin:24px 0 0;color:var(--soft)}.verse small{display:block;font:600 10px var(--sans);font-style:normal;letter-spacing:.16em;margin-top:2px}
.btns{display:grid;gap:10px;margin:24px 0 0}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 16px;border-radius:999px;border:1.5px solid var(--green);background:var(--green);color:#fff;font:600 14px var(--sans);text-decoration:none;cursor:pointer}
.btn.alt{background:transparent;color:var(--green)}
.btn:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.rs{margin-top:22px}.rs p{margin:0 0 6px;font:600 10px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.welcome{font:400 40px var(--script);color:var(--gold);margin:22px 0 0}
@media(prefers-reduced-motion:no-preference){.card>*{animation:up .7s both}.card>*:nth-child(n){animation-delay:calc(var(--i,0)*70ms)}@keyframes up{from{opacity:0;transform:translateY(10px)}}}
</style></head><body>
<main class="card" id="card">
<div class="br tl">${branch('l1')}</div><div class="br rb">${branch('l2')}</div>
<div class="cross" style="--i:0">${cross}</div>
<h1 style="--i:1">${esc(C.church)}<br>${esc(C.project)}</h1>
<p class="sub" style="--i:1">${esc(C.place.toUpperCase())}</p>
<div class="rule"></div>
<p class="to" style="--i:2">cordially invites</p>
<p class="name" id="who" style="--i:2">you and your family</p>
<div class="script" style="--i:3">${esc(C.eventName)}</div>
<p class="purpose" style="--i:3">${esc(C.purpose)}</p>
<div class="date" style="--i:4"><b>${esc(DATE_LONG)}</b><span>${esc(C.venue)}${C.time ? ' · ' + esc(C.time) : ''}</span></div>
<p class="count" id="count" style="--i:5"></p>
${guestsBlock()}
<p class="verse">“${esc(C.verse)}”<small>${esc(C.verseRef.toUpperCase())}</small></p>
<div class="btns">
${C.rsvp.map((r, i) => `<a class="btn${i ? ' alt' : ''}" href="https://wa.me/${wa(r.phone)}?text=" data-wa="${wa(r.phone)}">Confirm attendance · ${esc(r.name)}</a>`).join('')}
<button class="btn alt" id="cal" type="button">Add to my calendar</button>
</div>
<div class="rs"><p>Enquiries</p>${C.rsvp.map(r => `<div><a href="tel:+${wa(r.phone)}" style="color:inherit;font:500 15px var(--serif)">${esc(r.name)} · ${esc(r.phone)}</a></div>`).join('')}</div>
<div class="welcome">Welcome</div>
</main>
<script>
(function(){
  var p=new URLSearchParams(location.search),to=(p.get('to')||'').trim().slice(0,80);
  if(to){document.getElementById('who').textContent=to;document.title='Invitation for '+to}
  var msg='Hello, this is '+(to||'a guest')+'. I confirm I will attend the ${esc(C.eventName)} on ${esc(DATE_LONG)}.';
  document.querySelectorAll('[data-wa]').forEach(function(a){a.href='https://wa.me/'+a.dataset.wa+'?text='+encodeURIComponent(msg)});
  var t=new Date(${d.getFullYear()},${d.getMonth()},${d.getDate()}),n=new Date();n.setHours(0,0,0,0);
  var days=Math.round((t-n)/864e5),c=document.getElementById('count');
  c.innerHTML=days>1?'<em>'+days+'</em>days to go':days===1?'<em>Tomorrow</em>':days===0?'<em>Today</em>':'';
  document.getElementById('cal').onclick=function(){
    var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Musanda//Harambee//EN','BEGIN:VEVENT','UID:musanda-harambee-${C.dateISO}@invite',
    'DTSTAMP:'+new Date().toISOString().replace(/[-:]|\\.\\d+/g,''),'DTSTART;VALUE=DATE:${C.dateISO.replace(/-/g, '')}',
    'SUMMARY:${esc(C.eventName)} – ${esc(C.church)}','LOCATION:${esc(C.venue)}\\, ${esc(C.place)}','DESCRIPTION:${esc(C.purpose)}','END:VEVENT','END:VCALENDAR'].join('\\r\\n');
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='Musanda-Harambee.ics';a.click();
  };
})();
</script></body></html>`;

/* ===================== LINK GENERATOR (for Lucas) ===================== */
const generator = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Invite link generator</title><meta name="robots" content="noindex">
<style>:root{--bg:#fbf8ee;--ink:#2a2418;--soft:#6b6150;--green:#2f5a30;--line:#e2d9b8}
@media(prefers-color-scheme:dark){:root{--bg:#1b1a14;--ink:#f1ead2;--soft:#b9b095;--green:#8fc48f;--line:#3a3727}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif;padding:16px}
main{max-width:760px;margin:0 auto}h1{font-size:22px;margin:8px 0}p{color:var(--soft);margin:4px 0 14px}
label{display:block;font-weight:600;margin:14px 0 4px}input,textarea{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;background:transparent;color:inherit;font:inherit}
textarea{min-height:160px}button,.b{min-height:44px;padding:10px 16px;border-radius:999px;border:1.5px solid var(--green);background:var(--green);color:#fff;font:600 14px system-ui;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.alt{background:transparent;color:var(--green)}
.item{border:1px solid var(--line);border-radius:12px;padding:12px;margin:10px 0}.item b{display:block}.item code{display:block;word-break:break-all;color:var(--soft);font-size:13px;margin:4px 0 8px}
:focus-visible{outline:3px solid #b8860b;outline-offset:2px}</style></head><body><main>
<h1>Harambee invitation links</h1><p>One name per line. Optionally add a phone number after a comma to send straight to that person on WhatsApp.</p>
<label for="base">Where the invitation page is hosted</label><input id="base" value="https://YOUR-SITE/invite/">
<label for="names">Names</label><textarea id="names" placeholder="Hon. Joyce Atieno Bensouda, 0712345678&#10;Dr. Benard Olayo&#10;Mr. and Mrs. Otieno"></textarea>
<div class="row"><button id="go" type="button">Make links</button><button id="all" class="alt" type="button">Copy all</button><button id="csv" class="alt" type="button">Download CSV</button></div>
<div id="out"></div>
<script>
var base=document.getElementById('base'),names=document.getElementById('names'),out=document.getElementById('out'),rows=[];
var MSG=function(n,l){return 'Dear '+n+', you are warmly invited to the ${esc(C.eventName)} of ${esc(C.church)} on ${esc(DATE_LONG)} at ${esc(C.venue)}. Your invitation: '+l};
function norm(p){p=p.replace(/\\D/g,'');return p.replace(/^0/,'254')}
document.getElementById('go').onclick=function(){
  out.innerHTML='';rows=[];
  names.value.split('\\n').map(function(s){return s.trim()}).filter(Boolean).forEach(function(line){
    var i=line.lastIndexOf(','),n=line,ph='';
    if(i>0&&/^[\\d\\s+]{9,}$/.test(line.slice(i+1).trim())){n=line.slice(0,i).trim();ph=norm(line.slice(i+1))}
    var link=base.value.replace(/\\?.*$/,'')+'?to='+encodeURIComponent(n).replace(/%20/g,'+');
    rows.push({n:n,ph:ph,link:link});
    var d=document.createElement('div');d.className='item';
    var wl='https://wa.me/'+ph+'?text='+encodeURIComponent(MSG(n,link));
    d.innerHTML='<b></b><code></code><div class="row"><button class="alt" type="button">Copy link</button>'+(ph?'<a class="b" target="_blank" rel="noopener">Send on WhatsApp</a>':'')+'</div>';
    d.querySelector('b').textContent=n;d.querySelector('code').textContent=link;
    d.querySelector('button').onclick=function(){navigator.clipboard.writeText(link)};
    if(ph)d.querySelector('a').href=wl;out.appendChild(d);
  });
};
document.getElementById('all').onclick=function(){navigator.clipboard.writeText(rows.map(function(r){return r.n+': '+r.link}).join('\\n'))};
document.getElementById('csv').onclick=function(){var c='Name,Phone,Link\\n'+rows.map(function(r){return [r.n,r.ph,r.link].map(function(x){return '"'+x.replace(/"/g,'""')+'"'}).join(',')}).join('\\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/csv'}));a.download='invitation-links.csv';a.click()};
</script></main></body></html>`;

/* ============================ PRINT A4 ============================ */
const TABLE_ROWS = 15;
const tbl = (start) => `<table class="t"><thead><tr><th class="n">No.</th><th>Name of contributor</th><th class="a">Amount (KES)</th></tr></thead><tbody>${Array.from({ length: TABLE_ROWS }, (_, i) => `<tr><td class="n">${start + i}</td><td></td><td></td></tr>`).join('')}</tbody></table>`;
const print = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Musanda Harambee card – A4</title>${FONTS}
<style>${TOKENS}
@page{size:210mm 297mm;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;background:#888}
.pg{position:relative;width:210mm;height:297mm;background:var(--cream);overflow:hidden;page-break-after:always;text-align:center;color:var(--ink);font-family:var(--sans);margin:0 auto}
.pg:last-child{page-break-after:auto}
.f1{position:absolute;inset:8mm;border:1.2mm solid #b8860b}
.f2{position:absolute;inset:12.5mm;border:.35mm solid var(--gold)}
.br{position:absolute;width:40mm}.tl{top:13.5mm;left:13.5mm}.rb{bottom:13.5mm;right:13.5mm;transform:rotate(180deg)}
.in{position:absolute;inset:24mm 24mm 38mm}
.cross{margin-top:2mm}
h1{font:700 19pt/1.2 var(--serif);letter-spacing:.04em;margin:3mm 0 0}
.sub{font:600 8.5pt var(--sans);letter-spacing:.24em;color:var(--gold);margin:2mm 0 0}
.rule{width:28mm;height:.7mm;margin:6mm auto;background:${gold}}
.inv{font:500 11pt var(--sans);color:var(--soft);margin:0}
.script{font:400 74pt/1 var(--script);color:var(--gold);margin:3mm 0 0}
.purpose{font:600 17pt/1.3 var(--serif);max-width:130mm;margin:1mm auto 0}
.date{margin:6mm auto 0;width:128mm;padding:5mm 0;border-top:.35mm solid var(--gold);border-bottom:.35mm solid var(--gold)}
.date b{display:block;font:700 22pt var(--serif)}.date span{font:500 10.5pt var(--sans);color:var(--soft)}
.name{margin:6mm auto 0;width:140mm;text-align:left;font:500 10pt var(--sans);color:var(--soft)}
.name i{display:block;border-bottom:.3mm dotted var(--ink);height:8mm;margin-top:0}
h3{font:700 9pt var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin:6mm 0 4mm}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;text-align:center}
.steps div{font:500 10pt/1.4 var(--sans)}
.steps b{display:flex;width:10mm;height:10mm;margin:0 auto 2.5mm;border-radius:50%;background:#a8770a;color:#fff;font:700 15pt/1 var(--sans);align-items:center;justify-content:center}
.verse{font:italic 500 14pt/1.3 var(--serif);color:var(--soft);margin:5mm 0 0}.verse small{display:block;font:600 7.5pt var(--sans);font-style:normal;letter-spacing:.18em;margin-top:1mm}
.foot{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:4mm}
.foot .rs{font:500 10.5pt/1.45 var(--sans)}.foot .rs b{display:block;font:700 9pt var(--sans);letter-spacing:.2em;color:var(--ink);margin-bottom:1mm}
.foot .wel{font:400 34pt var(--script);color:var(--gold);line-height:1}
/* back */
.bh{font:700 25pt var(--serif);letter-spacing:.05em;margin:3mm 0 0;text-transform:uppercase}
.bs{font:500 9.5pt var(--sans);color:var(--soft);margin:2mm 0 0}
.tw{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:7mm}
.t{width:100%;border-collapse:collapse;font:500 9pt var(--sans)}
.t th{background:var(--ink);color:#fff6d8;font:700 7.5pt var(--sans);letter-spacing:.06em;text-transform:uppercase;padding:2mm 1mm;border:.35mm solid var(--ink)}
.t td{border:.3mm solid #5b5340;height:10.3mm;padding:0 1.5mm;text-align:left;color:var(--soft)}
.t .n{width:9mm;text-align:center}.t .a{width:27mm}
.t td.n{color:var(--gold);font-weight:700}
.tot{display:grid;grid-template-columns:1.4fr 1fr;gap:6mm;margin-top:6mm;text-align:left;font:600 9.5pt var(--sans)}
.tot div{display:flex;align-items:flex-end;gap:2mm;border-bottom:.35mm solid var(--ink);height:9mm}.tot span{white-space:nowrap}
.tot .big{background:#fbf1c9;border:.5mm solid var(--gold);padding:0 3mm;height:11mm;align-items:center;font-size:11pt}
.thx{font:400 26pt var(--script);color:var(--gold);margin:5mm 0 0}.cn{font:500 8pt var(--sans);color:var(--soft);margin:0}
</style></head><body>
<section class="pg"><div class="f1"></div><div class="f2"></div><div class="br tl">${branch('p1')}</div><div class="br rb">${branch('p2')}</div>
<div class="in">
<div class="cross">${cross}</div>
<h1>${esc(C.church)}<br>${esc(C.project)}</h1><p class="sub">${esc(C.place.toUpperCase())}</p>
<div class="rule"></div>
<p class="inv">warmly invites you, your family and friends to the</p>
<div class="script">${esc(C.eventName)}</div>
<p class="purpose">${esc(C.purpose)}</p>
<div class="date"><b>${esc(DATE_LONG)}</b><span>${esc(C.venue)}${C.time ? ' · ' + esc(C.time) : ''}</span></div>
${guestsBlock() ? `<div style="margin-top:6mm">${guestsBlock()}</div>` : ''}
<div class="name">Card holder<i></i></div>
<h3>How to take part</h3>
<div class="steps"><div><b>1</b>Take this card and share it with your family and friends</div><div><b>2</b>Write each giver’s name and amount on the back</div><div><b>3</b>Bring your card to the church on ${esc(ord(DAY))} ${esc(MON)}</div></div>
<p class="verse">“${esc(C.verse)}”<small>${esc(C.verseRef.toUpperCase())}</small></p>
<div class="foot">${C.rsvp.map((r, i) => `<div class="rs" style="text-align:${i ? 'right' : 'left'}"><b>R.S.V.P</b>${esc(r.name)}<br>${esc(r.phone)}</div>`).join('').replace('</div><div', '</div><div class="wel">Welcome</div><div')}</div>
</div></section>
<section class="pg"><div class="f1"></div><div class="f2"></div><div class="br tl" style="width:34mm">${branch('p3')}</div><div class="br rb" style="width:34mm">${branch('p4')}</div>
<div class="in" style="inset:22mm 20mm 22mm">
<div class="cross" style="transform:scale(.8)">${cross}</div>
<div class="bh">Friends &amp; Family Contribution</div>
<p class="bs">${esc(C.eventName)} · ${esc(DATE_LONG)} · ${esc(C.place)}</p>
<div class="tw">${tbl(1)}${tbl(TABLE_ROWS + 1)}</div>
<div class="tot"><div><span>Collected by:</span></div><div><span>Phone:</span></div></div>
<div class="tot" style="grid-template-columns:1fr 1fr"><div class="big"><span>Total this card: KES</span></div><div><span>Signature:</span></div></div>
<div class="thx">Thank you</div><p class="cn">Every gift, big or small, builds the house of the Lord.</p>
</div></section></body></html>`;

const w = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
w(path.join(__dirname, 'ecard/invite/index.html'), ecard);
w(path.join(__dirname, 'ecard/generator.html'), generator);
w(path.join(__dirname, 'print/card-a4.html'), print);
console.log('built:', DATE_LONG);
