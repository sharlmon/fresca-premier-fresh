// Renders every panel HTML to an exact-size PDF (cm) + a small PNG preview, and flags anything that overflows its panel.
// Usage: node wall-panels-render.mjs [filter]   (needs puppeteer-core; path to it via PPT env var)
import fs from 'fs'
const ppt = await import(process.env.PPT || 'puppeteer-core')
const puppeteer = ppt.default || ppt
const ROOT = '/Users/admin/Desktop/frescape/07_wall-stickers/panels'
const panels = JSON.parse(fs.readFileSync(`${ROOT}/source/panels.json`, 'utf8')).filter((p) => !process.argv[2] || p.file.includes(process.argv[2]))
fs.mkdirSync(`${ROOT}/pdf`, { recursive: true }); fs.mkdirSync(`${ROOT}/preview`, { recursive: true })
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let bad = 0
for (const p of panels) {
  const page = await b.newPage()
  const k = Math.min(4, 3000 / Math.max(p.w, p.h)) // px per cm for checks/previews
  const CM = 96 / 2.54
  await page.setViewport({ width: Math.round(p.w * CM), height: Math.round(p.h * CM), deviceScaleFactor: k / CM })
  await page.goto(`file://${ROOT}/source/${p.file}.html`, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready); await sleep(300)
  const over = await page.evaluate(() => {
    const root = document.querySelector('.p').getBoundingClientRect(); const out = []
    document.querySelectorAll('.p .in *').forEach((e) => {
      if (e.closest('.bg,.ov')) return
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) return
      if (r.right > root.right + 2 || r.left < root.left - 2 || r.bottom > root.bottom + 2 || r.top < root.top - 2) out.push(e.tagName + '.' + e.className + ' "' + (e.textContent || '').trim().slice(0, 30) + '"')
      if (['H1', 'H3', 'P', 'SPAN', 'B'].includes(e.tagName) && (e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflow !== 'visible')) out.push('clipped ' + e.tagName)
    })
    // text running outside its card
    document.querySelectorAll('.rule').forEach((c) => { const cr = c.getBoundingClientRect(); c.querySelectorAll('h3,p').forEach((t) => { const r = t.getBoundingClientRect(); if (r.bottom > cr.bottom + 1 || r.top < cr.top - 1) out.push('text outside card: ' + t.textContent.slice(0, 30)) }) })
    return out
  })
  if (over.length) { bad++; console.log('!!', p.file, over.slice(0, 4).join(' | ')) }
  await page.screenshot({ path: `${ROOT}/preview/${p.file}.png` })
  await page.pdf({ path: `${ROOT}/pdf/${p.file}.pdf`, width: `${p.w}cm`, height: `${p.h}cm`, printBackground: true, preferCSSPageSize: true, pageRanges: '1' })
  await page.close()
}
await b.close()
console.log('rendered', panels.length, 'panels;', bad, 'with overflow warnings')
