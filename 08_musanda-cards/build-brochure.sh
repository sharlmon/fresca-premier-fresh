#!/bin/bash
# Builds the folded brochure: print PDF (2 sheets A4 landscape) + pages PDF (4 x A5, reading order) + previews
set -e
cd "$(dirname "$0")"
node build-brochure.js
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="$PWD/brochure/Musanda-Harambee-Brochure-PRINT-A4-landscape.pdf" "file://$PWD/brochure/print.html" >/dev/null 2>&1
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="$PWD/brochure/Musanda-Harambee-Brochure-pages-A5.pdf" "file://$PWD/brochure/pages.html" >/dev/null 2>&1
"${PYTHON:-python3}" - <<'PY'
import pymupdf as fitz
for n,f in (('print','Musanda-Harambee-Brochure-PRINT-A4-landscape'),('pages','Musanda-Harambee-Brochure-pages-A5')):
    d=fitz.open(f'brochure/{f}.pdf'); print(n,len(d),d[0].rect)
    for p in d: p.get_pixmap(dpi=75).save(f'brochure/preview-{n}-{p.number+1}.png')
PY
