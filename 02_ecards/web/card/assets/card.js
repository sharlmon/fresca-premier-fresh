(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { sessionStorage.setItem('fresca_intro', '1'); } catch (e) {}

  /* intro skip */
  var intro = document.getElementById('intro');
  if (intro) intro.addEventListener('click', function () { intro.classList.add('gone'); });

  /* ---- animated QR: modules appear dot by dot ---- */
  var DARK = '#2f5a30', M = 4; // quiet-zone modules
  function prep(c) {
    if (c._ready) return;
    var n = +c.dataset.n, bits = c.dataset.bits, total = n + M * 2, box = c.parentNode.parentNode;
    var css = box.clientWidth || 160, dpr = window.devicePixelRatio || 1;
    var cell = Math.max(2, Math.floor(css * dpr / total));
    c.width = c.height = cell * total;
    c.style.width = c.style.height = (cell * total / dpr) + 'px';
    var finder = [], rest = [];
    for (var i = 0; i < n * n; i++) {
      if (bits[i] !== '1') continue;
      var x = i % n, y = (i / n) | 0;
      var inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
      (inF ? finder : rest).push([x, y]);
    }
    for (var k = rest.length - 1; k > 0; k--) { var j = (Math.random() * (k + 1)) | 0, t = rest[k]; rest[k] = rest[j]; rest[j] = t; }
    c._d = { cell: cell, order: finder.concat(rest), ctx: c.getContext('2d'), size: c.width };
    c._ready = true;
  }
  function paint(c, count) {
    var d = c._d, ctx = d.ctx;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, d.size, d.size);
    ctx.fillStyle = DARK;
    for (var i = 0; i < count; i++) ctx.fillRect((d.order[i][0] + M) * d.cell, (d.order[i][1] + M) * d.cell, d.cell, d.cell);
  }
  function build(c) {
    prep(c);
    var box = c.parentNode.parentNode, total = c._d.order.length;
    cancelAnimationFrame(c._raf); box.classList.remove('built');
    if (reduce) { paint(c, total); box.classList.add('built'); return; }
    var start = null, dur = 1500;
    (function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 2);
      paint(c, Math.round(total * e));
      if (p < 1) c._raf = requestAnimationFrame(step); else box.classList.add('built');
    })(performance.now());
  }
  var canvases = document.querySelectorAll('.qc');
  function active() { return document.querySelector('.qrimg.on .qc'); }
  function showQR() { var c = active(); if (c) build(c); }

  /* ---- flip ---- */
  var flip = document.getElementById('flip'), flipped = false;
  function setFlip(v) {
    flipped = v; flip.classList.toggle('flipped', v);
    if (v) setTimeout(showQR, 450);
  }
  flip.addEventListener('click', function () { setFlip(!flipped); });
  flip.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(!flipped); } });

  /* ---- tabs ---- */
  var copy = {
    save: ['Scan to save contact', 'Point your phone camera at the code'],
    link: ['Scan to open this card', 'Save the contact or browse our website']
  };
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.toggle('on', x === t); });
      document.getElementById('qr-save').classList.toggle('on', t.dataset.t === 'save');
      document.getElementById('qr-link').classList.toggle('on', t.dataset.t === 'link');
      document.getElementById('qtitle').textContent = copy[t.dataset.t][0];
      document.getElementById('hint').textContent = copy[t.dataset.t][1];
      if (!flipped) setFlip(true); else showQR();
    });
  });

  /* ---- tilt + shine follow pointer / device ---- */
  var stage = document.getElementById('stage'), tilt = document.getElementById('tilt');
  var shines = document.querySelectorAll('.shine');
  function aim(nx, ny) {
    tilt.style.setProperty('--ry', (nx * 12).toFixed(1) + 'deg');
    tilt.style.setProperty('--rx', (-ny * 9).toFixed(1) + 'deg');
    shines.forEach(function (s) { s.style.setProperty('--mx', ((nx + 1) * 50) + '%'); s.style.setProperty('--my', ((ny + 1) * 50) + '%'); });
  }
  if (!reduce) {
    stage.addEventListener('pointermove', function (e) {
      var r = flip.getBoundingClientRect();
      aim(Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1)), Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1)));
    });
    stage.addEventListener('pointerleave', function () { aim(0, 0); });
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        aim(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30)));
      });
    }
  }

  /* draw static QR once so nothing is blank, replayed on flip */
  window.addEventListener('load', function () { canvases.forEach(function (c) { prep(c); paint(c, c._d.order.length); }); });
})();
