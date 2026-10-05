const {chromium}=require('playwright');const fs=require('fs');
const W=430,H=900;
(async()=>{
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const c=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await c.newPage();
const cdp=await c.newCDPSession(p);
const frames=[];let n=0;
cdp.on('Page.screencastFrame',async f=>{const file=`fr/f${String(n).padStart(5,'0')}.jpg`;fs.writeFileSync(file,Buffer.from(f.data,'base64'));frames.push({file,t:f.metadata.timestamp});n++;cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{});});
await p.goto('file:///Users/admin/Desktop/frescape/02_ecards/web/card/lucas/index.html',{waitUntil:'load'});
await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,everyNthFrame:1});
const wait=ms=>p.waitForTimeout(ms);
const scroll=(to,ms)=>p.evaluate(([to,ms])=>new Promise(r=>{const s=scrollY,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;scrollTo(0,s+(to-s)*e);k<1?requestAnimationFrame(f):r()})(t0)}),[to,ms]);
await wait(4600);                       // intro plays, card drops in
// tilt with pointer
for(let i=0;i<=30;i++){await p.mouse.move(60+i*10,150+Math.sin(i/4)*40);await wait(30);}
await wait(400);
await p.tap('#flip',{force:true});      // flip to QR
await wait(4200);
await p.tap('.tab[data-t=link]',{force:true});   // share card QR
await wait(3200);
await p.tap('#flip',{force:true});      // flip back
await wait(1800);
await scroll(520,1400);await wait(900);
await p.evaluate(()=>document.querySelector('.strip').scrollTo({left:260,behavior:'smooth'}));await wait(1400);
await scroll(1000,1400);await wait(1300);
await scroll(0,1200);await wait(1500);
await cdp.send('Page.stopScreencast');
await b.close();
// concat list
let list='';
for(let i=0;i<frames.length;i++){const d=i<frames.length-1?frames[i+1].t-frames[i].t:0.5;list+=`file '${frames[i].file}'\nduration ${Math.max(d,0.001).toFixed(4)}\n`;}
list+=`file '${frames[frames.length-1].file}'\n`;
fs.writeFileSync('list.txt',list);console.log('frames',frames.length,'secs',(frames[frames.length-1].t-frames[0].t).toFixed(1));
})();
