import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { ProductCard as ProductCardData } from "@/lib/shopify/products";

const SWATCH: Record<string, string> = {
  Black: "#0B0B0A",
  Charcoal: "#3B3A37",
  "Off-white": "#F5F3EE",
  Silver: "#BFBFBA",
  Gunmetal: "#55565A",
};

const BADGE: Record<string, string> = {
  New: "border-fg bg-fg text-bg",
  Unisex: "border-muted bg-[rgba(11,11,10,0.55)] text-fg",
  "Sold out": "border-border-2 bg-surface-2 text-text",
};

// The design's product card. Hover (or keyboard focus) lifts it 2px with a glow — white on dark,
// a soft shadow on light — underlines the name and swaps to the second photo when there is one.
export function ProductCard({ product, sizes }: { product: ProductCardData; sizes: string }) {
  const soldOut = product.badges.includes("Sold out");

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex w-full flex-col rounded-md text-fg shadow-[var(--sz-glow-none)] transition-[box-shadow,transform] duration-[400ms] ease-sz hover:z-[1] hover:-translate-y-0.5 hover:opacity-100 hover:shadow-[var(--sz-glow-hover)] focus-visible:z-[1] focus-visible:shadow-[var(--sz-glow-hover)] active:shadow-[var(--sz-glow-tap)] motion-reduce:hover:translate-y-0"
    >
      <div
        className="sz-grain flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md bg-gradient-to-b from-[#1f1f1d] to-[#111110] p-3"
        style={{ opacity: soldOut ? 0.6 : 1 }}
      >
        {product.image && (
          <Image
            src={product.image.url}
            alt={product.image.altText ?? product.title}
            fill
            sizes={sizes}
            className={`object-cover ${product.hoverImage ? "transition-opacity duration-[480ms] ease-sz group-hover:opacity-0" : ""}`}
          />
        )}
        {product.hoverImage && (
          <Image
            src={product.hoverImage.url}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-[480ms] ease-sz group-hover:opacity-100"
          />
        )}
        <div className="relative z-[2] flex min-h-[22px] flex-wrap gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`inline-flex h-[22px] items-center rounded-sm border px-2 text-micro font-medium uppercase ${BADGE[badge] ?? BADGE.Unisex}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-3 pt-3.5 pb-4 sm:px-4">
        <div className="flex items-baseline justify-between gap-3 text-body-s">
          <span className="text-fg underline-offset-4 group-hover:underline">{product.title}</span>
          <span className={`whitespace-nowrap ${soldOut ? "text-muted" : "text-fg"}`}>{formatMoney(product.price)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 py-0.5">
          {product.colours.map((colour) => (
            <span
              key={colour}
              role="img"
              aria-label={colour}
              className="size-3 rounded-full border border-muted"
              style={{ background: SWATCH[colour] ?? SWATCH.Charcoal }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
