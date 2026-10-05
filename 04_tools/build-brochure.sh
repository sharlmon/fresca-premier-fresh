#!/bin/bash
# Rebuilds the brochure (both colour versions, both people on the last page).
# Needs: node (npm install in this folder), Google Chrome, python3 with pymupdf (pip install pymupdf)
set -e
ROOT="/Users/admin/Desktop/frescape"
PY="${PYTHON:-python3}"
cd "$ROOT/04_tools"
for THEME in bold classic; do
  if [ "$THEME" = classic ]; then T=""; else T=bold; fi
  THEME=$T node brochure-build.js
  [ "$THEME" = bold ] && NAME=Bold || NAME=Classic
  OUT="$ROOT/03_brochure/final/$THEME"
  mkdir -p "$OUT/pages"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$OUT/raw.pdf" "file://$ROOT/03_brochure/source/brochure-$THEME.html" >/dev/null 2>&1
  "$PY" - "$OUT" "$NAME" <<'PY'
import pymupdf as fitz, os, sys
out, name = sys.argv[1:3]
d = fitz.open(f'{out}/raw.pdf')
for p in d:
    n = p.number + 1
    o = fitz.open(); o.insert_pdf(d, from_page=p.number, to_page=p.number)
    o.set_metadata({'title': f'Fresca Premier Fresh Brochure - Page {n}'}); o.save(f'{out}/pages/{n}.pdf', garbage=3, deflate=True)
    p.get_pixmap(dpi=150).save(f'{out}/pages/{n}.png')
d.set_toc([[1, str(i), i] for i in range(1, len(d) + 1)])
d.set_metadata({'title': f'Fresca Premier Fresh - Company Profile (A4) - {name}'})
d.save(f'{out}/Fresca-Brochure-A4-{name}.pdf', garbage=3, deflate=True); d.close(); os.remove(f'{out}/raw.pdf')
print(name, 'ok')
PY
done
cd "$ROOT/03_brochure" && rm -f final/Fresca-Brochure-A4-both-versions.zip && zip -qr final/Fresca-Brochure-A4-both-versions.zip final/bold final/classic
echo "Done -> $ROOT/03_brochure/final"
