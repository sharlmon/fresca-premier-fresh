#!/usr/bin/env python3
"""
SEO / AEO audit of the built static site (reads .output/public, no network needed).
  python3 04_tools/seo-audit.py [path-to-public] [--json]
Checks per page: title + description length and uniqueness, canonical, one H1, heading order, Open Graph / Twitter,
robots meta, JSON-LD (parses + required fields), images (alt, width/height), internal links (resolve to a real file),
word count, and site-wide files (robots.txt, sitemap.xml, llms.txt, 404).
"""
import sys, os, re, json, html
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin

ROOT = next((a for a in sys.argv[1:] if not a.startswith('--')), '05_website/site/.output/public')
AS_JSON = '--json' in sys.argv

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.title = ''; s.in_title = False; s.meta = {}; s.links = []; s.canon = None; s.h = []; s.imgs = []; s.a = []
        s.ld = []; s.in_ld = False; s.ld_buf = ''; s.text = []; s.skip = 0; s.cur_h = None; s.hbuf = ''; s.in_main = False; s.lang = None
    def handle_starttag(s, t, a):
        d = dict(a)
        if t == 'html': s.lang = d.get('lang')
        if t == 'title': s.in_title = True
        if t == 'meta':
            k = d.get('name') or d.get('property')
            if k: s.meta[k] = d.get('content', '')
        if t == 'link' and d.get('rel') == 'canonical': s.canon = d.get('href')
        if t == 'script' and d.get('type') == 'application/ld+json': s.in_ld = True; s.ld_buf = ''
        elif t in ('script', 'style', 'noscript'): s.skip += 1
        if t in ('h1','h2','h3','h4'): s.cur_h = t; s.hbuf = ''
        if t == 'img': s.imgs.append(d)
        if t == 'a' and d.get('href'): s.a.append(d)
        if t == 'main': s.in_main = True
    def handle_endtag(s, t):
        if t == 'title': s.in_title = False
        if t == 'script' and s.in_ld: s.in_ld = False; s.ld.append(s.ld_buf)
        elif t in ('script', 'style', 'noscript') and s.skip: s.skip -= 1
        if t in ('h1','h2','h3','h4') and s.cur_h == t: s.h.append((t, re.sub(r'\s+',' ',s.hbuf).strip())); s.cur_h = None
        if t == 'main': s.in_main = False
    def handle_data(s, x):
        if s.in_title: s.title += x
        if s.in_ld: s.ld_buf += x
        if s.skip: return
        if s.cur_h: s.hbuf += x
        if s.in_main: s.text.append(x)

pages = {}
for dp, dn, fn in os.walk(ROOT):
    for f in fn:
        if f == 'index.html':
            url = '/' + os.path.relpath(dp, ROOT).replace('.', '') .strip('/') + ('/' if os.path.relpath(dp, ROOT) != '.' else '')
            url = '/' if os.path.relpath(dp, ROOT) == '.' else '/' + os.path.relpath(dp, ROOT) + '/'
            p = P(); p.feed(open(os.path.join(dp, f), encoding='utf-8', errors='ignore').read()); pages[url] = p

def exists(path):
    path = path.split('#')[0].split('?')[0]
    if not path: return True
    full = os.path.join(ROOT, path.lstrip('/'))
    return os.path.isfile(full) or os.path.isfile(os.path.join(full, 'index.html')) or (path.endswith('/') and os.path.isfile(os.path.join(full, 'index.html')))

issues, warns = [], []
titles, descs = {}, {}
rows = []
for url, p in sorted(pages.items()):
    t = html.unescape(p.title).strip(); d = html.unescape(p.meta.get('description', '')).strip()
    h1s = [x for x in p.h if x[0] == 'h1']
    words = len(re.findall(r'\w+', ' '.join(p.text)))
    ldtypes = []
    for blk in p.ld:
        try:
            j = json.loads(blk)
            for n in (j.get('@graph') if isinstance(j, dict) and '@graph' in j else [j]):
                ldtypes.append(n.get('@type'))
        except Exception as e:
            issues.append(f'{url}: JSON-LD does not parse ({e})')
    rows.append((url, len(t), len(d), len(h1s), words, ','.join(map(str, ldtypes))))
    if not t: issues.append(f'{url}: missing <title>')
    elif len(t) > 65: warns.append(f'{url}: title is {len(t)} chars (aim ≤ 60): "{t}"')
    elif len(t) < 25: warns.append(f'{url}: title is short ({len(t)}): "{t}"')
    if not d: issues.append(f'{url}: missing meta description')
    elif len(d) > 160: warns.append(f'{url}: description {len(d)} chars (aim ≤ 160)')
    elif len(d) < 70: warns.append(f'{url}: description short ({len(d)})')
    titles.setdefault(t, []).append(url); descs.setdefault(d, []).append(url)
    if len(h1s) != 1: issues.append(f'{url}: {len(h1s)} <h1> tags (want exactly 1)')
    lv = [int(x[0][1]) for x in p.h]
    for a, b in zip(lv, lv[1:]):
        if b - a > 1: warns.append(f'{url}: heading jumps h{a} -> h{b}'); break
    if not p.canon: issues.append(f'{url}: missing canonical')
    elif not p.canon.endswith(url) and url != '/': warns.append(f'{url}: canonical is {p.canon}')
    for k in ('og:title', 'og:description', 'og:image', 'og:url', 'twitter:card'):
        if not p.meta.get(k): warns.append(f'{url}: missing {k}')
    if 'noindex' in p.meta.get('robots', '') and url not in ('/404.html/',): warns.append(f'{url}: robots = {p.meta.get("robots")}')
    if not p.lang: issues.append(f'{url}: <html> has no lang')
    for im in p.imgs:
        src = im.get('src', '')
        if 'alt' not in im: issues.append(f'{url}: <img> without alt: {src[-48:]}')
        if src and not src.startswith('data:') and not (im.get('width') and im.get('height')): warns.append(f'{url}: <img> without width/height (layout shift): {src[-48:]}')
    for a in p.a:
        href = a['href']
        if href.startswith(('mailto:', 'tel:', 'http', '#', 'javascript')): 
            continue
        if not exists(href): issues.append(f'{url}: broken internal link -> {href}')
        elif not href.split('?')[0].split('#')[0].endswith('/') and '.' not in href.split('?')[0].split('/')[-1] and not href.startswith('#') and href != '/': warns.append(f'{url}: internal link without trailing slash (extra redirect): {href}')
for t, us in titles.items():
    if len(us) > 1: issues.append(f'duplicate title "{t}" on {us}')
for d, us in descs.items():
    if len(us) > 1 and d: issues.append(f'duplicate description on {us}')

def has(f): return os.path.isfile(os.path.join(ROOT, f))
site = {f: has(f) for f in ('robots.txt', 'sitemap.xml', 'llms.txt', '404.html', 'og.jpg', 'favicon.ico', 'apple-touch-icon.png')}
sm = open(os.path.join(ROOT, 'sitemap.xml')).read() if has('sitemap.xml') else ''
urls_in_sm = set(re.findall(r'<loc>https?://[^/]+(/[^<]*)</loc>', sm))
for u in pages:
    if u not in ('/404.html/', '/200.html/') and u not in urls_in_sm: warns.append(f'{u}: not listed in sitemap.xml')
for u in urls_in_sm:
    if not exists(u): issues.append(f'sitemap lists a page that does not exist: {u}')

if AS_JSON:
    print(json.dumps({'pages': len(pages), 'issues': issues, 'warnings': warns, 'site': site})); sys.exit(0)
print(f'{len(pages)} pages in {ROOT}\n')
print(f'{"page":34}{"title":>6}{"desc":>6}{"h1":>4}{"words":>7}  structured data')
for r in rows: print(f'{r[0]:34}{r[1]:>6}{r[2]:>6}{r[3]:>4}{r[4]:>7}  {r[5]}')
print('\nsite files:', ', '.join(f'{k}={"yes" if v else "NO"}' for k, v in site.items()))
print(f'\nERRORS ({len(issues)})'); [print('  ✗', i) for i in issues]
print(f'\nWARNINGS ({len(warns)})'); [print('  !', w) for w in warns[:60]]
if len(warns) > 60: print(f'  … and {len(warns)-60} more')
sys.exit(1 if issues else 0)
