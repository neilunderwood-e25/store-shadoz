import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { LINKS } from "@/lib/navigation";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { getCollectionProducts } from "@/lib/shopify/products";

export const metadata: Metadata = {
  title: "Page not found",
};

// The design's 404: "Not here.", a way back to the shop or search, and four New in products.
export default function NotFound() {
  return (
    <main>
      {/* sz-grain keeps dark-mode colours inside, so the block carries its own dark background in both modes. */}
      <section className="sz-grain flex flex-col gap-8 border-b border-border bg-bg px-[var(--page-margin)] pt-24 pb-16 lg:pt-36 lg:pb-24">
        <span className="relative z-[2] font-mono text-body-s text-muted">404</span>
        <h1 className="sz-display relative z-[2] text-display-xl">Not here.</h1>
        <p className="relative z-[2] max-w-[420px] text-body-l">The page moved or never existed.</p>
        <div className="relative z-[2] flex flex-wrap gap-3">
          <Link href={LINKS.shopAll} className="sz-label flex h-[52px] items-center rounded-sm bg-fg px-8 text-bg">
            Shop all
          </Link>
          <Link href={LINKS.search} className="sz-label flex h-[52px] items-center gap-2.5 rounded-sm border border-fg px-8 text-fg">
            <SearchIcon size={16} />
            Search
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-12 px-[var(--page-margin)] py-16 lg:py-24">
        <h2 className="font-display text-h2 text-fg uppercase">New in</h2>
        <NewIn />
      </section>
    </main>
  );
}

async function NewIn() {
  if (!isShopifyConfigured()) return null;
  const collection = await getCollectionProducts("new-in", 4);
  if (!collection) return null;

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4 lg:gap-6">
      {collection.products.map((product) => (
        <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
      ))}
    </div>
  );
}
