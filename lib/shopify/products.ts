import { cacheLife, cacheTag } from "next/cache";
import { storefront } from "./client";
import type { Money } from "@/lib/money";

const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!, $country: CountryCode!) @inContext(country: $country) {
    collection(handle: $handle) {
      title
      products(first: $first, sortKey: CREATED, reverse: true) {
        nodes {
          id
          handle
          title
          availableForSale
          tags
          images(first: 2) {
            nodes {
              url
              altText
              width
              height
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          options(first: 2) {
            name
            optionValues {
              name
            }
          }
        }
      }
    }
  }
`;

type CollectionProductsData = {
  collection: {
    title: string;
    products: {
      nodes: {
        id: string;
        handle: string;
        title: string;
        availableForSale: boolean;
        tags: string[];
        images: { nodes: ShopifyImage[] };
        priceRange: { minVariantPrice: Money };
        options: { name: string; optionValues: { name: string }[] }[];
      }[];
    };
  } | null;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

// What a product card needs, shaped the way the design's Card component reads it.
export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  image: ShopifyImage | null;
  // Shown on hover, as the design's card swaps "front" for "on body".
  hoverImage: ShopifyImage | null;
  price: Money;
  colours: string[];
  badges: string[];
};

export async function getCollectionProducts(handle: string, first = 12) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `collection:${handle}`);

  const data = await storefront<CollectionProductsData>(COLLECTION_PRODUCTS_QUERY, { handle, first });
  if (!data.collection) return null;

  return {
    title: data.collection.title,
    products: data.collection.products.nodes.map(
      (p): ProductCard => ({
        id: p.id,
        handle: p.handle,
        title: p.title,
        image: p.images.nodes[0] ?? null,
        hoverImage: p.images.nodes[1] ?? null,
        price: p.priceRange.minVariantPrice,
        colours: p.options.find((o) => o.name === "Colour")?.optionValues.map((v) => v.name) ?? [],
        // Same badges, in the same order, as the design's collection grid.
        badges: [
          p.tags.includes("new") && "New",
          p.tags.includes("gender:unisex") && "Unisex",
          !p.availableForSale && "Sold out",
        ].filter((b): b is string => Boolean(b)),
      }),
    ),
  };
}
