#!/bin/bash
# Builds the pages, then renders the A4 print PDF + PNG previews with Chrome
set -e
cd "$(dirname "$0")"
node build.js
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="$PWD/print/Musanda-Harambee-Card-A4.pdf" "file://$PWD/print/card-a4.html" >/dev/null 2>&1
"${PYTHON:-python3}" - <<'PY'
import pymupdf as fitz
d = fitz.open('print/Musanda-Harambee-Card-A4.pdf')
print('pages', len(d), d[0].rect)
for p in d: p.get_pixmap(dpi=70).save(f'print/preview-{p.number+1}.png')
PY
