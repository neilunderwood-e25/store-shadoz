import Image from "next/image";

// The Shadoz wordmark is white on transparent; --sz-logo-filter turns it black in light mode.
const RATIO = 2400 / 646;

export function Wordmark({ height, className = "" }: { height: number; className?: string }) {
  return (
    <Image
      src="/brand/shadoz-wordmark.png"
      alt="Shadoz"
      width={Math.round(height * RATIO)}
      height={height}
      loading="eager"
      className={`block ${className}`}
      style={{ height, width: "auto", filter: "var(--sz-logo-filter)" }}
    />
  );
}
