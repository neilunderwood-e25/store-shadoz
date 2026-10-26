// Site navigation, from the design's Header (mega menus, mobile drawer) and Footer.
// Category and sort links point at the collection pages with query params that Phase 2 reads.

export type MenuKey = "mens" | "womens" | "sportswear" | "accessories";

export type NavLink = {
  label: string;
  href: string;
};

export type Menu = {
  key: MenuKey;
  label: string;
  href: string;
  featuredTitle: string;
  featured: NavLink[];
  exploreTitle: string;
  explore: NavLink[];
  caption: string;
  tileTitle: string;
};

type CollectionParams = {
  category?: string;
  sort?: "newest" | "best-selling";
  maxPrice?: number;
};

export function collectionHref(handle: string, params: CollectionParams = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.sort) query.set("sort", params.sort);
  if (params.maxPrice) query.set("max", String(params.maxPrice));
  const qs = query.toString();
  return `/collections/${handle}${qs ? `?${qs}` : ""}`;
}

// Mens, Womens and Sportswear lead with the same four featured links.
function featuredFor(handle: string): NavLink[] {
  return [
    { label: "New Arrivals", href: collectionHref(handle, { sort: "newest" }) },
    { label: "Best Sellers", href: collectionHref(handle, { sort: "best-selling" }) },
    // Essentials and Last Chance have no product rule yet; they open the department until they do.
    { label: "Essentials", href: collectionHref(handle) },
    { label: "Last Chance", href: collectionHref(handle) },
  ];
}

function categories(handle: string, names: string[]): NavLink[] {
  return names.map((name) => ({ label: name, href: collectionHref(handle, { category: name }) }));
}

export const MENUS: Menu[] = [
  {
    key: "mens",
    label: "Mens",
    href: collectionHref("mens"),
    featuredTitle: "Featured",
    featured: featuredFor("mens"),
    exploreTitle: "Explore",
    explore: categories("mens", ["Tees", "Polos", "Tanks", "Shorts", "Hoodies & Jackets", "Jeans & Joggers", "Underwear"]),
    caption: "Mens — Drop 04 campaign",
    tileTitle: "The overshirt",
  },
  {
    key: "womens",
    label: "Womens",
    href: collectionHref("womens"),
    featuredTitle: "Featured",
    featured: featuredFor("womens"),
    exploreTitle: "Explore",
    explore: categories("womens", [
      "Tees",
      "Polos",
      "Crop Tops",
      "Tanks",
      "Hoodies & Jackets",
      "Jeans & Joggers",
      "Skirts",
      "Shorts",
      "Underwear",
    ]),
    caption: "Womens — Drop 04 campaign",
    tileTitle: "The cropped hoodie",
  },
  {
    key: "sportswear",
    label: "Sportswear",
    href: collectionHref("sportswear"),
    featuredTitle: "Featured",
    featured: featuredFor("sportswear"),
    exploreTitle: "Explore",
    explore: categories("sportswear", ["Tops", "Shorts", "Leggings"]),
    caption: "Sportswear — training, low light",
    tileTitle: "The training tee",
  },
  {
    // Accessories leads with its categories instead of the featured links.
    key: "accessories",
    label: "Accessories",
    href: collectionHref("accessories"),
    featuredTitle: "Categories",
    featured: categories("accessories", ["Chains & Jewellery", "Caps & Hats", "Socks"]),
    exploreTitle: "Explore",
    explore: [
      { label: "New Arrivals", href: collectionHref("accessories", { sort: "newest" }) },
      { label: "Best Sellers", href: collectionHref("accessories", { sort: "best-selling" }) },
      { label: "Under LKR 5,000", href: collectionHref("accessories", { maxPrice: 5000 }) },
    ],
    caption: "Accessories — chains, close-up",
    tileTitle: "The box chain",
  },
];

export const LINKS = {
  home: "/",
  shopAll: collectionHref("shop-all"),
  newIn: collectionHref("new-in"),
  about: "/about",
  account: "/account",
  help: "/help",
  contact: "/contact",
  search: "/search",
  cart: "/cart",
};

export const ANNOUNCEMENT = "Free delivery anywhere in Colombo for orders over LKR 15,000";

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New in", href: LINKS.newIn },
      { label: "Tees", href: collectionHref("shop-all", { category: "Tees" }) },
      { label: "Hoodies & Jackets", href: collectionHref("shop-all", { category: "Hoodies & Jackets" }) },
      { label: "Jeans & Joggers", href: collectionHref("shop-all", { category: "Jeans & Joggers" }) },
      { label: "Shorts", href: collectionHref("shop-all", { category: "Shorts" }) },
      { label: "Underwear", href: collectionHref("shop-all", { category: "Underwear" }) },
      { label: "Sportswear", href: collectionHref("sportswear") },
      { label: "Accessories", href: collectionHref("accessories") },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: `${LINKS.help}#shipping` },
      { label: "Returns", href: `${LINKS.help}#returns` },
      { label: "Size guide", href: `${LINKS.help}#sizing` },
      { label: "FAQ", href: LINKS.help },
      { label: "Contact", href: LINKS.contact },
    ],
  },
  {
    title: "Shadoz",
    links: [
      { label: "About", href: LINKS.about },
      { label: "Account", href: LINKS.account },
      // Placeholders until the brand's own profiles are known.
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
  },
];
