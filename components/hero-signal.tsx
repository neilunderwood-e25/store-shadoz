"use client";

import { useEffect } from "react";

// Lives inside a page's [data-sz-hero] section and tells the header when a hero page
// mounts or unmounts, so client-side navigation switches the header between its two modes.
export function HeroSignal() {
  useEffect(() => {
    window.dispatchEvent(new Event("sz:hero"));
    return () => {
      window.dispatchEvent(new Event("sz:hero"));
    };
  }, []);
  return null;
}
