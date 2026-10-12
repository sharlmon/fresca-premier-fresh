// Display tray 3D renders (three.js in headless Chrome), built from tray-spec.js and the panel art from tray-build.js.
//   node tray-build.js && node tray-render.js   -> 06_packaging/mockups/trays/*.png
// World units are mm; y up, the shopper stands at +z.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { D, PRODUCTS, outline, size } = require('./tray-spec');

const ROOT = path.resolve(__dirname, '..');
const ART = path.join(ROOT, '06_packaging/art/tray');
const OUT = path.join(ROOT, '06_packaging/mockups/trays');
const uri = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;

const VIEWS = {
  hero:  { cam: [-640, 470, 930], at: [0, 78, 0], fov: 27 },
  front: { cam: [0, 250, 1240], at: [0, 92, 0], fov: 24 },
  back:  { cam: [760, 430, -880], at: [0, 92, 0], fov: 27 },
  above: { cam: [-330, 1080, 640], at: [0, 40, 10], fov: 30 },
  empty: { cam: [-640, 520, 900], at: [0, 70, 0], fov: 27, empty: true },
  pair:  { cam: [-420, 620, 1500], at: [0, 70, 0], fov: 28, pair: true },
};

const HTML = `<!doctype html><html><head><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script></head><body>
<script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const W = 2400, H = 1800;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const loader = new THREE.TextureLoader();
const tex = (src, srgb = true) => new Promise((ok) => loader.load(src, (t) => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; ok(t); }));

// canvas textures: corrugated flute edge, washboard bump on the liner, kraft inside
function canvasTex(w, h, draw, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso; return t; }
const flute = canvasTex(256, 64, (g, w, h) => {          // cut edge: liner / wave / liner, 4 mm tall, ~7 mm pitch
  g.fillStyle = '#a77d4e'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#efe9dc'; g.fillRect(0, 0, w, 7);         // white top liner (outside)
  g.fillStyle = '#9a7146'; g.fillRect(0, h - 7, w, 7);     // kraft inner liner
  g.strokeStyle = '#7b5530'; g.lineWidth = 5; g.beginPath();
  for (let x = 0; x <= w; x++) g.lineTo(x, h / 2 + Math.sin((x / w) * Math.PI * 2 * 2) * (h / 2 - 10)); g.stroke();
  g.fillStyle = 'rgba(40,25,10,.35)'; for (let x = 0; x < w; x += 64) { g.beginPath(); g.ellipse(x + 16, h / 2, 10, 13, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 48, h / 2, 10, 13, 0, 0, 7); g.fill(); }
});
const wash = canvasTex(64, 8, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); for (let i = 0; i <= 4; i++) gr.addColorStop(i / 4, i % 2 ? '#7f7f7f' : '#8a8a8a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, false);
const kraft = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#b58a5a'; g.fillRect(0, 0, w, h);
  const id = g.getImageData(0, 0, w, h), d = id.data; let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 26; d[i] += n; d[i + 1] += n * .85; d[i + 2] += n * .6; }
  g.putImageData(id, 0, 0);
  g.globalAlpha = .07; g.strokeStyle = '#5a3b1c'; for (let i = 0; i < 300; i++) { g.beginPath(); const x = rnd() * w, y = rnd() * h; g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 40, y + (rnd() - .5) * 4); g.stroke(); }
});
kraft.repeat.set(1 / 140, 1 / 140);

window.build = async (data) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e3e2dd');
  scene.fog = new THREE.Fog('#e3e2dd', 1700, 3600);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.55;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshStandardMaterial({ color: '#dddcd7', roughness: .92 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const key = new THREE.DirectionalLight('#fffaf2', 2.4);
  key.position.set(-1100, 1250, 350); key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -900, right: 900, top: 900, bottom: -900, near: 10, far: 4000 });
  key.shadow.camera.updateProjectionMatrix(); key.shadow.mapSize.set(4096, 4096); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.6;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#eef3ff', 0.7); rim.position.set(900, 600, -900); scene.add(rim);
  scene.add(new THREE.HemisphereLight('#ffffff', '#b9b6ad', 0.35));

  const D = data.D, t = D.t;
  const edgeMat = new THREE.MeshStandardMaterial({ map: flute, roughness: .95 });
  const kraftMat = new THREE.MeshStandardMaterial({ map: kraft, roughness: .95 });
  const shapeOf = (pts) => { const s = new THREE.Shape(); pts.forEach(([u, v], i) => (i ? s.lineTo(u, v) : s.moveTo(u, v))); return s; };

  // one wall: slab (kraft caps, flute edges) behind a printed face; local x = viewer's right, local +z = outward
  async function wall(panel, art, pos, rotY, artSize) {
    const g = new THREE.Group();
    const pts = data.outline[panel];
    const slab = new THREE.ExtrudeGeometry(shapeOf(pts), { depth: t, bevelEnabled: false, curveSegments: 1 });
    slab.translate(0, 0, -t);
    // flute texture along the cut edges: u along the edge (mm), v across the board
    const uv = slab.attributes.uv, P = slab.attributes.position;
    const m = new THREE.Mesh(slab, [kraftMat, edgeMat]);
    // re-map side UVs so the flute pattern runs along each edge at a real scale (~7 mm pitch)
    const grp = slab.groups.find((q) => q.materialIndex === 1);
    for (let i = grp.start; i < grp.start + grp.count; i += 2) {
      // side faces are built as quads: use x/y length for u and z for v
      const a = i;
      const x = P.getX(a), y = P.getY(a), z = P.getZ(a);
      uv.setXY(a, (x + y) / 28, (z + t) / t * .999);
    }
    for (let i = grp.start; i < grp.start + grp.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i); uv.setXY(i, (x + y) / 28, (z + t) / t); }
    // caps use world-mm UVs for the kraft texture already (u, v)
    m.castShadow = m.receiveShadow = true; g.add(m);
    if (art) {
      const [aw, ah] = artSize;
      const face = new THREE.ShapeGeometry(shapeOf(pts), 1);
      const fu = face.attributes.uv; for (let i = 0; i < fu.count; i++) fu.setXY(i, fu.getX(i) / aw, fu.getY(i) / ah);
      const map = await tex(art);
      const mat = new THREE.MeshStandardMaterial({ map, roughness: .62, bumpMap: wash, bumpScale: .35 });
      wash.repeat.set(1 / 7.5, 1);
      const fm = new THREE.Mesh(face, mat); fm.position.z = .12; fm.receiveShadow = true; fm.castShadow = false; g.add(fm);
    }
    g.position.set(...pos); g.rotation.y = rotY; return g;
  }

  async function tray(prod, withPunnets) {
    const T = new THREE.Group(), L = D.L, Wd = D.W, A = prod.art, S = data.size;
    T.add(await wall('front', A.front, [-L / 2, 0, Wd / 2], 0, S.front));
    T.add(await wall('back', A.back, [L / 2, 0, -Wd / 2], Math.PI, S.back));
    T.add(await wall('header', A.header, [-S.header[0] / 2, D.hB - D.hI, -Wd / 2 + 2 * t + .4], 0, S.header));
    T.add(await wall('sideL', A.sideL, [-L / 2, 0, -Wd / 2], -Math.PI / 2, S.sideL));
    T.add(await wall('sideR', A.sideR, [L / 2, 0, Wd / 2], Math.PI / 2, S.sideR));
    // header fold: rounded top joining the two layers
    const fold = new THREE.Mesh(new THREE.CylinderGeometry(t + .3, t + .3, L - 2 * D.ch, 24, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#f3f2ec', roughness: .7 }));
    fold.rotation.z = Math.PI / 2; fold.rotation.x = 0; fold.position.set(0, D.hB, -Wd / 2 + t + .2); fold.rotation.y = 0;
    fold.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0); fold.castShadow = true; T.add(fold);
    // base
    const base = new THREE.Mesh(new THREE.BoxGeometry(L - 2 * t, t, Wd - 2 * t), kraftMat); base.position.y = t / 2; base.receiveShadow = true; T.add(base);
    if (withPunnets) {
      const pw = 124, pd = 136, ph = 42, top = await tex(prod.photo);
      top.repeat.set(.9, .93); top.offset.set(.05, .035);
      const tray = new THREE.MeshPhysicalMaterial({ color: '#0b0b0b', roughness: .28, clearcoat: .7, clearcoatRoughness: .2 });
      const film = new THREE.MeshPhysicalMaterial({ map: top, roughness: .7, clearcoat: .35, clearcoatRoughness: .1, envMapIntensity: .35 });
      const box = new RoundedBoxGeometry(pw, ph, pd, 4, 5);
      const filmG = new THREE.PlaneGeometry(pw - 7, pd - 7);
      const z0 = -Wd / 2 + 2 * t + 1.5 + pd / 2;
      for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
        const x = (i - 1) * (pw + 2.5), z = z0 + j * (pd + 1.2), y = t + layer * (ph + .5);
        const jitter = ((i * 7 + j * 3 + layer * 5) % 5 - 2) * .35;
        const b = new THREE.Mesh(box, tray); b.position.set(x + jitter, y + ph / 2, z); b.rotation.y = jitter * .004; b.castShadow = b.receiveShadow = true; T.add(b);
        if (layer === 1) {
          const fm = new THREE.Mesh(filmG, film); fm.rotation.x = -Math.PI / 2; fm.rotation.z = Math.PI / 2 * 0 + (i + j) % 2 * Math.PI;
          fm.position.set(x + jitter, y + ph + .25, z); fm.receiveShadow = true; T.add(fm);
        }
      }
    }
    const ao = canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(.8, 'rgba(0,0,0,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    ao.wrapS = ao.wrapT = THREE.ClampToEdgeWrapping;
    const aoM = new THREE.Mesh(new THREE.PlaneGeometry(L * 1.12, Wd * 1.16), new THREE.MeshBasicMaterial({ map: ao, transparent: true, depthWrite: false, opacity: .55 }));
    aoM.rotation.x = -Math.PI / 2; aoM.position.y = .3; T.add(aoM);
    T.traverse((o) => { if (o.isMesh && o.castShadow === undefined) o.castShadow = true; });
    return T;
  }

  const v = data.view;
  if (v.pair) {
    const a = await tray(data.products[0], true); a.position.x = -228; a.rotation.y = .06; scene.add(a);
    const b = await tray(data.products[1], true); b.position.x = 228; b.rotation.y = -.04; scene.add(b);
  } else scene.add(await tray(data.products[0], !v.empty));
  const cam = new THREE.PerspectiveCamera(v.fov, W / H, 10, 20000);
  cam.position.set(...v.cam); cam.lookAt(...v.at);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/png');
};
window.ready = true;
</script></body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const page = await b.newPage({ viewport: { width: 2400, height: 1800 } });
  page.on('console', (m) => m.type() === 'error' && console.log('page:', m.text()));
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.setContent(HTML);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  const outlines = Object.fromEntries(['front', 'back', 'header', 'sideL', 'sideR'].map((k) => [k, outline[k]()]));
  const prod = (p) => ({
    slug: p.slug,
    photo: uri(path.join(ROOT, p.photo), 'image/webp'),
    art: Object.fromEntries(['front', 'back', 'header', 'sideL', 'sideR'].map((k) => [k, uri(path.join(ART, p.slug, k + '.png'), 'image/png')])),
  });
  const only = process.argv[2];
  const list = Object.values(PRODUCTS);
  for (const [name, view] of Object.entries(VIEWS)) {
    const sets = view.pair ? [[list[0], list[1]]] : list.map((p) => [p]);
    for (const ps of sets) {
      const label = view.pair ? 'both' : ps[0].slug;
      if (only && !`${label}-${name}`.includes(only)) continue;
      const png = await page.evaluate((data) => window.build(data), { D, size, outline: outlines, view, products: ps.map(prod) });
      const file = path.join(OUT, `${label}-tray-${name}.png`);
      fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64'));
      console.log('render', path.basename(file));
    }
  }
  await b.close();
})();
