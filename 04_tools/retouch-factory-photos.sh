#!/bin/bash
# Re-creates the retouched factory photos from the originals in ../frescaimages (never modified).
#   - HEIC -> JPEG via macOS `sips`
#   - photo-retouch.py: automatic blemish detection + the manual spots listed below (found by reviewing each photo)
# Output goes to ../01_client-assets/factory-photos-retouched/full-res (then run the export step in README if web files are needed).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"; OUT="$ROOT/01_client-assets/factory-photos-retouched/full-res"; mkdir -p "$OUT"
RT="python3 $ROOT/04_tools/photo-retouch.py"
conv() { sips -s format jpeg -s formatOptions 95 "$ROOT/frescaimages/$1.HEIC" --out "$TMP/$1.jpg" >/dev/null; }

conv IMG_5684
$RT "$TMP/IMG_5684.jpg" "$OUT/french-beans-tray.jpg" \
  --disk 1145,3000,32 --disk 2726,2237,24 \
  --soft 788,697,30 --soft 850,680,28 --soft 903,677,18 --soft 963,677,30 --soft 1023,678,26 --soft 1165,3033,16 \
  --add 2161,1268 --add 1410,3265 --add 1475,3851 --add 1062,2044 \
  --add 690,1771 --add 710,1760 --add 785,1917 --add 1886,1544 --add 2049,3412 --add 1674,2406 --add 903,3220 \
  --disk 2331,2956,14 --soft 1304,3268,16 --keep 1430,2141,70 --keep 1450,2140,40

conv IMG_5687
$RT "$TMP/IMG_5687.jpg" "$OUT/snow-peas-tray.jpg" \
  --add 2594,2075 --add 781,2504 --add 879,2645 --add 1400,2441 --add 433,3635 --add 2498,2485 --add 2394,3217 --add 2270,3597 --add 2625,2017 --add 2281,3630 --add 2375,3620 --add 2117,2248 --add 2028,1384 --add 2328,2428 --add 606,2817 --add 2214,3392

conv IMG_5689
$RT "$TMP/IMG_5689.jpg" "$OUT/sugar-snaps-tray.jpg" \
  --add 2193,1915 --add 2408,3524 --add 1882,2978 --add 945,994 --add 1913,516 --add 2340,407 --add 623,3914 --add 1198,644 --add 2312,408 \
  --soft 858,1846,24 --disk 1841,947,11 --disk 2498,2198,10

conv IMG_5678
$RT "$TMP/IMG_5678.jpg" "$OUT/sugar-snaps-closeup.jpg" --no-auto \
  --add 2336,3573 --add 344,3579 --add 1253,2152 --add 1896,2078 --add 549,1445 --add 2879,2858

# beans bunch: natural stalk ends are kept as they are, so it is only converted
sips -s format jpeg -s formatOptions 95 "$ROOT/frescaimages/IMG_5694.heic" --out "$OUT/french-beans-bunch.jpg" >/dev/null
rm -rf "$TMP"; echo "done -> $OUT"
