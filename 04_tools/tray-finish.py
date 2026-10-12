"""Finish the tray renders like a studio photo: gentle vignette + fine grain, saved as JPEG.
    python tray-finish.py      (06_packaging/mockups/trays/*.png -> *.jpg)"""
import glob, os
import cv2
import numpy as np

D = os.path.join(os.path.dirname(__file__), '..', '06_packaging', 'mockups', 'trays')
for f in sorted(glob.glob(os.path.join(D, '*.png'))):
    im = cv2.imread(f).astype(np.float32) / 255
    h, w = im.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2))
    im *= (1 - 0.13 * np.clip(r - 0.35, 0, None) ** 1.6)[..., None]
    g = cv2.GaussianBlur(np.random.default_rng(11).normal(0, 1, (h, w)).astype(np.float32), (0, 0), 0.7)
    im += (g / g.std() * 0.012)[..., None]
    cv2.imwrite(f[:-4] + '.jpg', np.clip(im * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    os.remove(f)
    print('finished', os.path.basename(f)[:-4] + '.jpg')
