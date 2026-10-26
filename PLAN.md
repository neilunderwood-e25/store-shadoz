# Shadoz Storefront — build plan

Headless Shopify store with a Next.js frontend, built from the "Shadoz Storefront" design artifact.
Market: Sri Lanka (LKR). Payment gateway is decided in Phase 8.

---

## 1. What the design contains

**Brand and design system**
- Dark mode by default, with a light mode toggle. The choice is saved in `localStorage` (`sz:theme`); with nothing saved, the device setting is used.
- Tokens come from `ds/shadoz/tokens.css`: a palette of black/charcoal/stone/bone/off-white plus oxide (error) and moss (ok). Square corners (radius 0–2px), spacing from 4 to 144px, a 1440px max content width, a 64px header and a 32px announcement bar.
- Fonts: **Anta** for display text (a local TTF ships with the design), **Archivo** for body text and **JetBrains Mono** for mono text (both Google Fonts).
- Type scale: display-xl/l/m, h1–h3, body-l/body/body-s, label, micro, mono.

**Catalogue in the design** (13 products, prices from LKR 2,900 to 13,500)

| Category | Products |
| --- | --- |
| Tees | Heavyweight Tee (6,900) |
| Jeans & Joggers | Wide Pant (10,000) |
| Hoodies & Jackets | Heavyweight Hoodie (13,500), Twill Overshirt (11,900) |
| Caps & Hats | Six-Panel Cap (4,900), Washed Dad Cap (4,500), Rib Beanie (3,900) |
| Chains & Jewellery | Box Chain Necklace (6,500), Curb Chain Bracelet (4,900), Signet Ring (5,500) |
| Socks | Crew Sock 3-Pack (2,900), Ribbed Sport Sock, Logo Ankle Sock 2-Pack |

- Options: **Colour** (Black, Charcoal, Off-white, Silver, Gunmetal) and **Size** (XS–XXL, One size, Adjustable, UK sock sizes).
- Extra product data: gender (men / women / unisex / all), fit note, description, care and size guide.
- Footer categories with no products yet: Shorts, Underwear.

**Screens → routes**

| Design screen(s) | Next.js route | Data source |
| --- | --- | --- |
| Main / Home-m (hero, New in, campaign, story, community grid) | `/` | Storefront API + metaobjects |
| CollectionPage (mens, womens, sportswear, accessories, all) with filter panel and sort menu | `/collections/[handle]` | `collection.products(filters, sortKey)` |
| PDP / Product-* (gallery, colour/size, size guide, accordions, "Pairs with") | `/products/[handle]` | `product`, `productRecommendations` |
| Header search overlay (predictive results, categories, "did you mean") | header component | `predictiveSearch` |
| SearchResults / Srch* (filters, sort, empty state, "Popular right now") | `/search?q=` | `search` |
| CartDrawer (added toast, free-delivery note) | header component | Cart API |
| Cart (order note, summary, "Pairs with") | `/cart` | Cart API |
| Checkout, Confirmation | **Shopify-hosted checkout** (see section 3) | — |
| Login | redirect to Shopify sign-in (see section 3) | Customer Account API |
| Account (overview), Orders | `/account`, `/account/orders` | Customer Account API |
| About, Help (FAQ + size tables), Contact | `/about`, `/help`, `/contact` | metaobjects / pages |
| NotFound | `not-found.tsx` | Storefront API (New in) |
| Header states (top / scrolled / scrolled-away, transparent over the home hero, pinned or scrolling delivery bar), mega menus, mobile drawer, Light* variants | layout | `menu(handle)` |

**Screens the design doesn't include** (we either design them or derive them from existing parts):
- Order detail
- Addresses and Details tabs in the account area
- Shipping and Returns pages, which the footer links to

---

## 2. Architecture

```
Next.js (App Router, TypeScript, Tailwind v4)  ── hosted on Vercel
 ├─ Server Components  → Storefront API (private token, server-side only)
 │                        @inContext(country: LK) so all prices come back in LKR
 ├─ Server Actions     → Cart API (cart ID kept in an httpOnly cookie)
 ├─ /account/*         → Customer Account API (OAuth 2.0 + PKCE)
 ├─ Checkout button    → cart.checkoutUrl  → Shopify checkout (payments live here)
 └─ /api/revalidate    ← Shopify webhooks (products / collections / inventory) → revalidateTag
```

- **Storefront API:** pin the latest stable version when we scaffold (2026-07 per the docs today). Use a small typed `fetch` wrapper with GraphQL codegen rather than a heavy SDK. Tag every query by resource so webhooks can expire just what changed.
- **Shopify admin setup:** the **Headless** sales channel issues the Storefront tokens and the Customer Account API client. The **Search & Discovery** app turns on the filters.
- **Content:** About, Help/FAQ, size guides, campaign blocks and the community grid live in **metaobjects**, so they can be edited in Shopify without a deploy. Navigation comes from Shopify **menus**.
- **Start without a store:** the frontend can be built against **mock.shop**, a free demo Storefront API with an apparel catalogue, until the dev store is ready. The same queries work against the real store.

---

## 3. Where the design and Shopify don't match

These four are platform rules, not choices, so the affected screens change shape.

1. **Checkout and Confirmation can't be Next.js pages.** A headless Shopify store hands the cart to Shopify's own checkout through `checkoutUrl`. We match it to the design with the checkout & accounts editor: colours, fonts (Anta can be uploaded), logo and layout.
   - On **non-Plus** plans the information, shipping and payment steps can only be styled.
   - Checkout UI extensions on those steps, and the Admin branding API, are **Shopify Plus only**.
   - The Thank you and Order status pages accept extensions on every plan except Starter.
   - The design's **District** dropdown and **Gift card** field both depend on Shopify's Sri Lanka checkout form. To check during store setup.
2. **The Login / Create account screen won't exist as designed.** Shopify removed legacy (password) customer accounts for new stores on 26 Feb 2026.
   - Sign-in is now Shopify-hosted and passwordless (an emailed code). It can be styled in the same editor.
   - "Sign in" in our header goes to that page and returns to our `/account` pages, which we build ourselves with the Customer Account API.
   - Dev note: the sign-in callback must use **HTTPS**. Localhost doesn't work, so use ngrok or a Vercel preview URL.
3. **The Contact form and newsletter signup have no Storefront API.** They need a server action:
   - Contact → send an email (for example with Resend).
   - Newsletter → create the customer with email-marketing consent through a server-only Admin API token, so the list stays in Shopify Email.
4. **Delivery rules.** The design promises:
   - free delivery in Colombo on orders over LKR 15,000 (announcement bar);
   - free standard delivery island-wide in 2–4 days (cart and checkout);
   - express next-day delivery in Colombo at a rate not yet set.

   Shopify's local delivery (by postal code) can cover the Colombo rules. **Content question:** "free island-wide" and "free in Colombo over 15,000" contradict each other. Which one is true?

---

## 4. Phases

### Phase 0 — Store and accounts setup
- [x] Create the dev store. **Done 2026-10-26:** "Shadoz Dev", `shadoz-dev-k7sis72f.myshopify.com`, country LK, simulated Basic plan, with Shopify's demo data (remove or hide the demo products once ours are in).
- [ ] Store settings:
  - [x] currency LKR and a Sri Lanka market (checked 2026-10-26)
  - [ ] VAT: **left until launch (decided 2026-10-26).** Shopify treats Sri Lanka as a tax-exclusive country and warns against tax-inclusive prices for Sri Lankan stores, so that switch stays off. No tax is collected yet, so the listed price is what customers pay. Before launch: confirm VAT registration with the accountant, then set the tax rules and the design's "taxes included" wording to match.
  - [ ] new customer accounts
- [x] Install the **Headless** channel. **Done 2026-10-26:** storefront "Shadoz Next.js" created and Storefront API permissions set. Tokens go into `.env.local` when the Next.js project exists, never into the repo or chat. Customer Account API waits for Phase 6.
- [x] Install **Search & Discovery** and add the filters. **Done 2026-10-26:** Availability, Price, Category (product type), Colour, Size, Features, Fit, Gender.
- [x] Seed the catalogue. **Done 2026-10-26** with the files in `shopify/seed/`: 11 product fields, all 50 products from the design (458 variants, stock at Shop location) and 6 automated collections (Mens, Womens, Sportswear, Accessories, Shop all, New in). All 50 products and 6 collections are on the Headless channel (Shopify published them when the channel was created; its auto-publish is off for new products). Placeholder photos added 2026-10-26: 43 free Unsplash photos, a photo for every product colour (`shopify/seed/images.mjs`); replace with Shadoz photography before launch. Still to do: "Pairs with" links, and archiving the 17 demo products (15 of them are on the Headless channel too).
- [ ] Menus: main menu, the four mega menus and the footer columns.
- [ ] **Quick payment check (about 15 minutes):** open Settings → Payments on the LK store and list which card providers Shopify offers. We still *choose* in Phase 8. This only confirms that a workable option exists, because the alternatives are far more expensive (see Phase 8).

### Phase 1 — Next.js foundation
- [x] Scaffold the app. **Done 2026-10-26** in `~/Documents/repos/store-shadoz`: Next.js 16.4 (App Router, Cache Components), React 19.3, Tailwind 4.3, TypeScript, pnpm. Git not initialised yet.
- [x] Port the design tokens (the storefront's `--sz-*` colours, radii, type scale, grain) into the Tailwind v4 theme in `app/globals.css`. Anta, Archivo and JetBrains Mono load through `next/font/google`.
- [x] Theme system: dark by default, light toggle saved as `sz:theme`, no-flash script, `.sz-grain` areas that stay dark, 400ms crossfade (off with reduced motion).
- [ ] `lib/shopify`: server-only client with the private token, `@inContext(country: LK)`, `use cache` + cache tags, money formatting (`LKR 10,000`) are **done**. Still to do: GraphQL codegen. Waiting on the Storefront tokens in `.env.local` to check live data.
- [x] Layout. **Done 2026-10-26** (`components/header`, `components/footer`):
  - [x] **Header:** announcement bar (pinned, or `bar="scroll"`); the glass notch that fades in on scroll over a hero (pages mark it with `data-sz-hero`) and is solid elsewhere; mega menus with the design's spring and stagger; mobile drawer with accordions; theme switch; cart count (0 until Phase 4).
  - [x] **Footer:** always dark; link columns; newsletter form that says it isn't connected yet (Phase 7).
  - Still to do: search overlay (Phase 3), cart drawer (Phase 4), menus from Shopify instead of `lib/navigation.ts` (optional).
- [ ] Shared UI: product Card (colour swatches, badges), Tile, buttons, inputs, select, accordion, drawer, modal, breadcrumb, and support for reduced motion.

### Phase 2 — Catalogue pages
- [ ] Home: hero, the "New in" rail, campaign and story blocks, community grid (from metaobjects).
- [ ] Collection template for all five collections:
  - [ ] filter panel driven by the facets Shopify returns, with counts
  - [ ] filter and sort state kept in the URL
  - [ ] product count, empty state and "Clear all filters"
  - [ ] mobile filter sheet
- [ ] Product page:
  - [ ] image gallery
  - [ ] colour and size selection with availability
  - [ ] size guide modal from metaobjects
  - [ ] quantity, add to cart, detail accordions, SKU
  - [ ] "Pairs with" from product recommendations
  - [ ] breadcrumb that follows the collection you came from
- [ ] 404 page.

### Phase 3 — Search
- [ ] Header search overlay with predictive search (products, categories, suggested queries) and keyboard navigation.
- [ ] `/search` results with the same filter and sort parts, an empty state and "Popular right now". "Did you mean" uses Shopify's suggested queries; how close it gets to the design needs testing.

### Phase 4 — Cart
- [ ] Cart API through server actions: create, add, update, remove; order note → cart note; gift cards (`cartGiftCardCodesUpdate`) if wanted before checkout.
- [ ] Cart drawer (added toast, free-delivery progress) and the `/cart` page with "Pairs with".
- [ ] Checkout button → a fresh `checkoutUrl` (requested at click time, as Shopify recommends).

### Phase 5 — Shopify checkout and order confirmation
- [ ] Style checkout, Thank you and Order status in the checkout & accounts editor to match the tokens and fonts.
- [ ] Shipping:
  - [ ] standard delivery island-wide
  - [ ] Colombo express next day (local delivery by postal code)
  - [ ] the free-delivery threshold
- [ ] Phone required, using the design's 10-digit format note.
- [ ] Test orders with the dev store's test gateway, plus **Cash on delivery** (a manual method that works on every plan).

### Phase 6 — Customer accounts
- [ ] OAuth + PKCE routes (`/account/login`, the callback, `/account/logout`), tokens in httpOnly cookies, refresh handling.
- [ ] Account pages:
  - [ ] Overview (latest order, default address, details)
  - [ ] Orders list and order detail
  - [ ] Addresses (add, edit, delete, set default)
  - [ ] Details (name, marketing consent)
- [ ] Signed-in checkout: attach the customer token to the cart so checkout is already signed in.

### Phase 7 — Content and support
- [ ] About, Help (FAQ groups and per-product size tables from metaobjects), Contact (form → email, plus WhatsApp and hours), Shipping and Returns pages, and policy pages from Shopify's own policies.
- [ ] Instagram community grid. Recommendation: a hand-picked metaobject list rather than a live API feed (the design's "Tag us to be featured" implies picking anyway).

### Phase 8 — Payment gateway (the decision you deferred)
- Shopify Payments isn't offered in Sri Lanka, so payment has to come from one of these:
  1. **A third-party provider that Shopify lists for Sri Lankan stores.** Shortlist the Sri Lankan gateways Shopify supports, compare fees, settlement in LKR and card coverage, then connect and test one in test mode. **Recommended.**
  2. **Manual methods:** Cash on delivery and bank transfer. Works out of the box, and the design already shows COD.
  3. **A custom payments extension.** Only for eligible Shopify Plus merchants, and only approved partners can build one. A last resort.
- The design's card form (Visa / Mastercard / Amex) becomes whatever the chosen gateway shows in Shopify checkout.

### Phase 9 — Launch
- [ ] SEO: metadata, Product JSON-LD, sitemap, canonical URLs, Open Graph images.
- [ ] Analytics: Shopify storefront analytics events, plus GA4 or Meta Pixel if wanted.
- [ ] Performance and accessibility pass (Lighthouse, keyboard use, focus states, contrast in both themes).
- [ ] Webhooks → revalidation tested end to end; error and loading states.
- [ ] Production domain (.lk), production sign-in callback URLs, real plan purchased, password page removed, launch checklist.

---

## 5. Decisions needed (with my recommendation)

| # | Decision | Recommendation | Needed by |
| --- | --- | --- | --- |
| 1 | Shopify plan | **Decided for now:** build on a free dev store; choose the paid plan before launch. Grow or Advanced, unless the checkout must look closer to the design than styling allows (that needs Plus). | Before launch |
| 2 | Hosting | Vercel (Shopify's Oxygen hosting only runs Hydrogen, Shopify's own framework, not Next.js) | Phase 1 |
| 3 | Delivery rules (free island-wide vs free in Colombo over 15k, express rate) | — content decision | Phase 5 |
| 4 | Contact email + newsletter provider | Resend for contact; Shopify customers + Shopify Email for the newsletter | Phase 7 |
| 5 | Real product data, photography, size tables | — content | Before launch |
| 6 | Payment gateway | Option 1 above, alongside COD | Phase 8 |
| 7 | VAT (registered or not; tax-inclusive wording) | Check with the accountant; keep Shopify's tax-exclusive default for Sri Lanka | Before launch |

---

## 6. Suggested next steps
1. Create the dev store with the CLI. It needs your Shopify login; I'll show the exact command before running it.
2. In parallel, scaffold the Next.js app with tokens, fonts, the theme toggle, Header and Footer against mock.shop.
3. Seed the 13 products and collections into the dev store, then point the app at it.
