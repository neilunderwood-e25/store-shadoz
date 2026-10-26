// Collects the product IDs the import created (out-03-products.jsonl) into the variables
// for 07-publish-to-headless.graphql. Only products: the Headless publication is a catalog
// publication, and Shopify rejects collections there ("can only contain products").
// Shopify already published every existing product and collection when the channel was
// created; this is for products added later, since the channel's auto-publish is off.
//
//   node build-publish.mjs --publication gid://shopify/Publication/123   → writes publish.variables.json

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({ options: { publication: { type: 'string' } } });
if (!args.publication?.startsWith('gid://shopify/Publication/')) {
  console.error('Pass --publication <gid://shopify/Publication/...> (the Headless one from 06-find-publications.graphql).');
  process.exit(1);
}

const here = (name) => fileURLToPath(new URL(name, import.meta.url));

const productIds = readFileSync(here('./out-03-products.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line).data?.productSet?.product?.id)
  .filter(Boolean);

const out = here('./publish.variables.json');
writeFileSync(out, JSON.stringify({ id: args.publication, publishables: productIds }, null, 2) + '\n');
console.log(`Wrote ${productIds.length} products to ${out}`);
