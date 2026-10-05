const fs=require('fs'),QR=require('qrcode');
const A='file:///Users/admin/Desktop/frescape/02_ecards/web/card/assets';
const P=[{s:'lucas',n:'Lucas Omollo',t:'Director',e:'lucas@frescapremierfresh.com',p:'+254 726 262 679'},
{s:'judy',n:'Judy Ogolla',t:'Commercial & Operations Manager',e:'judy@frescapremierfresh.com',p:'+254 731 615 135'}];
(async()=>{for(const x of P){
const qr=await QR.toString(`https://frescapremierfresh.com/card/${x.s}/`,{type:'svg',margin:0,errorCorrectionLevel:'M',color:{dark:'#2f5a30',light:'#ffffff'}});
fs.writeFileSync(`print-${x.s}.html`,`<!doctype html><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel=stylesheet>
<style>@page{size:96mm 61mm;margin:0}*{box-sizing:border-box;margin:0}html,body{width:96mm}
.pg{width:96mm;height:61mm;position:relative;overflow:hidden;page-break-after:always;font-family:Montserrat,sans-serif;color:#1d1d1d}
.front{background:#fff}.front::before{content:"";position:absolute;left:0;top:0;bottom:0;width:36mm;background:linear-gradient(rgba(47,90,48,.82),rgba(47,90,48,.9)),url(${A}/hero.jpg) 40% 50%/cover}
.logo{position:absolute;left:8mm;top:15mm;width:28mm;height:28mm;background:#fff;border-radius:50%;padding:2mm;object-fit:contain}
.txt{position:absolute;left:42mm;top:11mm;right:6mm}
h1{font:700 12pt Poppins;color:#2f5a30}.role{font:600 7pt Montserrat;color:#487a49;margin-top:1mm;line-height:1.25}
.org{font-size:6pt;color:#777;margin-top:.8mm}.bar{width:10mm;height:.7mm;background:#eab420;margin:3mm 0}
.c{font-size:6.3pt;line-height:1.75;font-weight:500}.c b{color:#487a49;display:inline-block;width:10mm;font-weight:600}
.back{background:linear-gradient(135deg,#487a49,#2f5a30);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}
.q{width:30mm;height:30mm;background:#fff;padding:2mm;border-radius:2mm;box-shadow:0 0 0 .6mm #eab420}.q svg{width:100%;height:100%;display:block}
.back p{font-size:6pt;margin-top:3mm;letter-spacing:.14em;text-transform:uppercase}.back small{font-size:5.5pt;opacity:.8;margin-top:1mm}</style>
<div class="pg front"><img class=logo src="${A}/logo.png"><div class=txt><h1>${x.n}</h1><div class=role>${x.t.replace('&','&amp;')}</div><div class=org>Fresca Premier Fresh</div><div class=bar></div>
<div class=c><b>Tel</b>${x.p}<br><b>Email</b>${x.e}<br><b>Web</b>frescapremierfresh.com<br><b>P.O.</b>Box 3468-00200, Nairobi, Kenya</div></div></div>
<div class="pg back"><div class=q>${qr}</div><p>Save contact · Visit website</p><small>frescapremierfresh.com/card/${x.s}</small></div>`);}})();
