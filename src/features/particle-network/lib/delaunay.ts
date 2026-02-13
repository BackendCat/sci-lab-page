/* ═══ Bowyer-Watson Delaunay Triangulation ═══ */

import type { Point } from "./physics";

type Circumcircle = { x: number; y: number; r: number };

type Triangle = {
  v: [number, number, number];
  c: Circumcircle;
};

const dx2 = (a: Point, b: Point): number =>
  (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

const circumcircle = (
  pts: Point[],
  i: number,
  j: number,
  k: number,
): Circumcircle => {
  const a = pts[i];
  const b = pts[j];
  const c = pts[k];
  const D =
    2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));

  if (Math.abs(D) < 1e-10) return { x: 0, y: 0, r: 1e10 };

  const aSq = a.x * a.x + a.y * a.y;
  const bSq = b.x * b.x + b.y * b.y;
  const cSq = c.x * c.x + c.y * c.y;

  const ux =
    (aSq * (b.y - c.y) + bSq * (c.y - a.y) + cSq * (a.y - b.y)) / D;
  const uy =
    (aSq * (c.x - b.x) + bSq * (a.x - c.x) + cSq * (b.x - a.x)) / D;

  return { x: ux, y: uy, r: Math.hypot(a.x - ux, a.y - uy) };
};

export const delaunay = (pts: Point[]): number[][] => {
  if (pts.length < 3) return [];

  const superTri: Point[] = [
    { x: -1e5, y: -1e5 },
    { x: 1e5, y: -1e5 },
    { x: 0, y: 1e5 },
  ];

  let tris: Triangle[] = [
    { v: [0, 1, 2], c: circumcircle(superTri, 0, 1, 2) },
  ];

  const all: Point[] = [...superTri, ...pts];

  for (let i = 3; i < all.length; i++) {
    const p = all[i];
    const bad: Triangle[] = [];
    const poly: [number, number][] = [];

    for (let t = tris.length - 1; t >= 0; t--) {
      const tr = tris[t];
      if (dx2(p, tr.c) < tr.c.r * tr.c.r) {
        bad.push(tr);
        tris.splice(t, 1);
      }
    }

    for (const tr of bad) {
      for (let j = 0; j < 3; j++) {
        const e: [number, number] = [
          tr.v[j],
          tr.v[((j + 1) % 3) as 0 | 1 | 2],
        ];
        e.sort((a, b) => a - b);
        const dup = poly.findIndex(
          (p2) => p2[0] === e[0] && p2[1] === e[1],
        );
        if (dup >= 0) {
          poly.splice(dup, 1);
        } else {
          poly.push(e);
        }
      }
    }

    for (const e of poly) {
      tris.push({
        v: [e[0], e[1], i],
        c: circumcircle(all, e[0], e[1], i),
      });
    }
  }

  return tris
    .filter((t) => t.v[0] > 2 && t.v[1] > 2 && t.v[2] > 2)
    .map((t) => t.v.map((v) => v - 3));
};
