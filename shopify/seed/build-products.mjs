// Turns catalog.mjs into the JSONL file that `shopify store bulk execute` feeds to productSet,
// one product per line, upserted by handle (re-running updates the products instead of duplicating them).
//
//   node build-products.mjs --location gid://shopify/Location/123   → writes products.jsonl
//   node build-products.mjs --sample                                → prints one product as an inline mutation (for validation)
//
// Once out-09-images.json exists (the uploaded photos), each product gets its images and each
// variant the photo for its colour.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { products, APPAREL, DEFAULT_STOCK } from './catalog.mjs';
import { IMAGES, PRODUCT_IMAGES } from './images.mjs';

const { values: args } = parseArgs({ options: { location: { type: 'string' }, sample: { type: 'boolean' } } });
const locationId = args.location ?? (args.sample ? 'gid://shopify/Location/1' : null);
if (!locationId) {
  console.error('Pass --location <gid://shopify/Location/...> (from 01-check-store.graphql), or --sample.');
  process.exit(1);
}

// Image key → Shopify file ID. fileCreate returns files in the order they were sent (build-images.mjs order).
function loadImageIds() {
  const keys = Object.keys(IMAGES);
  if (args.sample) return Object.fromEntries(keys.map((key, i) => [key, `gid://shopify/MediaImage/${i + 1}`]));
  const path = fileURLToPath(new URL('./out-09-images.json', import.meta.url));
  if (!existsSync(path)) return null;
  const result = JSON.parse(readFileSync(path, 'utf8').split('\n').filter((l) => !l.includes('"type":"progress"')).join('\n'));
  const files = result.fileCreate?.files ?? [];
  if (files.length !== keys.length || files.some((f, i) => f.alt !== IMAGES[keys[i]].alt)) {
    console.error('out-09-images.json does not line up with images.mjs; re-run the image upload.');
    process.exit(1);
  }
  return Object.fromEntries(keys.map((key, i) => [key, files[i].id]));
}
const imageIds = loadImageIds();

const COLOUR_CODE = { Black: 'BLK', Charcoal: 'CHR', 'Off-white': 'OWH', Silver: 'SLV', Gunmetal: 'GUN' };
const SIZE_CODE = { 'One size': 'OS', Adjustable: 'ADJ', 'UK 3–6': 'UK3-6', 'UK 6–9': 'UK6-9', 'UK 9–12': 'UK9-12' };
const TYPE_CODE = {
  Tees: 'TEE', Polos: 'POL', 'Crop Tops': 'CRP', Tanks: 'TNK', Shorts: 'SHO', 'Hoodies & Jackets': 'HOD',
  'Jeans & Joggers': 'PNT', Skirts: 'SKT', Underwear: 'UND', Tops: 'TOP', Leggings: 'LEG'
};
const GENDER_LABEL = { men: 'Men', women: 'Women', unisex: 'Unisex', all: 'All' };

// Products without a design SKU get the next free number for their type, e.g. SZ-TEE-002.
const used = new Map();
for (const p of products) {
  if (!p.sku) continue;
  const [, code, n] = p.sku.split('-');
  used.set(code, Math.max(used.get(code) ?? 0, Number(n)));
}
function baseSku(p) {
  if (p.sku) return p.sku;
  const code = TYPE_CODE[p.type];
  const n = (used.get(code) ?? 0) + 1;
  used.set(code, n);
  return `SZ-${code}-${String(n).padStart(3, '0')}`;
}

function metafields(p) {
  const m = [['gender', 'single_line_text_field', GENDER_LABEL[p.gender]]];
  if (p.fit) m.push(['fit', 'single_line_text_field', p.fit]);
  if (p.feature) m.push(['feature', 'single_line_text_field', p.feature]);
  if (p.fitNote) m.push(['fit_note', 'single_line_text_field', p.fitNote]);
  if (p.fitDetails) m.push(['fit_details', 'multi_line_text_field', p.fitDetails]);
  if (p.details) m.push(['details', 'multi_line_text_field', p.details]);
  if (p.care) m.push(['care', 'multi_line_text_field', p.care]);
  if (p.sizeNote) m.push(['size_note', 'single_line_text_field', p.sizeNote]);
  if (p.sizeGuide) m.push(['size_guide', 'json', JSON.stringify(p.sizeGuide)]);
  if (p.sizeGuideNote) m.push(['size_guide_note', 'single_line_text_field', p.sizeGuideNote]);
  m.push(['released', 'date', p.released]);
  return m.map(([key, type, value]) => ({ namespace: 'custom', key, type, value }));
}

function productLine(p) {
  const sizes = p.sizes ?? APPAREL;
  const sku = baseSku(p);
  const quantity = (colour, size) => (p.stock ? (p.stock[colour]?.[size] ?? 0) : p.soldOut ? 0 : DEFAULT_STOCK);
  const pictures = imageIds ? PRODUCT_IMAGES[p.handle] : null;
  // Product media: each colour's photo in colour order (the first is the featured image), then extras.
  const files = pictures
    ? [...new Set([...p.colours.map((c) => pictures.colours[c]), ...(pictures.extra ?? [])])].map((key) => ({ id: imageIds[key] }))
    : undefined;
  return {
    identifier: { handle: p.handle },
    input: {
      handle: p.handle,
      title: p.title,
      descriptionHtml: `<p>${p.desc}</p>`,
      vendor: 'Shadoz',
      productType: p.type,
      status: 'ACTIVE',
      tags: ['shadoz', `gender:${p.gender}`, p.dept && `dept:${p.dept}`, p.isNew && 'new'].filter(Boolean),
      productOptions: [
        { name: 'Colour', values: p.colours.map((name) => ({ name })) },
        { name: 'Size', values: sizes.map((name) => ({ name })) }
      ],
      variants: p.colours.flatMap((colour) =>
        sizes.map((size) => ({
          optionValues: [{ optionName: 'Colour', name: colour }, { optionName: 'Size', name: size }],
          price: p.price.toFixed(2),
          inventoryPolicy: 'DENY',
          inventoryItem: { sku: `${sku}-${COLOUR_CODE[colour]}-${SIZE_CODE[size] ?? size}`, tracked: true },
          inventoryQuantities: [{ locationId, name: 'available', quantity: quantity(colour, size) }],
          ...(pictures && { file: { id: imageIds[pictures.colours[colour]] } })
        }))
      ),
      ...(files && { files }),
      metafields: metafields(p)
    }
  };
}

// Oldest first, so "newest" sorting by creation date follows the design's release dates.
const lines = [...products].sort((a, b) => a.released.localeCompare(b.released)).map(productLine);

if (args.sample) {
  // Inline GraphQL literal of the first product, so the validator checks every input field name.
  const ENUMS = new Set(['status', 'inventoryPolicy']);
  const gql = (v, key) =>
    Array.isArray(v) ? `[${v.map((x) => gql(x)).join(', ')}]`
    : v && typeof v === 'object' ? `{ ${Object.entries(v).map(([k, x]) => `${k}: ${gql(x, k)}`).join(', ')} }`
    : ENUMS.has(key) ? v
    : JSON.stringify(v);
  const { identifier, input } = lines[0];
  console.log(`mutation { productSet(identifier: ${gql(identifier)}, input: ${gql(input)}) { product { id handle } userErrors { field message code } } }`);
} else {
  const out = fileURLToPath(new URL('./products.jsonl', import.meta.url));
  writeFileSync(out, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
  const variants = lines.reduce((n, l) => n + l.input.variants.length, 0);
  console.log(`Wrote ${lines.length} products (${variants} variants) to ${out}`);
}
