# Shadoz storefront

Headless Shopify store for Shadoz (Sri Lanka, LKR), built with Next.js from the "Shadoz Storefront" design.
The build plan is in [PLAN.md](PLAN.md); the catalogue import and Shopify setup scripts are in [shopify/seed](shopify/seed/README.md).

## Stack
- Next.js 16 (App Router, Cache Components) with TypeScript
- Tailwind CSS 4, themed from the design's tokens in `app/globals.css` (dark by default, light mode toggle)
- Shopify Storefront API (2026-10) through `lib/shopify`, server-side with the private token

## Setup
1. Copy `.env.example` to `.env.local` and paste the Storefront API tokens from
   Shopify admin → Sales channels → Headless → Shadoz Next.js → Storefront API.
2. Install and run:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Project layout
- `app/` routes and the root layout (fonts, theme script, metadata)
- `components/` shared UI
- `lib/shopify/` Storefront API client and queries (cached with `use cache` and tagged for revalidation)
- `lib/money.ts` price formatting (`LKR 10,000`)
- `shopify/seed/` scripts that loaded the catalogue into the dev store
