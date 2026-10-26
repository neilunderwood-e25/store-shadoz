import Link from "next/link";
import { HeroSignal } from "@/components/hero-signal";
import { ArrowRightIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { LINKS } from "@/lib/navigation";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { getCollectionProducts } from "@/lib/shopify/products";

// Foundation check: the design's hero (so the header's over-hero mode can be seen) and a live
// Storefront API read. Replaced by the real Home page in Phase 2.
export default function Home() {
  return (
    <main>
      <section
        data-sz-hero=""
        aria-label="Drop 04"
        className="sz-grain relative flex h-[min(840px,100svh)] min-h-[560px] flex-col justify-end bg-gradient-to-b from-[#1f1f1d] to-[#111110]"
      >
        <HeroSignal />
        <span className="absolute top-32 right-[var(--page-margin)] z-[2] font-mono text-micro tracking-[0.08em] text-muted uppercase">
          Hero — editorial, low light, full bleed
        </span>
        <div className="relative z-[2] flex flex-col gap-8 px-[var(--page-margin)] pb-14">
          <span className="sz-label text-text">Drop 04</span>
          <h1 className="sz-display text-display-xl">
            Quiet
            <br />
            street
          </h1>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[360px] text-body text-fg">Heavyweight tees and wide pants in black, charcoal, stone.</p>
            <Link
              href={LINKS.shopAll}
              className="sz-label inline-flex h-12 items-center gap-3 rounded-sm border border-fg px-8 text-fg"
            >
              Shop the drop
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--max-content)] px-[var(--page-margin)] py-24">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-h2 text-fg uppercase">New in</h2>
          <Link href={LINKS.newIn} className="sz-label text-fg underline decoration-muted underline-offset-[6px]">
            View all
          </Link>
        </div>
        <NewIn />
      </section>
    </main>
  );
}

async function NewIn() {
  if (!isShopifyConfigured()) {
    return (
      <p className="mt-6 rounded-md border border-border-2 bg-surface p-6 text-body-s">
        Add your Storefront API tokens to <code className="font-mono">.env.local</code> (see{" "}
        <code className="font-mono">.env.example</code>), then restart the dev server.
      </p>
    );
  }

  const collection = await getCollectionProducts("new-in", 8);
  if (!collection) {
    return <p className="mt-6 text-body-s">The “new-in” collection isn’t on the Headless channel.</p>;
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-6">
      {collection.products.map((product) => (
        <ProductCard key={product.id} product={product} sizes="(min-width: 768px) 25vw, 50vw" />
      ))}
    </div>
  );
}
