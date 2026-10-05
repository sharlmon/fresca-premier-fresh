#!/usr/bin/env python3
"""
Produce-photo retouching for Fresca: finds small blemishes (dark specks, brown spots, tiny white flecks)
on green produce and heals them with texture taken from the surrounding produce.

Only small, compact marks are touched. Natural features are protected: the gaps between pods, glossy
highlights, seams, bean tips and the tray edge. Shape, size and number of the produce never change.
Originals are never modified.

  python photo-retouch.py in.jpg out.jpg [options]

  --add  x,y[,r]    heal the mark nearest this point (snaps to the blob; optional search radius r, default 26)
  --disk x,y,r      heal an exact round area (for larger smudges the auto-detector ignores)
  --soft x,y,r      for faint, soft discolouration: keeps the skin texture, replaces only the colour/tone with
                    a smooth blend of the surrounding produce (no patch copying, so no visible repeat/edge)
  --keep x,y,r      never touch this area (e.g. a natural feature)
  --sens f          automatic detection sensitivity, 1.0 = default; 0.8 finds fainter marks (use on smooth produce)
  --no-auto         skip automatic detection; only heal the --add / --disk spots
  --debug file.png  also save the original with every healed spot ringed

Needs: pip install opencv-python-headless numpy
"""
import sys
import cv2
import numpy as np

# --- tuning (pixel sizes are for ~12 MP phone photos, 3024 x 4032) -------------------------------
BG_KERNEL = 31          # size of the "what should be here" neighbourhood
DARK_DELTA = 26         # how much darker than its surroundings a dark speck must be (L units)
BROWN_DELTA = 11        # how much redder/yellower than its surroundings a brown mark must be (a* units)
BROWN_DARK = 9          # ...and how much darker
WHITE_DELTA = 40        # how much brighter a white fleck must be
Z_MIN = 3.4             # ...and it must stand out from the LOCAL texture by this many standard deviations
STD_WIN = 41            # window used to measure the local texture
MAX_AREA = 300          # largest mark to remove automatically (px). Bigger = real feature, not a speck
MIN_AREA = 4
MAX_SIDE = 28           # longest side of a mark's bounding box
MIN_FILL = 0.28         # marks are roundish blobs, not long thin lines (gaps)
PAD = 3                 # grow each mark slightly so its edge is removed too
TIP_GUARD = 27          # keep this far from dark gaps / tray: bean tips and pod ends live there


def _maps(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    L, A = lab[..., 0], lab[..., 1].astype(np.float32)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    bgL = cv2.medianBlur(L, BG_KERNEL).astype(np.float32)
    bgA = cv2.medianBlur(lab[..., 1], BG_KERNEL).astype(np.float32)
    return L, A, hsv, L.astype(np.float32) - bgL, bgL - L.astype(np.float32), A - bgA


def detect(img, keep=None):
    """Return (mask, info). mask = 255 where a blemish should be healed."""
    L, A, hsv, d_brighter, dL, dA = _maps(img)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    def local_std(x):
        m = cv2.boxFilter(x, -1, (STD_WIN, STD_WIN))
        m2 = cv2.boxFilter(x * x, -1, (STD_WIN, STD_WIN))
        return np.sqrt(np.maximum(m2 - m * m, 1.0))
    zL, zA = dL / local_std(dL), dA / local_std(dA)

    green = ((h > 22) & (h < 85) & (s > 40) & (v > 50)).astype(np.uint8)
    produce = cv2.morphologyEx(green, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    produce = cv2.erode(produce, np.ones((9, 9), np.uint8))

    very_dark = (v < 62).astype(np.uint8)
    near_dark = cv2.dilate(very_dark, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (TIP_GUARD, TIP_GUARD)))

    cand = np.zeros(L.shape, np.uint8)
    cand[(dL > DARK_DELTA) & (zL > Z_MIN)] = 255
    cand[(dA > BROWN_DELTA) & (dL > BROWN_DARK) & (zA > Z_MIN)] = 255
    cand[(d_brighter > WHITE_DELTA) & (-zL > Z_MIN) & (s < 70)] = 255      # tiny bright flecks
    cand[produce == 0] = 0
    cand[near_dark > 0] = 0
    if keep is not None:
        cand[keep > 0] = 0
    cand = cv2.morphologyEx(cand, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    cand = cv2.morphologyEx(cand, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

    n, lbl, st, _ = cv2.connectedComponentsWithStats(cand, connectivity=8)
    out = np.zeros_like(cand)
    kept = 0
    for i in range(1, n):
        x, y, w, hgt, area = st[i]
        if area < MIN_AREA or area > MAX_AREA or max(w, hgt) > MAX_SIDE:
            continue
        if area / float(w * hgt) < MIN_FILL:
            continue
        out[lbl == i] = 255
        kept += 1
    return cv2.dilate(out, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * PAD + 1, 2 * PAD + 1))), {"candidates": n - 1, "healed": kept}


def snap(img, x, y, r=26):
    """Mask for the mark nearest (x, y): the strongest local outlier (dark OR bright) within r px."""
    L, A, hsv, d_bright, dL, dA = _maps(img)
    H, W = L.shape
    x0, y0, x1, y1 = max(0, x - r), max(0, y - r), min(W, x + r), min(H, y + r)
    dev = np.maximum(np.abs(dL), np.abs(dA) * 1.6)[y0:y1, x0:x1]
    yy, xx = np.mgrid[y0:y1, x0:x1]
    dev = dev * (((xx - x) ** 2 + (yy - y) ** 2) <= r * r)
    py, px = np.unravel_index(np.argmax(dev), dev.shape)
    peak = dev[py, px]
    m = np.zeros((H, W), np.uint8)
    if peak < 8:                                    # nothing obvious: fall back to a small disk
        cv2.circle(m, (x, y), 9, 255, -1)
        return m
    sub = (dev > max(6.0, peak * 0.4)).astype(np.uint8)
    n, lbl = cv2.connectedComponents(sub, connectivity=8)
    comp = (lbl == lbl[py, px]).astype(np.uint8)
    if comp.sum() > 900:                            # runaway region -> don't trust it
        cv2.circle(m, (x0 + px, y0 + py), 11, 255, -1)
        return m
    m[y0:y1, x0:x1] = comp * 255
    return cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * PAD + 3, 2 * PAD + 3)))


def heal(img, mask):
    """Replace each marked blemish with matching texture copied from nearby clean produce."""
    out = img.copy()
    blocked = cv2.dilate(mask, np.ones((9, 9), np.uint8))
    n, lbl, st, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    H, W = mask.shape
    done = 0
    for i in range(1, n):
        x, y, w, hgt, _ = st[i]
        ctx = 7 + int(0.15 * max(w, hgt))
        x0, y0 = max(0, x - ctx), max(0, y - ctx)
        x1, y1 = min(W, x + w + ctx), min(H, y + hgt + ctx)
        tw, th = x1 - x0, y1 - y0
        if tw < 8 or th < 8:
            continue
        tmpl = out[y0:y1, x0:x1].astype(np.float32)
        spot = (lbl[y0:y1, x0:x1] == i).astype(np.uint8)
        known = (1 - cv2.dilate(spot, np.ones((3, 3), np.uint8))).astype(np.float32)
        known3 = np.dstack([known] * 3)
        R = 70 + max(w, hgt)
        sx0, sy0 = max(0, x0 - R), max(0, y0 - R)
        sx1, sy1 = min(W, x1 + R), min(H, y1 + R)
        search = out[sy0:sy1, sx0:sx1].astype(np.float32)
        if search.shape[0] < th or search.shape[1] < tw:
            continue
        res = cv2.matchTemplate(search, tmpl, cv2.TM_SQDIFF, mask=known3)
        res[~np.isfinite(res)] = np.inf
        bl = blocked[sy0:sy1, sx0:sx1].astype(np.float32)
        ii = cv2.integral(bl)
        rh, rw = res.shape
        ys, xs = np.mgrid[0:rh, 0:rw]
        overlap = ii[ys + th, xs + tw] - ii[ys, xs + tw] - ii[ys + th, xs] + ii[ys, xs]
        res[overlap > 0] = np.inf
        if not np.isfinite(res).any():
            continue
        by, bx = np.unravel_index(np.argmin(res), res.shape)
        src = search[by:by + th, bx:bx + tw]
        ring = known > 0
        if ring.sum() > 10:
            src = np.clip(src + (tmpl[ring].mean(0) - src[ring].mean(0)), 0, 255)
        soft = np.clip(cv2.GaussianBlur(spot.astype(np.float32), (0, 0), 1.6) * 1.4, 0, 1)[..., None]
        out[y0:y1, x0:x1] = (tmpl * (1 - soft) + src * soft).astype(np.uint8)
        done += 1
    return out, done


def heal_soft(img, soft_mask, radius_hint=20):
    """Frequency separation: keep fine texture, swap the low-frequency colour/tone inside the mask
    for a smooth estimate built only from the pixels around it."""
    f = img.astype(np.float32)
    sig_t = 3.0                                       # below this size = texture, above = colour/tone
    low = cv2.GaussianBlur(f, (0, 0), sig_t)
    high = f - low
    m = (soft_mask > 0).astype(np.float32)
    outside = 1.0 - cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
    sig_big = max(8.0, radius_hint * 0.9)
    num = cv2.GaussianBlur(low * outside[..., None], (0, 0), sig_big)
    den = cv2.GaussianBlur(outside, (0, 0), sig_big)[..., None]
    fill = num / np.maximum(den, 1e-3)
    ok = (den > 0.05).astype(np.float32)
    alpha = cv2.GaussianBlur(m, (0, 0), max(2.0, radius_hint * 0.30))
    alpha = np.clip(alpha * 1.25, 0, 1)[..., None] * ok
    new = fill + high * 0.9
    return np.clip(f * (1 - alpha) + new * alpha, 0, 255).astype(np.uint8)


def overlay(img, mask):
    o = img.copy()
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in cnts:
        (cx, cy), r = cv2.minEnclosingCircle(c)
        cv2.circle(o, (int(cx), int(cy)), int(r) + 14, (255, 0, 255), 3)
    return o


def _pts(argv, flag, n_min):
    out = []
    for i, a in enumerate(argv):
        if a == flag:
            out.append([int(float(v)) for v in argv[i + 1].split(",")])
    for p in out:
        if len(p) < n_min:
            sys.exit(f"{flag} needs at least {n_min} numbers: x,y" + (",r" if n_min == 3 else "[,r]"))
    return out


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    img = cv2.imread(src)
    H, W = img.shape[:2]
    if "--sens" in sys.argv:
        k = float(sys.argv[sys.argv.index("--sens") + 1])
        DARK_DELTA, BROWN_DELTA, BROWN_DARK, Z_MIN = DARK_DELTA * k, BROWN_DELTA * k, BROWN_DARK * k, Z_MIN * (0.5 + 0.5 * k)
    keep = np.zeros((H, W), np.uint8)
    for x, y, r in _pts(sys.argv, "--keep", 3):
        cv2.circle(keep, (x, y), r, 255, -1)
    mask = np.zeros((H, W), np.uint8)
    info = {"candidates": 0, "healed": 0}
    if "--no-auto" not in sys.argv:
        mask, info = detect(img, keep)
    manual = 0
    for p in _pts(sys.argv, "--add", 2):
        m = snap(img, p[0], p[1], p[2] if len(p) > 2 else 26)
        m[keep > 0] = 0
        mask = cv2.bitwise_or(mask, m)
        manual += 1
    for x, y, r in _pts(sys.argv, "--disk", 3):
        m = np.zeros((H, W), np.uint8)
        cv2.circle(m, (x, y), r, 255, -1)
        mask = cv2.bitwise_or(mask, m)
        manual += 1
    fixed, n = heal(img, mask)
    softs = _pts(sys.argv, "--soft", 3)
    if softs:
        sm = np.zeros((H, W), np.uint8)
        for x, y, r in softs:
            cv2.circle(sm, (x, y), r, 255, -1)
        fixed = heal_soft(fixed, sm, int(np.mean([p[2] for p in softs])))
        mask = cv2.bitwise_or(mask, sm)
        manual += len(softs)
    cv2.imwrite(dst, fixed, [cv2.IMWRITE_JPEG_QUALITY, 95])
    if "--debug" in sys.argv:
        cv2.imwrite(sys.argv[sys.argv.index("--debug") + 1], overlay(img, mask))
    print(f"{src}: {info['healed']} automatic + {manual} manual -> {n} areas healed")
