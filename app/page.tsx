import Link from "next/link";
import { HeroSignal } from "@/components/hero-signal";
import { ArrowRightIcon } from "@/components/icons";
import { LINKS } from "@/lib/navigation";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { getCollectionProducts } from "@/lib/shopify/products";
import { formatMoney } from "@/lib/money";

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
          <span className="sz-label text-muted">From Shopify</span>
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
    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {collection.products.map((product) => (
        <li key={product.id}>
          <div className="sz-grain aspect-[4/5] rounded-md bg-gradient-to-b from-surface-2 to-surface-3">
            {product.badges.length > 0 && (
              <div className="absolute top-3 left-3 z-[2] flex gap-1">
                {product.badges.map((badge) => (
                  <span key={badge} className="sz-label rounded-sm bg-bg/80 px-2 py-1 text-micro text-fg">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-body text-fg">{product.title}</p>
          <p className="font-mono text-body-s text-muted">{formatMoney(product.price)}</p>
          <p className="text-body-s text-faint">{product.colours.join(" · ")}</p>
        </li>
      ))}
    </ul>
  );
}
