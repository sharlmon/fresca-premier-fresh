#!/bin/bash
# Rebuilds the two printable business-card PDFs (front + QR back, 90x55mm + 3mm bleed).
set -e
ROOT="/Users/admin/Desktop/frescape"
cd "$ROOT/04_tools"
node ecard-print-cards.js
for s in lucas judy; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf="$ROOT/02_ecards/print-cards/Fresca-card-$s-print.pdf" "file://$PWD/print-$s.html" >/dev/null 2>&1
  rm -f print-$s.html
done
