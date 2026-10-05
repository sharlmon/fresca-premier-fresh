const fs = require('fs'), QR = require('qrcode');
const OUT = '/Users/admin/Desktop/frescape/03_brochure/source';
const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  check: ic('<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>'),
  shield: ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  truck: ic('<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  users: ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  pin: ic('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  mail: ic('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  phone: ic('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  globe: ic('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
};
const folio = () => '';

const PEOPLE = {
  lucas: { slug: 'lucas', name: 'Lucas Omollo', role: 'Director', phone: '+254 726 262 679', email: 'lucas@frescapremierfresh.com', who: 'Director', other: 'Judy Ogolla, Commercial & Operations Manager · judy@frescapremierfresh.com' },
  judy: { slug: 'judy', name: 'Judy Ogolla', role: 'Commercial & Operations Manager', phone: '+254 731 615 135', email: 'judy@frescapremierfresh.com', who: 'Commercial & Operations Manager', other: 'Lucas Omollo, Director · lucas@frescapremierfresh.com' },
};
const THEME = process.env.THEME || '';

const BOLD = `
:root{--g:#3f9b2f;--gd:#1d6b34;--gold:#ffb81c;--orange:#f28c00;--mist:#fff7e0}
.cover{background:linear-gradient(135deg,#145a2c 0%,#2f9a3a 55%,#8fd13f 100%)}
.cover .blob{background:radial-gradient(circle at 30% 30%,#ffffff,#c9f08a);opacity:.16}
.cover h1{color:#fff;}
.cover .sub{color:var(--gold)}.cover .url{color:#fff}
.cover .logo{background:#fff;border-radius:26px;padding:12px 14px;width:190px;left:72px;top:56px;box-shadow:none}
.cover .right{box-shadow:none}
.cover .folio{background:var(--gold);color:#1d4f2b;box-shadow:0 0 0 3px #fff}
.about,.proc{background:var(--mist)}
.eyebrow{color:var(--orange)}
.about h2,.proc h2,.prod h2{color:#1d6b34}
.card{border-top:6px solid var(--orange)}
.card h3{color:#1d6b34}
.stats{background:linear-gradient(90deg,var(--orange),var(--gold))}
.stats b{color:#fff;}.stats span{color:#fff;font-weight:600}
.about .photo.main{box-shadow:0 0 0 8px #fff}
.prod{background:linear-gradient(180deg,#ffffff 0%,#e6f5d6 100%)}
.pc{border-bottom:7px solid var(--orange)}
.pc h3{color:#1d6b34}.pc span{color:var(--orange)}
.pband{background:linear-gradient(110deg,var(--orange),var(--gold))}
.pband h3{color:#fff}.pband p{color:#fff;font-weight:500;font-size:13.5px;line-height:1.4}
.why{background:linear-gradient(135deg,#145a2c,#1d6b34 60%,#2f9a3a)}
.why>.eyebrow{color:var(--gold)}.why h2{color:#fff}
.why .photo.main{box-shadow:none}
.pillar{border-left:7px solid var(--gold)}
.pillar .i{background:var(--orange)}.pillar h3{color:#1d6b34}
.why .note{color:#e8f6dd}
.why .folio{background:var(--gold);color:#1d4f2b;box-shadow:0 0 0 3px #fff}
.step .n{background:var(--orange);box-shadow:0 0 0 6px var(--mist)}
.step:nth-child(even) .n{background:var(--g)}
.step h3{color:#1d6b34}
.steps:before{border-top-color:#f5c451}
.sus{background:linear-gradient(90deg,rgba(20,90,44,.97) 52%,rgba(20,90,44,.2)),url(img/closeup-snap.jpg) center/cover}
.contact{background:#145a2c}
.contact .left{background:radial-gradient(circle at 20% 10%,#6cc04a,#1d6b34 72%)}
.contact .cardbox{box-shadow:0 0 0 6px var(--gold)}
.cardbox h3{color:#1d6b34}.cardbox .role{color:var(--orange)}
.cardbox .qr{box-shadow:0 0 0 5px var(--orange)}
.contact .folio{background:var(--gold);color:#1d4f2b;box-shadow:0 0 0 3px #fff}
`;
const BOLD_BOTH = `.cb2 h3{color:#1d6b34}.cb2 .role{color:var(--orange)}.cb2 .qr2{box-shadow:0 0 0 4px var(--orange)}.cb2{box-shadow:0 0 0 5px var(--gold)}`;
const P = PEOPLE[(process.env.PERSON || 'both') === 'both' ? 'lucas' : process.env.PERSON];
(async () => {
  const qr = await QR.toString(`https://frescapremierfresh.com/card/${P.slug}/`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#2f5a30', light: '#ffffff' } });
  const both = (process.env.PERSON || 'both') === 'both';
  const qrOf = async (slug) => QR.toString(`https://frescapremierfresh.com/card/${slug}/`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#2f5a30', light: '#ffffff' } });
  const mini = (p, q) => `<div class="cb2"><div class="eyebrow" style="font-size:11px">Scan to connect</div><div class="qr2">${q}</div><h3>${p.name}</h3><div class="role">${p.role.replace('&','&amp;')}</div><div class="lines">${p.phone}<br>${p.email}</div><p class="scan">Save contact or browse our website</p></div>`;
  const page6both = both ? `
<section class="page contact both" id="p6">
  <div class="left"></div>
  <div class="abs badge"><img src="img/logo_t.png" alt=""></div>
  <h2>Let's grow<br>together.</h2>
  <p class="tag">Talk to us about your market requirements. Scan a code to save our team's contact straight to your phone.</p>
  <div class="clist">
    <div><span class="i">${ICON.pin}</span>Trystar Go Down, Airport North Road<br>P.O. Box 3468-00200 Nairobi, Kenya</div>
    <div><span class="i">${ICON.mail}</span>info@frescapremierfresh.com</div>
    <div><span class="i">${ICON.phone}</span>+254 700 752 341</div>
    <div><span class="i">${ICON.globe}</span>frescapremierfresh.com</div>
  </div>
  <div class="pair">${mini(PEOPLE.lucas, await qrOf('lucas'))}${mini(PEOPLE.judy, await qrOf('judy'))}</div>
  ${folio(6, true)}
</section>` : '';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fresca Premier Fresh - Company Profile</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:297mm 210mm;margin:0}
:root{--g:#487a49;--gd:#2f5a30;--gold:#eab420;--ink:#1d1d1d;--mist:#f4f8ef}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:297mm;background:#fff}
body{font-family:Montserrat,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:297mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;background:var(--mist)}
.page:last-child{page-break-after:auto}
h1,h2,h3{font-family:'DM Serif Display',serif;font-weight:400}
.eyebrow{font-weight:700;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:var(--g)}
.bar{width:64px;height:5px;background:var(--gold);border-radius:3px}
p{font-size:15px;line-height:1.55;color:#33403a}
.abs{position:absolute}
.photo{position:absolute;background-size:cover;background-position:center}
.folio{position:absolute;right:30px;bottom:26px;width:42px;height:42px;border-radius:50%;background:#fff;color:var(--gd);font:700 19px Montserrat;display:grid;place-items:center;box-shadow:0 0 0 3px var(--gold);z-index:5}
.folio.dk{background:var(--gd);color:#fff}
.blob{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 30%,#d6ebc8,#b8d9a4);opacity:.55}
svg{display:block}
.mult{mix-blend-mode:multiply}

/* 1 cover */
.cover .right{right:0;top:0;width:640px;height:794px;border-radius:320px 0 0 320px;background-image:url(img/field.jpg);background-position:50% 62%;box-shadow:none}
.cover .c1,.cover .c2{border-radius:50%;border:9px solid #fff;box-shadow:none}
.cover .c1{left:420px;top:56px;width:190px;height:190px;background-image:url(img/crates.jpg);background-position:50% 40%}
.cover .c2{left:395px;top:500px;width:230px;height:230px;background-image:url(img/truckload.jpg);background-position:50% 55%}
.cover .logo{left:72px;top:60px;width:210px}
.cover h1{position:absolute;left:72px;top:240px;font-size:70px;line-height:1.05;color:var(--gd);width:400px}
.cover .bar{left:72px;top:490px}
.cover .sub{left:72px;top:516px;font-weight:700;font-size:20px;letter-spacing:.28em;color:var(--g)}
.cover .url{left:72px;bottom:46px;font-size:15px;font-weight:600;color:var(--gd);letter-spacing:.06em}

/* 2 about */
.about>.eyebrow{position:absolute;left:64px;top:56px}
.about h2{position:absolute;left:64px;top:90px;font-size:54px;line-height:1.05;color:var(--gd);width:600px}
.about .t1{left:64px;top:232px;width:590px;font-size:15.5px}
.about .vm{left:64px;top:392px;width:600px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.card{background:#fff;border-radius:16px;padding:20px 22px;box-shadow:none}
.card h3{font-size:25px;color:var(--gd);margin-bottom:6px}
.card p{font-size:14px;line-height:1.5}
.about .photo.main{right:56px;top:56px;width:380px;height:640px;border-radius:26px 190px 26px 26px;background-image:url(img/packhouseA.jpg);background-position:50% 55%;box-shadow:none}
.stats{position:absolute;left:0;bottom:0;width:690px;height:78px;background:var(--gd);display:grid;grid-template-columns:repeat(3,1fr);align-items:center;padding-left:64px}
.stats div{color:#fff;display:flex;flex-direction:column}
.stats b{font:400 34px 'DM Serif Display';color:var(--gold);line-height:1}
.stats span{font-size:13px;font-weight:500;margin-top:4px}

/* 3 products */
.prod>.eyebrow{position:absolute;left:59px;top:50px}
.prod h2{position:absolute;left:59px;top:80px;font-size:60px;color:var(--gd)}
.prod .intro{position:absolute;left:470px;top:70px;width:594px;font-size:15px}
.pc{position:absolute;top:236px;width:236px;height:330px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:none}
.pc .ph{height:236px;background-size:cover;background-position:center}
.pc h3{font-size:23px;color:var(--gd);margin:14px 18px 2px;line-height:1.1}
.pc span{display:block;margin:0 18px;font-size:14px;font-weight:600;color:var(--g)}
.pband{position:absolute;left:59px;top:592px;width:1005px;height:118px;border-radius:20px;background:linear-gradient(120deg,var(--gd),#487a49);display:flex;align-items:center;gap:26px;padding:0 20px 0 32px}
.pband h3{font-size:30px;color:#fff;line-height:1.05;width:260px;flex:none}
.pband p{color:#e4f1dc;font-size:14.5px;flex:1}
.pband i{flex:none;width:170px;height:84px;border-radius:12px;background-size:cover;background-position:center;border:3px solid #fff}

/* 4 why */
.why .photo.main{left:0;top:0;width:440px;height:794px;border-radius:0 220px 220px 0;background-image:url(img/packhouseB.jpg);background-position:50% 50%;box-shadow:none}
.why>.eyebrow{position:absolute;left:500px;top:56px}
.why h2{position:absolute;left:500px;top:88px;font-size:50px;line-height:1.05;color:var(--gd);width:580px}
.pillars{position:absolute;left:500px;top:226px;width:565px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.pillar{background:#fff;border-radius:18px;padding:18px 20px;box-shadow:none}
.pillar .i{width:42px;height:42px;border-radius:50%;background:var(--g);color:#fff;display:grid;place-items:center;margin-bottom:10px}
.pillar .i svg{width:23px;height:23px}
.pillar h3{font-size:23px;color:var(--gd);margin-bottom:4px}
.pillar p{font-size:13.5px;line-height:1.45}
.why .note{position:absolute;left:500px;top:636px;width:540px;font-size:14px;line-height:1.5}

/* 5 process */
.proc>.eyebrow{position:absolute;left:64px;top:48px}
.proc h2{position:absolute;left:64px;top:78px;font-size:56px;color:var(--gd);width:560px}
.proc .sub{position:absolute;left:660px;top:104px;width:400px;font-size:17px}
.steps{position:absolute;left:64px;top:218px;width:995px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.steps:before{content:"";position:absolute;left:30px;right:150px;top:27px;border-top:3px dotted #b8d9a4}
.step .n{width:56px;height:56px;border-radius:50%;background:var(--g);color:#fff;font:400 28px 'DM Serif Display';display:grid;place-items:center;box-shadow:0 0 0 6px var(--mist);position:relative}
.step h3{font-size:28px;color:var(--gd);margin:12px 0 4px}
.step p{font-size:14px;line-height:1.45;width:225px}
.band{position:absolute;top:452px;height:250px;border-radius:20px;background-size:cover;background-position:center;box-shadow:none}
.sus{position:absolute;left:664px;top:452px;width:395px;height:250px;border-radius:20px;background:linear-gradient(90deg,rgba(47,90,48,.97) 52%,rgba(47,90,48,.22)),url(img/closeup-snap.jpg) center/cover;color:#fff;padding:26px 28px}
.sus h3{font-size:30px;line-height:1.05;margin:8px 0 10px}
.sus p{color:#e4f1dc;font-size:14px;line-height:1.45;width:270px}

/* 6 contact */
.contact{background:var(--gd)}
.contact .left{position:absolute;left:0;top:0;width:610px;height:794px;background:radial-gradient(circle at 20% 15%,#5d935e,var(--gd) 70%)}
.contact .badge{left:64px;top:56px;width:120px;height:120px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:none}
.contact .badge img{width:88px}
.contact h2{position:absolute;left:64px;top:204px;font-size:66px;line-height:1.02;color:#fff}
.contact .tag{position:absolute;left:64px;top:360px;width:470px;color:#dcebd5;font-size:16px}
.clist{position:absolute;left:64px;top:452px;width:500px;display:grid;gap:14px}
.clist div{display:flex;align-items:center;gap:14px;color:#fff;font-size:15px;font-weight:500;line-height:1.35}
.clist .i{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;flex:none;color:var(--gold)}
.clist .i svg{width:19px;height:19px}
.contact .cardbox{position:absolute;left:650px;top:56px;width:417px;height:648px;background:#fff;border-radius:26px;box-shadow:none;text-align:center;padding-top:30px}
.cardbox .qr{width:290px;height:290px;margin:16px auto 0;padding:14px;border-radius:18px;box-shadow:0 0 0 5px var(--gold)}
.cardbox .qr svg{width:100%;height:100%}
.cardbox h3{font-size:36px;color:var(--gd);margin-top:24px}
.cardbox .role{font-size:16px;font-weight:600;color:var(--g);margin-top:2px}
.cardbox .scan{font-size:14px;color:#777;margin-top:12px}
.cardbox .lines{font-size:16px;font-weight:600;color:var(--ink);margin-top:12px;line-height:1.6}
.cardbox .also{position:absolute;left:24px;right:24px;bottom:18px;font-size:12.5px;color:#777;line-height:1.4}
${THEME === 'bold' ? BOLD : ''}
.both .left{width:100%;background:radial-gradient(ellipse at 50% 30%,#5d935e,var(--gd) 75%)}
.both .badge{left:509px;top:50px;width:104px;height:104px}.both .badge img{width:76px}
.both h2{left:300px;width:523px;text-align:center;top:176px;font-size:58px}
.both .tag{left:340px;width:443px;text-align:center;top:322px;font-size:15px}
.both .clist{left:340px;width:443px;top:430px;gap:10px;justify-items:center}
.both .clist:before{content:'';display:block;width:64px;height:5px;background:var(--gold);border-radius:3px;margin:0 auto 12px;justify-self:center}
.both .clist div{font-size:14px;justify-content:center;text-align:center}
.both .clist .i{display:none}.both .clist div{font-weight:600;font-size:15px}
.pair{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:0 40px}
.cb2{width:276px;background:#fff;border-radius:22px;box-shadow:none;text-align:center;padding:28px 14px 30px}
.cb2 .qr2{width:232px;height:232px;margin:14px auto 0;padding:12px;border-radius:15px;box-shadow:0 0 0 4px var(--gold)}
.cb2 .qr2 svg{width:100%;height:100%}
.cb2 h3{font-size:28px;color:var(--gd);margin-top:22px;line-height:1.05}
.cb2 .role{font-size:13.5px;font-weight:600;color:var(--g);margin-top:6px;line-height:1.3;min-height:36px}
.cb2 .lines{font-size:13px;font-weight:600;margin-top:12px;line-height:1.7;word-break:break-all}
.cb2 .scan{font-size:12.5px;color:#777;margin-top:14px}
${THEME === 'bold' ? BOLD_BOTH : ''}</style></head><body>

<!-- 1 COVER -->
<section class="page cover" id="p1">
  
  
  <div class="blob" style="left:-120px;top:520px;width:380px;height:380px"></div><div class="blob" style="left:230px;top:-150px;width:300px;height:300px"></div><div class="photo right"></div>
  <div class="photo c1"></div><div class="photo c2"></div>
  <img class="abs logo" src="img/logo_t.png" alt="Fresca Premier Fresh">
  <h1>Fresh from<br>Kenya to<br>the World</h1>
  <div class="abs bar"></div>
  <div class="abs sub">COMPANY PROFILE</div>
  <div class="abs url">frescapremierfresh.com</div>
  ${folio(1, true)}
</section>

<!-- 2 ABOUT -->
<section class="page about" id="p2">
  
  <div class="eyebrow">About Us</div>
  <h2>Premium produce,<br>grown with care.</h2>
  <p class="abs t1"><b>Fresca Premier Fresh</b> is a Kenyan fresh produce export company committed to supplying premium-quality vegetables to international markets. We specialize in the production, sourcing, packing and export of fresh vegetables that meet the highest international standards for quality, food safety and traceability.</p>
  <div class="abs vm">
    <div class="card"><h3>Our Vision</h3><p>To become a trusted supplier of premium Kenyan fresh vegetables to international markets by delivering quality, consistency, and exceptional customer service.</p></div>
    <div class="card"><h3>Our Mission</h3><p>To provide fresh, safe, and high-quality vegetables while building long-term partnerships based on trust, integrity, and reliability.</p></div>
  </div>
  <div class="photo main"></div>
  <div class="stats"><div><b>20+</b><span>International markets</span></div><div><b>500+</b><span>Trusted farmers</span></div><div><b>100%</b><span>Quality &amp; food safety</span></div></div>
  ${folio(2)}
</section>

<!-- 3 PRODUCTS -->
<section class="page prod" id="p3">
  
  <div class="eyebrow">What we grow</div>
  <h2>Our Products</h2>
  <p class="intro">Our products are carefully selected, graded, packed and prepared to meet the specifications of wholesale importers, retailers and food service companies across Europe and other international markets. We also supply other fresh vegetables tailored to your market.</p>
  <div class="pc" style="left:59px"><div class="ph" style="background-image:url(img/tray-beans.jpg)"></div><h3>French Beans</h3><span>Extra Fine &amp; Fine</span></div>
  <div class="pc" style="left:327px"><div class="ph" style="background-image:url(img/tray-snow.jpg)"></div><h3>Snow Peas</h3><span>Mangetout</span></div>
  <div class="pc" style="left:595px"><div class="ph" style="background-image:url(img/tray-snap.jpg)"></div><h3>Sugar Snap Peas</h3><span>Crisp &amp; sweet</span></div>
  <div class="pc" style="left:863px"><div class="ph" style="background-image:url(img/corn.jpg)"></div><h3>Baby Corn</h3><span>Fresh, tray-packed</span></div>
  <div class="pband"><h3>Packed to your specification</h3><p>Flexible packing according to customer specifications, with strict quality control and full product traceability from farm to final delivery.</p><i style="background-image:url(img/retail.jpg)"></i><i style="background-image:url(img/snowpacks.jpg)"></i></div>
  ${folio(3)}
</section>

<!-- 4 WHY FRESCA -->
<section class="page why" id="p4">
  <div class="photo main"></div>
  <div class="eyebrow">Why Choose Us</div>
  <h2>Quality. Reliability.<br>Trust.</h2>
  <div class="pillars">
    <div class="pillar"><div class="i">${ICON.check}</div><h3>Premium Quality</h3><p>Carefully selected and graded vegetables that meet the highest international standards.</p></div>
    <div class="pillar"><div class="i">${ICON.shield}</div><h3>Food Safety</h3><p>Strict quality control and full traceability at every step of the supply chain.</p></div>
    <div class="pillar"><div class="i">${ICON.truck}</div><h3>Reliable Supply</h3><p>Consistent volumes, flexible solutions and on-time deliveries you can count on.</p></div>
    <div class="pillar"><div class="i">${ICON.users}</div><h3>Partnership Focused</h3><p>Building long-term relationships through trust, integrity and exceptional service.</p></div>
  </div>
  <p class="note">We work closely with growers and packhouses that comply with internationally recognized standards, and continuously strive to meet customer requirements on food safety, sustainability and ethical sourcing.</p>
  ${folio(4)}
</section>

<!-- 5 PROCESS -->
<section class="page proc" id="p5">
  
  <div class="eyebrow">Our Process</div>
  <h2>From Farm to Export</h2>
  <p class="sub">Every step is guided by quality, care and commitment.</p>
  <div class="steps">
    <div class="step"><div class="n">1</div><h3>Sourcing</h3><p>We work closely with trusted farmers to source the finest produce at peak freshness.</p></div>
    <div class="step"><div class="n">2</div><h3>Grading</h3><p>Every harvest is carefully inspected and graded to meet international quality standards.</p></div>
    <div class="step"><div class="n">3</div><h3>Packing</h3><p>Packed with care using food-safe materials to protect quality and freshness.</p></div>
    <div class="step"><div class="n">4</div><h3>Delivery</h3><p>Delivered on time and in perfect condition to markets across the world.</p></div>
  </div>
  <div class="band" style="left:64px;width:290px;background-image:url(img/retail.jpg)"></div>
  <div class="band" style="left:370px;width:280px;background-image:url(img/truckload.jpg)"></div>
  <div class="sus"><div class="eyebrow" style="color:var(--gold);font-size:12px">Our Commitment</div><h3>Sustainable Today,<br>Better Tomorrow</h3><p>We work with local farmers and communities to promote sustainable agriculture and protect the environment.</p></div>
  ${folio(5)}
</section>

<!-- 6 CONTACT -->
${both ? page6both : `<section class="page contact" id="p6">
  <div class="left"></div>
  <div class="abs badge"><img src="img/logo_t.png" alt=""></div>
  <h2>Let's grow<br>together.</h2>
  <p class="tag">Talk to us about your market requirements. Scan the code to save ${P.slug === 'judy' ? 'the' : 'our ' + P.who + "'s"} contact straight to your phone.</p>
  <div class="clist">
    <div><span class="i">${ICON.pin}</span>Trystar Go Down, Airport North Road · P.O. Box 3468-00200 Nairobi, Kenya</div>
    <div><span class="i">${ICON.mail}</span>info@frescapremierfresh.com</div>
    <div><span class="i">${ICON.phone}</span>+254 700 752 341</div>
    <div><span class="i">${ICON.globe}</span>frescapremierfresh.com</div>
  </div>
  <div class="cardbox">
    <div class="eyebrow" style="font-size:12px">Scan to connect</div>
    <div class="qr">${qr}</div>
    <h3>${P.name}</h3>
    <div class="role">${P.role}</div>
    <div class="lines">${P.phone}<br>${P.email}</div>
    <p class="scan">Save contact or browse our website</p>
    <div class="also">Also: ${P.other.replace("&","&amp;")}</div>
  </div>
  ${folio(6, true)}
</section>`}
</body></html>`;
  fs.writeFileSync(OUT + '/brochure-' + (THEME || 'classic') + ((process.env.PERSON || 'both') === 'both' ? '' : '-' + P.slug) + '.html', html);
  console.log('ok');
})();
