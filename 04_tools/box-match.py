"""Find a face's corners in another photo of the same printed carton by feature matching.

    python box-match.py REF.jpg '[[x,y]*4]' W H TARGET.jpg [MASK_POLY_JSON]
prints the face quad in TARGET (may extend outside the frame). The reference quad comes from scenes.json.
"""
import json, sys
import cv2
import numpy as np

ref, q, W, H, tgt = sys.argv[1], np.float32(json.loads(sys.argv[2])), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
R = np.float32([[0, 0], [W, 0], [W, H], [0, H]])
flat = cv2.warpPerspective(cv2.imread(ref, 0), cv2.getPerspectiveTransform(q, R), (W, H))
img = cv2.imread(tgt, 0)
s = 0.5
img_s = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
sift = cv2.SIFT_create(8000)
k1, d1 = sift.detectAndCompute(flat, None)
mask = None
if len(sys.argv) > 6:
    mask = np.zeros(img_s.shape, np.uint8)
    cv2.fillPoly(mask, [np.int32(np.float32(json.loads(sys.argv[6])) * s)], 255)
k2, d2 = sift.detectAndCompute(img_s, mask)
m = cv2.BFMatcher().knnMatch(d1, d2, k=2)
good = [a for a, b in m if a.distance < 0.72 * b.distance]
src = np.float32([k1[g.queryIdx].pt for g in good]); dst = np.float32([k2[g.trainIdx].pt for g in good]) / s
Hm, inl = cv2.findHomography(src, dst, cv2.RANSAC, 6.0)
out = cv2.perspectiveTransform(R[None], Hm)[0]
print(json.dumps([[round(float(x)), round(float(y))] for x, y in out]), f'# {int(inl.sum())}/{len(good)} inliers', file=sys.stdout)
