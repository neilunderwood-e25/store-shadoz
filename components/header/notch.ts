// Geometry for the header's glass "notch": one path with three humps that sit behind the left
// group (tabs or menu button), the logo, and the right group (icons). Ported from the design.

type Hump = { x0: number; x1: number; full: number };

export type NotchGeometry = {
  W: number;
  t: number; // depth of the thin strip between humps
  r: number; // inner curve radius
  R: number; // outer curve radius
  humps: Hump[];
  cx: number; // logo centre, for the soft glow behind it
  coreR: number;
};

const round = (v: number) => Math.round(v * 10) / 10;

export function measureNotch(
  nav: HTMLElement,
  left: HTMLElement,
  logo: HTMLElement,
  right: HTMLElement,
  mobile: boolean,
): NotchGeometry | null {
  const n = nav.getBoundingClientRect();
  if (!n.width) return null;

  const t = mobile ? 8 : 10;
  const r = mobile ? 10 : 14;
  const R = mobile ? 14 : 18;
  const side = mobile ? { pad: 6, d: 48 } : { pad: 18, d: 54 };
  const mid = mobile ? { pad: 16, d: 54 } : { pad: 26, d: 64 };
  const box = (el: HTMLElement) => {
    const b = el.getBoundingClientRect();
    return { l: b.left - n.left, r: b.right - n.left };
  };
  const a = box(left);
  const c = box(logo);
  const z = box(right);
  const gap = 2 * r + 8;
  const cx0 = c.l - mid.pad;
  const cx1 = c.r + mid.pad;

  return {
    W: round(n.width),
    t,
    r,
    R,
    // The left hump runs to the left screen edge, the right hump to the right edge.
    humps: [
      { x0: 0, x1: round(Math.min(a.r + side.pad, cx0 - gap)), full: side.d },
      { x0: round(cx0), x1: round(cx1), full: mid.d },
      { x0: round(Math.max(z.l - side.pad, cx1 + gap)), x1: round(n.width), full: side.d },
    ],
    cx: round((c.l + c.r) / 2),
    coreR: round((c.r - c.l) / 2 + mid.pad + 24),
  };
}

type SurfaceState = {
  pd: number; // how far the humps have grown (0 = thin strip, 1 = full depth)
  mc: number; // how far the mega menu has opened (0–1)
  depth: number; // the open menu's depth in px
  over: number; // spring overshoot past the menu's depth
};

// Lower edge, right to left: right hump (from the right edge), gap strip, centre hump, gap strip,
// left hump (to the left edge). As the menu opens the gaps and humps all sink to the menu's depth,
// the inner curves flatten out, and the screen-edge corners round to 28px.
export function notchPath(g: NotchGeometry, { pd, mc, depth, over }: SurfaceState) {
  const hs = g.humps;
  const last = hs.length - 1;
  const ds = hs.map((h) => {
    const base = g.t + (h.full - g.t) * pd;
    return base + (depth - base) * mc + over;
  });
  const gapD = g.t + (depth - g.t) * mc + over;
  const Rb = round(Math.min(28 * mc, ds[0] / 2, ds[last] / 2));

  const radii = ds.map((d) => {
    const diff = Math.max(0, d - gapD);
    return { r: round(Math.min(g.r * pd, diff * 0.4)), R: round(Math.min(g.R * pd, diff * 0.6)) };
  });

  let s = `M0 0 H${g.W} V${round(ds[last] - Rb)}`;
  if (Rb > 0) s += ` A${Rb} ${Rb} 0 0 1 ${round(g.W - Rb)} ${round(ds[last])}`;
  for (let i = last; i > 0; i--) {
    const d = round(ds[i]);
    const q = radii[i];
    const x0 = round(hs[i].x0);
    const pdp = round(ds[i - 1]);
    const qp = radii[i - 1];
    const x1 = round(hs[i - 1].x1);
    const gy = round(gapD);
    s +=
      ` H${round(x0 + q.R)} A${q.R} ${q.R} 0 0 1 ${x0} ${round(d - q.R)}` +
      ` V${round(gy + q.r)} A${q.r} ${q.r} 0 0 0 ${round(x0 - q.r)} ${gy}` +
      ` H${round(x1 + qp.r)} A${qp.r} ${qp.r} 0 0 0 ${x1} ${round(gy + qp.r)}` +
      ` V${round(pdp - qp.R)} A${qp.R} ${qp.R} 0 0 1 ${round(x1 - qp.R)} ${pdp}`;
  }
  s += ` H${Rb}`;
  if (Rb > 0) s += ` A${Rb} ${Rb} 0 0 1 0 ${round(ds[0] - Rb)}`;

  return { d: `${s} Z`, max: Math.max(...ds) };
}
