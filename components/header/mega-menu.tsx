"use client";

import Link from "next/link";
import type { Ref } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { MENUS, type MenuKey } from "@/lib/navigation";
import { staggerStyle } from "./motion";

type MegaMenuProps = {
  panelRef: Ref<HTMLDivElement>;
  activeKey: MenuKey;
  shown: boolean;
  fresh: boolean;
  reduce: boolean;
  onNavigate: () => void;
};

// The four menus are stacked in one grid cell so switching tabs crossfades in place.
// The header's frame loop shows and hides the panel (visibility) in step with the surface.
export function MegaMenu({ panelRef, activeKey, shown, fresh, reduce, onNavigate }: MegaMenuProps) {
  const active = MENUS.find((m) => m.key === activeKey) ?? MENUS[0];
  const step = 30;

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={`${active.label} menu`}
      aria-hidden={!shown}
      className="invisible absolute inset-x-0 top-full z-[2] hidden px-[var(--page-margin)] pt-8 pb-10 lg:grid"
      style={{ pointerEvents: shown ? "auto" : "none" }}
    >
      {MENUS.map((menu) => {
        const on = menu.key === activeKey;
        const visible = on && shown;
        const tab = visible ? 0 : -1;
        const cols = menu.explore.length > 6 ? 2 : 1;
        const item = (delay: number) => staggerStyle(shown, on, fresh, reduce, delay);

        return (
          <div
            key={menu.key}
            data-layer={menu.key}
            aria-hidden={!visible}
            className="col-start-1 row-start-1 grid grid-cols-4 gap-6 self-start"
            style={{ pointerEvents: on ? "auto" : "none" }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-micro font-medium text-text uppercase" style={item(0)}>
                {menu.featuredTitle}
              </span>
              {menu.featured.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  tabIndex={tab}
                  onClick={onNavigate}
                  className="font-display text-h3 text-fg uppercase"
                  style={item((i + 1) * step)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-micro font-medium text-text uppercase" style={item(60)}>
                {menu.exploreTitle}
              </span>
              <div className="grid gap-x-5 gap-y-3.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {menu.explore.map((link, i) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    tabIndex={tab}
                    onClick={onNavigate}
                    className="text-body text-fg-2"
                    style={item(60 + (i + 1) * step)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href={menu.href}
                tabIndex={tab}
                onClick={onNavigate}
                className="sz-label mt-2 text-fg underline decoration-muted underline-offset-[6px]"
                style={item(60 + (Math.ceil(menu.explore.length / cols) + 1) * step)}
              >
                Shop all {menu.label}
              </Link>
            </div>

            {/* Editorial tile: a placeholder until campaign photography exists. */}
            <Link
              href={menu.href}
              tabIndex={tab}
              onClick={onNavigate}
              className="sz-grain col-span-2 flex aspect-[16/7] flex-col justify-between overflow-hidden rounded-md bg-gradient-to-b from-[rgba(42,41,39,0.9)] to-[rgba(17,17,16,0.9)] p-4"
              style={item(120)}
            >
              <span className="relative z-[2] font-mono text-micro tracking-[0.08em] text-text uppercase">{menu.caption}</span>
              <span className="relative z-[2] flex items-end justify-between gap-4">
                <span className="font-display text-h2 text-fg uppercase">{menu.tileTitle}</span>
                <span className="sz-label flex items-center gap-2 text-fg">
                  Shop {menu.label}
                  <ArrowRightIcon />
                </span>
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
