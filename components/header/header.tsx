"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent } from "react";
import { AccountIcon, BagIcon, ChevronDownIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { Wordmark } from "@/components/wordmark";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { ANNOUNCEMENT, LINKS, MENUS, type MenuKey } from "@/lib/navigation";
import { MegaMenu } from "./mega-menu";
import { MobileDrawer } from "./mobile-drawer";
import { EASE } from "./motion";
import { measureNotch, notchPath, type NotchGeometry } from "./notch";

const DESKTOP_QUERY = "(min-width: 1024px)";
const BAR_H = 32;

type HeaderProps = {
  cartCount?: number;
  // "pinned" keeps the announcement bar on screen; "scroll" lets it scroll away with the page.
  bar?: "pinned" | "scroll";
};

type Tab = MenuKey | "shop" | "about";

// Everything the frame loop animates lives here, outside React state.
type Motion = {
  y: number;
  hero: boolean;
  desktop: boolean;
  reduce: boolean;
  p: number; // smoothed scroll progress: 0 = transparent over the hero, 1 = solid notch
  m: number; // menu spring position (0 closed, 1 open), may overshoot slightly
  mv: number;
  mT: number; // menu target
  H: number; // sprung menu depth
  Hv: number;
  HT: number; // measured menu depth
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const heroOnPage = () => document.querySelector("[data-sz-hero]") !== null;
// Over a hero the notch fades in between 20px and 160px of scroll; elsewhere it is always solid.
const progressGoal = (s: Motion) => (s.hero ? clamp01((s.y - 20) / 140) : 1);

export function Header({ cartCount = 0, bar = "pinned" }: HeaderProps) {
  const reduce = usePrefersReducedMotion();
  const [hover, setHover] = useState<Tab | null>(null);
  const [menuKey, setMenuKey] = useState<MenuKey>("mens");
  const [shown, setShown] = useState(false);
  const [fresh, setFresh] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const fadeRef = useRef<SVGLinearGradientElement>(null);
  const fadeMidRef = useRef<SVGStopElement>(null);
  const fadeEndRef = useRef<SVGStopElement>(null);
  const coreRef = useRef<SVGRadialGradientElement>(null);
  const coreRectRef = useRef<SVGRectElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navD = useRef<HTMLElement>(null);
  const leftD = useRef<HTMLDivElement>(null);
  const logoD = useRef<HTMLAnchorElement>(null);
  const rightD = useRef<HTMLDivElement>(null);
  const navM = useRef<HTMLElement>(null);
  const logoM = useRef<HTMLAnchorElement>(null);
  const rightM = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const motion = useRef<Motion>({ y: 0, hero: false, desktop: true, reduce: false, p: 1, m: 0, mv: 0, mT: 0, H: 0, Hv: 0, HT: 0 });
  const geom = useRef<NotchGeometry | null>(null);
  const raf = useRef<number | null>(null);
  const timers = useRef<{ open?: number; close?: number; collapse?: number }>({});

  // Writes the current motion state to the DOM: surface path, blur, glow, scrim, nav theme, panel.
  const paint = useCallback(() => {
    const s = motion.current;
    const g = geom.current;
    const navH = s.desktop ? 64 : 56;
    const m = s.desktop ? s.m : 0;
    const mc = clamp01(m);
    const depth = s.H || s.HT || 420;
    const over = m > 1 ? (m - 1) * (depth - navH) : 0;
    // Hovering a tab at the very top: the notch fades in and grows straight into the menu.
    const vis = Math.min(1, Math.max(s.p, mc * 1.6));
    const pd = s.reduce ? (vis > 0 ? 1 : 0) : Math.max(s.p, Math.min(1, mc * 1.6));

    const svg = svgRef.current;
    const blur = blurRef.current;
    if (svg && blur) {
      if (g) {
        const shape = notchPath(g, { pd, mc, depth, over });
        const svgH = Math.max(100, Math.ceil(shape.max + 8));
        fillRef.current?.setAttribute("d", shape.d);
        clipRef.current?.setAttribute("d", shape.d);
        svg.setAttribute("height", String(svgH));
        svg.style.opacity = String(vis);
        blur.style.height = `${svgH}px`;
        blur.style.clipPath = `path('${shape.d}')`;
        blur.style.setProperty("-webkit-clip-path", `path('${shape.d}')`);
        blur.style.backdropFilter = `blur(${20 * vis}px)`;
        blur.style.setProperty("-webkit-backdrop-filter", `blur(${20 * vis}px)`);
        blur.style.opacity = String(vis);
        fadeRef.current?.setAttribute("y2", String(Math.max(g.t + 1, shape.max)));
        fadeMidRef.current?.setAttribute("offset", String(0.55 + 0.33 * mc));
        fadeEndRef.current?.setAttribute("stop-opacity", String(0.35 + 0.3 * mc));
        coreRef.current?.setAttribute("cx", String(g.cx));
        coreRef.current?.setAttribute("r", String(g.coreR));
        coreRectRef.current?.setAttribute("opacity", String(1 - mc));
      } else {
        svg.style.opacity = "0";
        blur.style.opacity = "0";
      }
    }
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - vis);
    // Over a dark hero the nav keeps light-on-dark colours until the notch fills in (globals.css).
    const solid = !s.hero || vis >= 0.5;
    for (const nav of [navD.current, navM.current]) nav?.toggleAttribute("data-sz-solid", solid);
    if (panelRef.current) panelRef.current.style.visibility = s.desktop && (s.mT === 1 || mc > 0.01) ? "visible" : "hidden";
    if (headerRef.current) {
      headerRef.current.style.transform = bar === "scroll" ? `translateY(${-Math.min(s.y, BAR_H)}px)` : "";
    }
  }, [bar]);

  // One animation loop drives everything: smoothed scroll progress, the menu spring and its depth.
  const run = useCallback(() => {
    if (raf.current !== null) return;
    let last: number | null = null;
    const step = (now: number) => {
      const dt = last === null ? 1 / 60 : Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = motion.current;
      s.hero = heroOnPage();
      const goal = progressGoal(s);
      // Exponential smoothing, so trackpad flicks and fast scrolls don't jitter the shape.
      s.p += (goal - s.p) * (1 - Math.exp(-dt / (s.reduce ? 0.05 : 0.14)));
      if (Math.abs(goal - s.p) < 0.002) s.p = goal;
      if (s.reduce) {
        // No spring: a short linear change instead.
        const k = dt / 0.15;
        s.m = s.mT > s.m ? Math.min(s.mT, s.m + k) : Math.max(s.mT, s.m - k);
        s.mv = 0;
        s.H = s.HT;
        s.Hv = 0;
      } else {
        // Damped spring, ~500ms with a very slight overshoot (zeta 0.72).
        const w = 11;
        const z = 0.72;
        s.mv += (w * w * (s.mT - s.m) - 2 * z * w * s.mv) * dt;
        s.m += s.mv * dt;
        if (Math.abs(s.mT - s.m) < 0.001 && Math.abs(s.mv) < 0.01) {
          s.m = s.mT;
          s.mv = 0;
        }
        if (!s.H) s.H = s.HT;
        s.Hv += (w * w * (s.HT - s.H) - 2 * z * w * s.Hv) * dt;
        s.H += s.Hv * dt;
        if (Math.abs(s.HT - s.H) < 0.3 && Math.abs(s.Hv) < 0.5) {
          s.H = s.HT;
          s.Hv = 0;
        }
      }
      paint();
      const moving = s.p !== goal || s.m !== s.mT || s.mv !== 0 || s.H !== s.HT || s.Hv !== 0;
      raf.current = moving ? requestAnimationFrame(step) : null;
    };
    raf.current = requestAnimationFrame(step);
  }, [paint]);

  // Menu depth = nav + the active layer's own height + the panel's padding.
  const measureMenu = useCallback(() => {
    const s = motion.current;
    if (!s.desktop) return;
    const layer = panelRef.current?.querySelector<HTMLElement>(`[data-layer="${menuKey}"]`);
    if (!layer) return;
    const HT = Math.round(64 + 32 + layer.getBoundingClientRect().height + 40);
    if (HT !== s.HT) {
      s.HT = HT;
      if (!s.H) s.H = HT;
      run();
    }
  }, [menuKey, run]);

  const measure = useCallback(() => {
    const s = motion.current;
    s.desktop = matchMedia(DESKTOP_QUERY).matches;
    const parts = s.desktop
      ? [navD.current, leftD.current, logoD.current, rightD.current]
      : [navM.current, menuButtonRef.current, logoM.current, rightM.current];
    if (parts.every(Boolean)) {
      const [nav, left, logo, right] = parts as HTMLElement[];
      geom.current = measureNotch(nav, left, logo, right, !s.desktop);
    }
    measureMenu();
    paint();
  }, [measureMenu, paint]);

  useEffect(() => {
    motion.current.reduce = reduce;
  }, [reduce]);

  // Start in the right state for this page (no fade-in on load), then follow scroll, size and fonts.
  useEffect(() => {
    const s = motion.current;
    s.y = Math.max(0, window.scrollY);
    s.hero = heroOnPage();
    s.p = progressGoal(s);
    measure();

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      if (y !== motion.current.y) {
        motion.current.y = y;
        run();
      }
    };
    const onHero = () => run();
    const ro = new ResizeObserver(() => measure());
    for (const nav of [navD.current, navM.current]) if (nav) ro.observe(nav);
    const mq = matchMedia(DESKTOP_QUERY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("sz:hero", onHero);
    mq.addEventListener("change", measure);
    document.fonts?.ready.then(() => measure());
    run();

    const pending = timers.current;
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("sz:hero", onHero);
      mq.removeEventListener("change", measure);
      ro.disconnect();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
      window.clearTimeout(pending.open);
      window.clearTimeout(pending.close);
      window.clearTimeout(pending.collapse);
    };
  }, [measure, run]);

  // Switching or opening a menu changes which layer sets the depth.
  useLayoutEffect(() => {
    measureMenu();
  }, [menuKey, shown, measureMenu]);

  // ---- mega menu: 120ms intent delay to open; on close a 150ms grace, contents fade, then the shape springs back ----
  const open = useCallback(
    (key: MenuKey) => {
      const t = timers.current;
      window.clearTimeout(t.open);
      window.clearTimeout(t.close);
      window.clearTimeout(t.collapse);
      setFresh(motion.current.mT !== 1);
      setMenuKey(key);
      setShown(true);
      motion.current.mT = 1;
      run();
    },
    [run],
  );

  const collapse = useCallback(() => {
    setShown(false);
    timers.current.collapse = window.setTimeout(
      () => {
        motion.current.mT = 0;
        run();
      },
      motion.current.reduce ? 0 : 150,
    );
  }, [run]);

  const scheduleClose = useCallback(() => {
    const t = timers.current;
    window.clearTimeout(t.open);
    window.clearTimeout(t.close);
    if (motion.current.mT !== 1) return;
    t.close = window.setTimeout(collapse, 150);
  }, [collapse]);

  const closeNow = useCallback(() => {
    const t = timers.current;
    window.clearTimeout(t.open);
    window.clearTimeout(t.close);
    setHover(null);
    if (motion.current.mT === 1) collapse();
  }, [collapse]);

  const enterTab = (tab: Tab) => {
    const t = timers.current;
    window.clearTimeout(t.close);
    setHover(tab);
    if (tab === "shop" || tab === "about") {
      scheduleClose();
      return;
    }
    if (motion.current.mT === 1) {
      window.clearTimeout(t.collapse);
      if (tab !== menuKey) {
        setMenuKey(tab);
        setFresh(false);
      }
      setShown(true);
      return;
    }
    window.clearTimeout(t.open);
    t.open = window.setTimeout(() => open(tab), 120);
  };

  // Keyboard users: leaving the header with Tab closes the menu.
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeNow();
  };

  const tabStyle = (tab: Tab) => {
    const on = hover === tab || (shown && menuKey === tab);
    return {
      color: on ? "var(--sz-fg)" : "rgba(var(--sz-line-rgb), 0.82)",
      underline: {
        transform: reduce || on ? "scaleX(1)" : "scaleX(0)",
        opacity: on ? 1 : 0,
        transition: reduce ? `opacity 150ms ${EASE}` : `transform 300ms ${EASE}, opacity 300ms ${EASE}`,
      },
    };
  };

  const glass = "rgb(var(--sz-glass-rgb))";
  const cartLabel = `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`;

  return (
    <div className="relative z-50 w-full">
      {/* Holds the page below the fixed header; hidden on pages that open with a hero (globals.css). */}
      <div aria-hidden="true" className="sz-header-spacer h-[88px] lg:h-[96px]" />

      <header
        ref={headerRef}
        onMouseEnter={() => window.clearTimeout(timers.current.close)}
        onMouseLeave={() => {
          setHover(null);
          scheduleClose();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeNow();
        }}
        onBlur={onBlur}
        className="fixed inset-x-0 top-0 z-50 font-sans text-fg"
      >
        <div className="relative z-[3] flex h-8 items-center justify-center bg-surface px-4 text-center text-micro font-medium text-text uppercase">
          {ANNOUNCEMENT}
        </div>

        <div className="relative h-14 lg:h-16">
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="sz-scrim pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/25 to-black/0"
          />
          <div ref={blurRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 opacity-0" />
          <svg
            ref={svgRef}
            aria-hidden="true"
            width="100%"
            height="100"
            className="pointer-events-none absolute top-0 left-0 overflow-visible opacity-0"
          >
            <defs>
              <linearGradient ref={fadeRef} id="sz-notch-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="64">
                <stop offset="0" style={{ stopColor: glass }} stopOpacity="0.75" />
                <stop ref={fadeMidRef} offset="0.55" style={{ stopColor: glass }} stopOpacity="0.75" />
                <stop ref={fadeEndRef} offset="1" style={{ stopColor: glass }} stopOpacity="0.35" />
              </linearGradient>
              <radialGradient ref={coreRef} id="sz-notch-core" gradientUnits="userSpaceOnUse" cx="0" cy="18" r="120">
                <stop offset="0" style={{ stopColor: glass }} stopOpacity="0.5" />
                <stop offset="1" style={{ stopColor: glass }} stopOpacity="0" />
              </radialGradient>
              <clipPath id="sz-notch-clip">
                <path ref={clipRef} d="M0 0" />
              </clipPath>
            </defs>
            <path ref={fillRef} d="M0 0" fill="url(#sz-notch-fade)" />
            <rect ref={coreRectRef} x="0" y="0" width="100%" height="120" fill="url(#sz-notch-core)" clipPath="url(#sz-notch-clip)" />
          </svg>

          {/* Desktop */}
          <nav
            ref={navD}
            aria-label="Main"
            data-sz-navtheme=""
            className="relative z-[2] hidden h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-[var(--page-margin)] lg:grid"
          >
            <div className="flex h-full justify-start">
              <div ref={leftD} className="sz-label flex h-full items-center gap-7">
                {MENUS.map((menu) => {
                  const st = tabStyle(menu.key);
                  return (
                    <Link
                      key={menu.key}
                      href={menu.href}
                      aria-haspopup="true"
                      aria-expanded={shown && menuKey === menu.key}
                      onMouseEnter={() => enterTab(menu.key)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => open(menu.key)}
                      onClick={closeNow}
                      className="relative flex items-center gap-1.5 py-2.5"
                      style={{ color: st.color, transition: `color 300ms ${EASE}` }}
                    >
                      {menu.label}
                      <ChevronDownIcon />
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-1 h-px origin-center bg-fg" style={st.underline} />
                    </Link>
                  );
                })}
                <TextTab href={LINKS.shopAll} label="Shop all" st={tabStyle("shop")} onEnter={() => enterTab("shop")} onLeave={() => setHover(null)} />
              </div>
            </div>

            <Link ref={logoD} href={LINKS.home} aria-label="Shadoz — home" onMouseEnter={scheduleClose} onClick={closeNow} className="block">
              <Wordmark height={26} />
            </Link>

            <div className="flex h-full justify-end">
              <div ref={rightD} onMouseEnter={scheduleClose} className="sz-label flex items-center gap-5">
                <span className="flex items-center gap-5">
                  <ThemeSwitch />
                  <TextTab href={LINKS.about} label="About" st={tabStyle("about")} onEnter={() => enterTab("about")} onLeave={() => setHover(null)} />
                </span>
                <Link href={LINKS.search} aria-label="Search" className="flex p-2 text-fg">
                  <SearchIcon />
                </Link>
                <Link href={LINKS.account} aria-label="Account" className="flex p-2 text-fg">
                  <AccountIcon />
                </Link>
                <Link href={LINKS.cart} aria-label={cartLabel} className="flex items-center gap-1.5 p-2 text-fg">
                  <BagIcon />
                  <span className="font-mono text-micro tracking-[0.08em]">{cartCount}</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile */}
          <nav
            ref={navM}
            aria-label="Main"
            data-sz-navtheme=""
            className="relative z-[2] grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 lg:hidden"
          >
            <div className="flex justify-start">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="flex size-11 cursor-pointer items-center justify-center text-fg"
              >
                <MenuIcon />
              </button>
            </div>
            <Link ref={logoM} href={LINKS.home} aria-label="Shadoz — home" className="block">
              <Wordmark height={22} />
            </Link>
            <div className="flex justify-end">
              <div ref={rightM} className="flex items-center">
                <Link href={LINKS.search} aria-label="Search" className="flex size-11 items-center justify-center text-fg">
                  <SearchIcon />
                </Link>
                <Link href={LINKS.cart} aria-label={cartLabel} className="flex h-11 min-w-11 items-center justify-center gap-1 text-fg">
                  <BagIcon />
                  <span className="font-mono text-micro">{cartCount}</span>
                </Link>
              </div>
            </div>
          </nav>

          <MegaMenu panelRef={panelRef} activeKey={menuKey} shown={shown} fresh={fresh} reduce={reduce} onNavigate={closeNow} />
        </div>
      </header>

      <MobileDrawer open={drawerOpen} reduce={reduce} onClose={() => setDrawerOpen(false)} returnFocusRef={menuButtonRef} />
    </div>
  );
}

function TextTab({
  href,
  label,
  st,
  onEnter,
  onLeave,
}: {
  href: string;
  label: string;
  st: { color: string; underline: CSSProperties };
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex items-center py-2.5"
      style={{ color: st.color, transition: `color 300ms ${EASE}` }}
    >
      {label}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-1 h-px origin-center bg-fg" style={st.underline} />
    </Link>
  );
}
