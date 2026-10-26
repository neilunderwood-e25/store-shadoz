// Builds the variables for 09-create-images.graphql: every placeholder photo, once.
//
//   node build-images.mjs   → writes images.variables.json

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { products } from "./catalog.mjs";
import { IMAGES, PRODUCT_IMAGES } from "./images.mjs";

// Every product needs an image for each of its colours, and every key must exist.
const problems = [];
for (const p of products) {
  const assigned = PRODUCT_IMAGES[p.handle];
  if (!assigned) problems.push(`${p.handle}: no images`);
  for (const colour of p.colours) if (!assigned?.colours[colour]) problems.push(`${p.handle}: no image for ${colour}`);
  for (const key of [...Object.values(assigned?.colours ?? {}), ...(assigned?.extra ?? [])]) {
    if (!IMAGES[key]) problems.push(`${p.handle}: unknown image "${key}"`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

// No custom filename: Unsplash URLs have no extension, and Shopify requires a filename's extension to match its source.
const files = Object.values(IMAGES).map((img) => ({
  originalSource: img.url,
  alt: img.alt,
  contentType: "IMAGE",
}));

const out = fileURLToPath(new URL("./images.variables.json", import.meta.url));
writeFileSync(out, JSON.stringify({ files }, null, 2) + "\n");
console.log(`Wrote ${files.length} images to ${out}`);
