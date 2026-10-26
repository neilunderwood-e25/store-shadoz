# Shadoz catalogue import

Loads the design's catalogue into the dev store `shadoz-dev-k7sis72f.myshopify.com`:
11 product fields, 50 products (458 variants, with stock) and 6 automated collections.
All operations are validated against Admin API 2026-07. Run from the project root, in this order.

| Step | What it does | Writes to the store? |
| --- | --- | --- |
| 1. `store auth` | Grants the CLI access to the store | No |
| 2. `01-check-store.graphql` | Shows currency, tax setting, location ID, product count | No |
| 3. `02-metafield-definitions.graphql` | Creates the product fields (gender, fit, feature, details, care, size guide…) | Yes |
| 4. `build-products.mjs` | Builds `products.jsonl` locally from `catalog.mjs` | No (local file) |
| 5. `03-products.graphql` + `products.jsonl` | Bulk-imports the 50 products; upserts by handle, so re-running updates instead of duplicating | Yes |
| 6. `04-collections.graphql` | Creates Mens, Womens, Sportswear, Accessories, Shop all, New in | Yes |

```bash
shopify store auth --store shadoz-dev-k7sis72f.myshopify.com --scopes read_products,write_products,read_inventory,write_inventory,read_locations,read_markets_home
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/01-check-store.graphql
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/02-metafield-definitions.graphql --allow-mutations
node shopify/seed/build-products.mjs --location <location id from step 2>
shopify store bulk execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/03-products.graphql --variable-file shopify/seed/products.jsonl --allow-mutations --watch
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/04-collections.graphql --allow-mutations
```

Check in step 2 that `currencyCode` is `LKR` before importing: prices in `catalog.mjs` are LKR amounts.

## Publishing to the Headless channel
**Status 2026-10-26:** not needed for this import. Shopify published every existing product and collection to the Headless publication (`gid://shopify/Publication/140849512682`, "Shadoz Next.js") when the channel was created. Step 11 confirmed all 50 Shadoz products and all 6 collections are on it. That includes 15 of the 17 demo products, which still need removing.

The channel's auto-publish is **off**, so products added later need publishing. Use steps 7–11 for that. `publicationUpdate` accepts products only; Shopify rejects collections on a catalog publication.

| Step | What it does | Writes to the store? |
| --- | --- | --- |
| 7. `store auth` again | Adds `read_publications` and `write_publications` | No |
| 8. `06-find-publications.graphql` | Lists sales-channel publications; pick the Headless one | No |
| 9. `build-publish.mjs` | Collects the product IDs from `out-03-products.jsonl` into `publish.variables.json` | No (local file) |
| 10. `07-publish-to-headless.graphql` | Adds those products to the Headless publication in one call | Yes |
| 11. `08-verify-published.graphql` | Counts the publication's products and checks each collection | No |

```bash
shopify store auth --store shadoz-dev-k7sis72f.myshopify.com --scopes read_products,write_products,read_inventory,write_inventory,read_locations,read_markets_home,read_publications,write_publications
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/06-find-publications.graphql
node shopify/seed/build-publish.mjs --publication <Headless publication id from step 8>
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/07-publish-to-headless.graphql --variable-file shopify/seed/publish.variables.json --allow-mutations
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/08-verify-published.graphql --variables '{"pub":"<Headless publication id>"}'
```

## Product images (placeholders)
`images.mjs` lists 43 free Unsplash photos (black / charcoal / off-white basics, no visible logos) and
which photo each product shows for each colour. Shopify fetches them from Unsplash and keeps its own
copies, each uploaded once and shared by ID, so there are no duplicates.

| Step | What it does | Writes to the store? |
| --- | --- | --- |
| 12. `store auth` again | Adds `read_files` and `write_files` | No |
| 13. `build-images.mjs` | Checks every product colour has a photo; writes `images.variables.json` | No (local file) |
| 14. `09-create-images.graphql` | Uploads the 43 photos to Shopify Files; results in `out-09-images.json` | Yes |
| 15. `build-products.mjs` + `03-products.graphql` | Rebuilds `products.jsonl` with the photos and re-runs the upsert: product media plus each variant's colour photo | Yes |

```bash
shopify store auth --store shadoz-dev-k7sis72f.myshopify.com --scopes read_products,write_products,read_inventory,write_inventory,read_locations,read_markets_home,read_publications,write_publications,read_files,write_files
node shopify/seed/build-images.mjs
shopify store execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/09-create-images.graphql --variable-file shopify/seed/images.variables.json --allow-mutations --json > shopify/seed/out-09-images.json
node shopify/seed/build-products.mjs --location gid://shopify/Location/78771257578
shopify store bulk execute --store shadoz-dev-k7sis72f.myshopify.com --query-file shopify/seed/03-products.graphql --variable-file shopify/seed/products.jsonl --allow-mutations --watch --output-file shopify/seed/out-03-products.jsonl
```

Re-running the upsert also resets stock to the numbers in `catalog.mjs`. That's fine while there are no real orders.

## How the catalogue maps to Shopify
- **Options:** Colour and Size. Variant SKUs follow `<base>-<colour>-<size>`, e.g. `SZ-TEE-001-BLK-M`.
- **Product type** = the design's category (Tees, Socks…), which drives the Category filter.
- **Tags:** `shadoz` on everything, `gender:men|women|unisex|all`, `dept:sportswear|accessories`, `new`.
- **Product fields (`custom.*`):** gender, fit, feature (filters), fit_note, fit_details, details, care, size_note, size_guide (JSON tables), size_guide_note, released.
- **Stock:** exact numbers for the 13 products with full pages in the design; 6 per variant for the rest; 0 for the ones marked sold out.
- **Newest-first sorting:** products are imported oldest release first, so Shopify's creation-date sort follows the design's release dates.

## Not in this import yet
- "Pairs with" links between products (`pairs` in `catalog.mjs`). They need the product IDs this import creates.
- Product images (the design only has placeholders), menus, and removing Shopify's demo products.
