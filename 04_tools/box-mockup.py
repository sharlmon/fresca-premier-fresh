"""Put new carton artwork onto the real box photos.

    python box-mockup.py                 # every scene in 06_packaging/scenes.json, concept "kanga"
    python box-mockup.py IMG_5733 field  # one scene, another concept (lid studies)

Each face in scenes.json gives the four photo corners of a flat artwork panel (TL, TR, BR, BL of the art),
an optional mask polygon (defaults to those corners), and how to find hand holes (dark pixels kept from the photo).
Light is taken from the photo itself: the old print is split into ink colours, each colour's brightness relative
to its own median gives a smooth light map, and the white board (or a matching ink on a reference face) sets the
white point. The steel-table reflection of a face is updated by mirroring the change about the given axis.
Needs: numpy, opencv-python-headless (see 06_packaging/README.md).
"""
import json, os, sys
import cv2
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PK = os.path.join(ROOT, '06_packaging')
BOARD = np.array([0xfb, 0xfa, 0xf5], np.float32)  # unprinted board colour in the artwork (sRGB, RGB order)


def lin(x):  # sRGB 0..255 -> linear 0..1
    x = x / 255.0
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def srgb(x):  # linear -> sRGB 0..255
    x = np.clip(x, 0, 1)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * x ** (1 / 2.4) - 0.055) * 255.0


def poly_mask(shape, pts, ss=4):
    """anti-aliased polygon mask 0..1"""
    h, w = shape
    m = np.zeros((h * ss // ss, w), np.uint8)
    cv2.fillPoly(m, [np.round(np.array(pts, np.float32) * 16).astype(np.int32)], 255, cv2.LINE_AA, shift=4)
    return m.astype(np.float32) / 255.0


def clusters(rgb_lin, k):
    """k-means on chromaticity+lum, returns labels and per-cluster median colour (linear RGB)"""
    lum = rgb_lin.mean(1, keepdims=True) + 1e-4
    feat = np.hstack([rgb_lin / lum, np.log(lum) * 0.35]).astype(np.float32)
    _, lab, _ = cv2.kmeans(feat, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1e-3), 3, cv2.KMEANS_PP_CENTERS)
    lab = lab.ravel()
    med = [np.median(rgb_lin[lab == i], 0) if (lab == i).any() else np.zeros(3) for i in range(k)]
    return lab, np.array(med)


def face_light(orig_lin, mask, k, sigma):
    """smooth relative light map (1 = median) + cluster medians, from the photo's old print"""
    ys, xs = np.nonzero(mask > 0.5)
    px = orig_lin[ys, xs]
    lab, med = clusters(px, k)
    lum = px.mean(1)
    ref = np.array([med[l].mean() for l in lab]) + 1e-5
    ratio = np.zeros(mask.shape, np.float32); wgt = np.zeros(mask.shape, np.float32)
    # ignore pixels far from their cluster (edges of old print, anti-aliasing)
    r = lum / ref
    ok = (r > 0.5) & (r < 1.8)
    ratio[ys[ok], xs[ok]] = r[ok]; wgt[ys[ok], xs[ok]] = 1
    num = cv2.GaussianBlur(ratio, (0, 0), sigma); den = cv2.GaussianBlur(wgt, (0, 0), sigma) + 1e-6
    L = num / den
    counts = np.bincount(lab, minlength=k) / len(lab)
    return L, med, counts


def whitish(med, counts):
    best = None
    for c, n in zip(med, counts):
        sat = (c.max() - c.min()) / (c.max() + 1e-5)
        if n > 0.03 and sat < 0.25 and c.mean() > 0.25 and (best is None or c.mean() > best.mean()):
            best = c
    return best


def render(scene, concept, out_path, preview=None):
    img = cv2.imread(os.path.join(PK, scene['photo'] if '/' in scene['photo'] else os.path.join('photos', scene['photo'])))[:, :, ::-1].astype(np.float32)
    H, W = img.shape[:2]
    orig = lin(img)
    out = orig.copy()
    info = {}
    for fc in scene['faces']:
        if 'mask_art' in fc:  # mask given in the panel's own 0..1 coordinates
            A = cv2.getPerspectiveTransform(np.float32([[0, 0], [1, 0], [1, 1], [0, 1]]), np.float32(fc['quad']))
            fc['mask'] = cv2.perspectiveTransform(np.float32([fc['mask_art']]), A)[0].tolist()
    # pass 1: light + white point per face
    for fc in scene['faces']:
        q = np.array(fc['quad'], np.float32)
        poly = fc.get('mask', fc['quad'])
        m = poly_mask((H, W), poly)
        byname = {f['name']: f for f in scene['faces']}
        for ex in fc.get('exclude', []) + [byname[n].get('mask', byname[n]['quad']) for n in fc.get('exclude_faces', [])]:
            m *= 1 - poly_mask((H, W), ex)
        if fc.get('recolor'):
            # repaint only the old ink: pixels inside the polygon within the given HSV hue/sat/val ranges
            hsv = cv2.cvtColor(img.astype(np.uint8)[:, :, ::-1], cv2.COLOR_BGR2HSV)
            rc = fc['recolor']
            sel = np.ones((H, W), bool)
            for ch, key in ((0, 'hue'), (1, 'sat'), (2, 'val')):
                if key in rc:
                    sel &= (hsv[..., ch] >= rc[key][0]) & (hsv[..., ch] <= rc[key][1])
            sel = cv2.morphologyEx(sel.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
            sel = cv2.morphologyEx(sel, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
            m = m * cv2.GaussianBlur(sel.astype(np.float32), (0, 0), 1.0)
        if fc.get('inset', 2):
            m = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=fc.get('inset', 2))
        # holes / cut slots: dark or kraft-brown pixels kept from the photo
        g = img.mean(2)
        hole = (g < fc.get('hole', 45)).astype(np.uint8)
        if fc.get('kraft'):
            hsv = cv2.cvtColor(img.astype(np.uint8)[:, :, ::-1], cv2.COLOR_BGR2HSV)
            lo, hi = fc['kraft']
            hole |= ((hsv[..., 0] >= lo) & (hsv[..., 0] <= hi) & (hsv[..., 1] > 50) & (hsv[..., 1] < 200)).astype(np.uint8)
        hole &= (m > 0).astype(np.uint8)
        hole = cv2.morphologyEx(hole, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        n, cc, st, _ = cv2.connectedComponentsWithStats(hole)
        keep = np.zeros_like(hole)
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] >= fc.get('hole_min', 400):
                keep[cc == i] = 1
        keep = cv2.dilate(cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)), np.ones((3, 3), np.uint8), iterations=fc.get('hole_grow', 3))
        m = m * (1 - cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.2))
        diag = float(np.hypot(*(q.max(0) - q.min(0))))
        L, med, counts = face_light(orig, m, fc.get('k', 3), fc.get('light_sigma', 0.06) * diag)
        info[fc['name']] = dict(mask=m, L=L, med=med, counts=counts, white=whitish(med, counts))
    # white points: own white board, else ratio of matching ink against a reference face
    for fc in scene['faces']:
        d = info[fc['name']]
        if 'white' in fc:
            d['wp'] = lin(np.array(fc['white'], np.float32))
        elif d['white'] is not None and not fc.get('white_from'):
            d['wp'] = d['white']
        elif fc.get('same_light'):  # lit like the reference face: copy its white point
            d['wp'] = info[fc['white_from']]['white'].copy()
        else:
            ref = fc.get('white_from') or next(f['name'] for f in scene['faces'] if info[f['name']]['white'] is not None)
            r = info[ref]
            dom = d['med'][int(np.argmax(d['counts']))]
            ch = lambda c: c / (c.sum() + 1e-6)
            j = int(np.argmin([np.abs(ch(c) - ch(dom)).sum() + (0 if n > 0.03 else 9) for c, n in zip(r['med'], r['counts'])]))
            d['wp'] = r['white'] * dom / (r['med'][j] + 1e-6)
        d['wp'] = d['wp'] * fc.get('gain', 1.0)
    # pass 2: warp art, light it, composite
    for fc in scene['faces']:
        d = info[fc['name']]
        if fc.get('overlay'):
            # swap printed elements on an already-designed face: erase the old ink in the region from its own
            # background (board texture kept), then lay the new elements (RGBA art) on top, lit like the face
            dom = d['med'][int(np.argmax(d['counts']))]
            reg = d['mask'] > 0.5
            ink = (np.abs(orig - dom[None, None, :]).sum(2) > fc.get('ink', 0.06)) & reg
            ink = cv2.dilate(ink.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=fc.get('grow', 3)) & reg.astype(np.uint8)
            ys, xs = np.nonzero(reg)
            y0, y1, x0, x1 = max(ys.min() - 40, 0), min(ys.max() + 40, H), max(xs.min() - 40, 0), min(xs.max() + 40, W)
            o8 = np.clip(srgb(out[y0:y1, x0:x1]), 0, 255).astype(np.uint8)
            fill = lin(cv2.inpaint(o8, ink[y0:y1, x0:x1], 9, cv2.INPAINT_TELEA).astype(np.float32))
            # the inpainted area is smooth: give it back the board's grain from the untouched surroundings
            hp = orig[y0:y1, x0:x1] - cv2.GaussianBlur(orig[y0:y1, x0:x1], (0, 0), 2.5)
            clean = (cv2.dilate(ink[y0:y1, x0:x1], np.ones((9, 9), np.uint8)) == 0) & reg[y0:y1, x0:x1]
            sd = hp[clean].std(0) if clean.sum() > 500 else np.full(3, 0.004, np.float32)
            n = cv2.GaussianBlur(np.random.default_rng(5).normal(0, 1, (y1 - y0, x1 - x0)).astype(np.float32), (0, 0), 0.8)
            grain = (n / (n.std() + 1e-6))[..., None] * sd[None, None, :]
            a = cv2.GaussianBlur(ink[y0:y1, x0:x1].astype(np.float32), (0, 0), 1.0)[..., None]
            out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - a) + (fill + grain) * a
            art = cv2.imread(os.path.join(PK, 'art', fc['art']), cv2.IMREAD_UNCHANGED).astype(np.float32)
            ah, aw = art.shape[:2]
            q = np.array(fc['quad'], np.float32)
            M = cv2.getPerspectiveTransform(np.float32([[0, 0], [aw, 0], [aw, ah], [0, ah]]), q)
            wa = cv2.warpPerspective(art, M, (W, H), flags=cv2.INTER_AREA if aw > 2000 else cv2.INTER_LINEAR)
            rgb, al = wa[..., 2::-1], wa[..., 3:4] / 255.0
            rgb = cv2.GaussianBlur(rgb, (0, 0), fc.get('soft', 0.7)); al = cv2.GaussianBlur(al, (0, 0), fc.get('soft', 0.7))[..., None] if al.ndim == 2 else cv2.GaussianBlur(al[..., 0], (0, 0), fc.get('soft', 0.7))[..., None]
            new = lin(rgb) / lin(BOARD) * d['wp'][None, None, :] * d['L'][..., None]
            new = new * (1 + np.random.default_rng(3).normal(0, fc.get('grain', 0.015), (H, W, 1)).astype(np.float32))
            a = al * d['mask'][..., None]
            out = out * (1 - a) + new * a
            d['new'] = out.copy()
            continue
        if fc.get('art') == 'inpaint':  # erase a mark (old logo, QR) from its surroundings
            o8 = np.clip(srgb(out), 0, 255).astype(np.uint8)
            hm = (d['mask'] > 0.05).astype(np.uint8)
            hm = cv2.dilate(hm, np.ones((fc.get('grow', 15), fc.get('grow', 15)), np.uint8))
            fill = lin(cv2.inpaint(o8, hm, 25, cv2.INPAINT_TELEA).astype(np.float32))
            a = cv2.GaussianBlur(hm.astype(np.float32), (0, 0), 2)[..., None]
            out = out * (1 - a) + fill * a
            d['new'] = out.copy()
            continue
        art = cv2.imread(os.path.join(PK, 'art', concept if os.path.exists(os.path.join(PK, 'art', concept, fc['art'])) else 'kanga', fc['art']), cv2.IMREAD_COLOR)[:, :, ::-1]
        q = np.array(fc['quad'], np.float32)
        edge = max(np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3]), np.linalg.norm(q[3] - q[0]) * art.shape[1] / art.shape[0])
        s = min(1.0, 1.4 * edge / art.shape[1])
        art = cv2.resize(art, None, fx=s, fy=s, interpolation=cv2.INTER_AREA).astype(np.float32)
        ah, aw = art.shape[:2]
        if fc.get('flip'):
            art = art[:, ::-1]
        M = cv2.getPerspectiveTransform(np.float32([[0, 0], [aw, 0], [aw, ah], [0, ah]]), q)
        warped = cv2.warpPerspective(art, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        warped = cv2.GaussianBlur(warped, (0, 0), fc.get('soft', 0.8))
        refl = lin(warped) / lin(BOARD)  # reflectance relative to the board
        new = refl * d['wp'][None, None, :] * d['L'][..., None]
        # paper/corrugation grain like the photo's noise
        rng = np.random.default_rng(7)
        new = new * (1 + rng.normal(0, fc.get('grain', 0.018), (H, W, 1)).astype(np.float32))
        a = d['mask'][..., None]
        out = out * (1 - a) + new * a
        d['new'] = new
    # reflections in the steel table: inpaint the old print's strong features out of the reflection,
    # then add the new face's reflection (mirrored about the table line, smeared like brushed steel)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    xs = np.arange(W, dtype=np.float32)
    boxmask = np.clip(sum(info[f['name']]['mask'] for f in scene['faces']), 0, 1)
    for fc in scene['faces']:
        rf = fc.get('reflect')
        if not rf:
            continue
        d = info[fc['name']]
        bl = rf.get('blur', [5, 20])
        G = lambda im, k=1: cv2.GaussianBlur(im, (0, 0), sigmaX=bl[0] * k, sigmaY=bl[1] * k)
        (x1, y1), (x2, y2) = rf['axis']
        ay = y1 + (y2 - y1) * (xs - x1) / (x2 - x1)
        srcy = ay[None, :] - (yy - ay[None, :]) / rf.get('stretch', 1.0)
        below = (yy > ay[None, :]).astype(np.float32) * (1 - boxmask)
        if 'area' in rf:
            below *= poly_mask((H, W), rf['area'])
        mir = lambda im: cv2.remap(im, xx, srcy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
        # footprint of the face's reflection on the table
        foot = G(mir(d['mask']), 1.0) * below
        hole = (foot > 0.02).astype(np.uint8)
        hole = cv2.dilate(hole, np.ones((41, 41), np.uint8))
        sc = 6
        small = cv2.resize(srgb(out), (W // sc, H // sc), interpolation=cv2.INTER_AREA).astype(np.uint8)
        hs = cv2.resize(hole, (W // sc, H // sc), interpolation=cv2.INTER_NEAREST)
        # bare table: inpainted from around the footprint, smeared along the brushing
        T = cv2.inpaint(small, hs, 15, cv2.INPAINT_TELEA).astype(np.float32)
        T = cv2.GaussianBlur(T, (0, 0), sigmaX=3, sigmaY=12)
        T = lin(cv2.resize(T, (W, H), interpolation=cv2.INTER_CUBIC))
        S_old, S_new = G(mir(orig * d['mask'][..., None])), G(mir(d['new'] * d['mask'][..., None]))
        sel = (foot > 0.9) & (hole > 0)
        r = rf.get('r') or float(np.clip(((orig - T)[sel] * S_old[sel]).sum() / ((S_old[sel] ** 2).sum() + 1e-9), 0.05, 0.9))
        # keep the steel's fine scratches (small-scale detail only, clipped so old print edges cannot come back)
        hp = orig - cv2.GaussianBlur(orig, (0, 0), 3)
        hp = np.clip(hp, -rf.get('detail', 0.012), rf.get('detail', 0.012))
        fade = np.exp(-np.clip(yy - ay[None, :], 0, None) / rf.get('fade', 1e9))[..., None]
        rebuilt = T + hp + r * S_new * fade
        soft = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 20)[..., None] * (1 - boxmask[..., None])
        if 'area' in rf:
            soft = soft * poly_mask((H, W), rf['area'])[..., None]
        out = out * (1 - soft) + rebuilt * soft
        print(f"  {fc['name']}: reflectivity {r:.2f}")
    res = np.clip(srgb(out), 0, 255).astype(np.uint8)[:, :, ::-1]
    cv2.imwrite(out_path, res, [cv2.IMWRITE_JPEG_QUALITY, 90])
    if preview:
        cv2.imwrite(preview, cv2.resize(res, (W // 3, H // 3), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 88])
    return res


if __name__ == '__main__':
    scenes = json.load(open(os.path.join(PK, 'scenes.json')))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    concept = sys.argv[2] if len(sys.argv) > 2 else 'kanga'
    od = os.path.join(PK, 'mockups', concept); os.makedirs(od, exist_ok=True)
    for sc in scenes:
        name = sc.get('out', sc['photo'].split('/')[-1].split('.')[0])
        if only and only not in name:
            continue
        dst = os.path.join(PK, 'mockups', 'approved', f'{name}.jpg') if 'out' in sc else os.path.join(od, f'{name}_fresca_{concept}.jpg')
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        render(sc, concept, dst, os.environ.get('PREVIEW') and os.path.join(os.environ['PREVIEW'], f'{name}_{concept}.jpg'))
        print('done', name, concept)
