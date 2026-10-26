"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

type Theme = "dark" | "light";

const STORAGE_KEY = "sz:theme";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(next: Theme) {
  const root = document.documentElement;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Colours crossfade (globals.css) for the length of the switch, then normal transitions return.
    root.classList.add("sz-theming");
    window.setTimeout(() => root.classList.remove("sz-theming"), 460);
  }
  root.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Can't save (private window): the next visit simply follows the device.
  }
}

// The design's dark-mode switch: a pill with a knob that carries a sun or moon.
export function ThemeSwitch() {
  // The server can't know the saved theme, so it renders the dark default and the client corrects it.
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  const motion = `transform 300ms ${EASE}, opacity 300ms ${EASE}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={label}
      title={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="relative h-[26px] w-[46px] flex-none cursor-pointer rounded-full border border-[rgba(var(--sz-line-rgb),0.24)] bg-[rgba(var(--sz-line-rgb),0.06)] p-0"
    >
      <span
        aria-hidden="true"
        className="absolute top-[3px] left-[3px] flex size-[18px] items-center justify-center rounded-full bg-fg text-bg"
        style={{ transform: `translateX(${dark ? 20 : 0}px)`, transition: `transform 300ms ${EASE}` }}
      >
        <SunIcon
          className="absolute"
          style={{ opacity: dark ? 0 : 1, transform: `rotate(${dark ? -90 : 0}deg) scale(${dark ? 0.6 : 1})`, transition: motion }}
        />
        <MoonIcon
          className="absolute"
          style={{ opacity: dark ? 1 : 0, transform: `rotate(${dark ? 0 : 90}deg) scale(${dark ? 1 : 0.6})`, transition: motion }}
        />
      </span>
    </button>
  );
}
