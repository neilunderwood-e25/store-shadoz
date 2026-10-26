import "server-only";

// Storefront API settings, from .env.local (see .env.example).
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-10";

// Every price and availability read is for the Sri Lanka market.
export const COUNTRY = "LK";

export function isShopifyConfigured() {
  return Boolean(domain && privateToken);
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

// Runs a Storefront API query with the private token, so it must stay on the server.
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !privateToken) {
    throw new Error("Shopify isn't configured: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN in .env.local.");
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": privateToken,
    },
    body: JSON.stringify({ query, variables: { country: COUNTRY, ...variables } }),
  });

  if (!res.ok) {
    throw new Error(`Storefront API responded ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Storefront API error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data as T;
}
