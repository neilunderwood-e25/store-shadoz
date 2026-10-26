import type { CSSProperties } from "react";

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Menu contents wait for the surface to mostly open, then fade up in a stagger. On close they
// fade out quickly and snap back without moving, so the next open starts from the same place.
export function staggerStyle(
  shown: boolean,
  active: boolean,
  fresh: boolean,
  reduce: boolean,
  delay: number,
): CSSProperties {
  const rest = reduce ? "none" : "translateY(4px)";
  if (!shown) return { opacity: 0, transform: rest, transition: `opacity 150ms ${EASE}, transform 0s linear 150ms` };
  if (!active) {
    return { opacity: 0, transform: rest, transition: `opacity ${reduce ? 150 : 220}ms ${EASE}, transform 0s linear 220ms` };
  }
  if (reduce) return { opacity: 1, transform: "none", transition: `opacity 150ms ${EASE}` };
  const wait = (fresh ? 200 : 60) + delay;
  return {
    opacity: 1,
    transform: "translateY(0)",
    transition: `opacity 400ms ${EASE} ${wait}ms, transform 400ms ${EASE} ${wait}ms`,
  };
}
