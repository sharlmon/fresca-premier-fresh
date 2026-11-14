#!/bin/bash
# Rebuilds the wall stickers: HTML -> one PDF per sticker + one combined PDF, and PNG previews.
set -e
ROOT="/Users/admin/Desktop/frescape"
cd "$ROOT/04_tools"
node wall-stickers-build.js
mkdir -p "$ROOT/07_wall-stickers/final" "$ROOT/07_wall-stickers/preview"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for f in "$ROOT"/07_wall-stickers/source/*.html; do
  b=$(basename "$f" .html)
  [ "$b" = "00-all" ] && out="Premier-wall-stickers-ALL" || out="Premier-wall-sticker-$b"
  "$CH" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$ROOT/07_wall-stickers/final/$out.pdf" "file://$f" >/dev/null 2>&1
done
# previews (small PNGs, not for print)
for f in "$ROOT"/07_wall-stickers/source/[01][0-9]-*.html; do
  b=$(basename "$f" .html)
  "$CH" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=2268,3201 --force-device-scale-factor=0.3 --screenshot="$ROOT/07_wall-stickers/preview/${b:0:2}.png" "file://$f" >/dev/null 2>&1
done
