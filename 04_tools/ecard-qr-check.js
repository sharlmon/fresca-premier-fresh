const {chromium}=require('playwright');const jsQR=require('jsqr');const {PNG}=require('pngjs');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2,isMobile:true,hasTouch:true});
for(const who of ['lucas','judy']){const p=await c.newPage();
await p.goto(`file:///Users/admin/Desktop/frescape/02_ecards/web/card/${who}/index.html`);
await p.addStyleTag({content:'.intro{display:none!important}.scan{display:none!important}.float{animation:none!important}'});
for(const t of ['save','link']){await p.click(`.tab[data-t=${t}]`,{force:true});await p.waitForTimeout(3200);
const buf=await p.locator('.qrbox').screenshot();const png=PNG.sync.read(buf);
const r=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);console.log(who,t,r?r.data.replace(/\n/g,' | '):'NOT DECODED');}
await p.close();}
await b.close();})();
