"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { CloseIcon, PlusIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { Wordmark } from "@/components/wordmark";
import { LINKS, MENUS, type MenuKey } from "@/lib/navigation";
import { EASE } from "./motion";

type MobileDrawerProps = {
  open: boolean;
  reduce: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

const SECONDARY = [
  { label: "About", href: LINKS.about },
  { label: "Account", href: LINKS.account },
  { label: "Help", href: LINKS.help },
  { label: "Contact", href: LINKS.contact },
];

// Slides in from the left; each department opens as an accordion with its Featured and Explore links.
export function MobileDrawer({ open, reduce, onClose, returnFocusRef }: MobileDrawerProps) {
  const [section, setSection] = useState<MenuKey | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Freeze the page behind the drawer, move focus in, and hand it back on close.
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.style.overflow = "hidden";
      const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 80);
      wasOpen.current = true;
      return () => window.clearTimeout(t);
    }
    root.style.overflow = "";
    if (wasOpen.current) returnFocusRef.current?.focus({ preventScroll: true });
    wasOpen.current = false;
  }, [open, returnFocusRef]);

  const line = "border-[rgba(var(--sz-line-rgb),0.08)]";

  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className="fixed inset-0 z-[60] lg:hidden"
      style={{
        visibility: open ? "visible" : "hidden",
        transition: open ? "visibility 0s" : `visibility 0s linear ${reduce ? 150 : 500}ms`,
      }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(var(--sz-glass-rgb),0.55)] backdrop-blur-[8px]"
        style={{ opacity: open ? 1 : 0, transition: `opacity ${reduce ? 150 : 450}ms ${EASE}` }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-[360px] flex-col overflow-y-auto border-r ${line} bg-[rgba(var(--sz-glass-rgb),0.9)] text-fg backdrop-blur-[20px]`}
        style={{
          transform: reduce || open ? "translateX(0)" : "translateX(-100%)",
          opacity: reduce ? (open ? 1 : 0) : 1,
          transition: reduce ? `opacity 150ms ${EASE}` : `transform 500ms ${EASE}`,
        }}
      >
        <div className={`flex h-14 flex-none items-center justify-between border-b ${line} pr-2 pl-4`}>
          <Wordmark height={20} />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-11 cursor-pointer items-center justify-center text-fg"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col px-4 pt-2 pb-8">
          {MENUS.map((menu) => {
            const expanded = section === menu.key;
            return (
              <div key={menu.key} className={`border-b ${line}`}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setSection(expanded ? null : menu.key)}
                  className="flex h-[60px] w-full cursor-pointer items-center justify-between font-display text-h2 text-fg uppercase"
                >
                  {menu.label}
                  <PlusIcon
                    style={{
                      transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                      transition: reduce ? "none" : `transform 450ms ${EASE}`,
                    }}
                  />
                </button>
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: expanded ? "1fr" : "0fr",
                    transition: reduce ? "none" : `grid-template-rows 450ms ${EASE}`,
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="grid grid-cols-2 gap-4 pt-1 pb-6"
                      style={{
                        opacity: expanded ? 1 : 0,
                        transform: reduce || expanded ? "translateY(0)" : "translateY(4px)",
                        transition: `opacity ${reduce ? 150 : 400}ms ${EASE}${expanded && !reduce ? " 120ms" : ""}, transform 400ms ${EASE}${expanded ? " 120ms" : ""}`,
                      }}
                    >
                      <DrawerColumn title={menu.featuredTitle} links={menu.featured} tone="text-fg" onNavigate={onClose} />
                      <DrawerColumn title={menu.exploreTitle} links={menu.explore} tone="text-fg-2" onNavigate={onClose} />
                      <Link
                        href={menu.href}
                        onClick={onClose}
                        className="sz-label col-span-full py-2 text-fg underline decoration-muted underline-offset-[6px]"
                      >
                        Shop all {menu.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href={LINKS.shopAll}
            onClick={onClose}
            className={`flex h-[60px] items-center border-b ${line} font-display text-h2 text-fg uppercase`}
          >
            Shop all
          </Link>

          <div className="sz-label flex flex-col gap-1 pt-6">
            {SECONDARY.map((link) => (
              <Link key={link.label} href={link.href} onClick={onClose} className="flex min-h-11 items-center text-fg-2">
                {link.label}
              </Link>
            ))}
            <div className={`mt-3 flex min-h-14 items-center justify-between gap-4 border-t ${line}`}>
              <span aria-hidden="true" className="text-fg-2">
                Dark mode
              </span>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DrawerColumn({
  title,
  links,
  tone,
  onNavigate,
}: {
  title: string;
  links: { label: string; href: string }[];
  tone: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-micro font-medium text-text uppercase">{title}</span>
      {links.map((link) => (
        <Link key={link.label} href={link.href} onClick={onNavigate} className={`flex min-h-7 items-center text-body ${tone}`}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
