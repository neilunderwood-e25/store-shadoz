// Placeholder product photography: free Unsplash photos (Unsplash License: free for commercial use,
// no attribution required). Picked for black / charcoal / off-white basics without visible brand
// logos. Replace with Shadoz's own photography before launch.

const unsplash = (photo) => `https://images.unsplash.com/${photo}?fm=jpg&q=80&w=1600&h=2000&fit=crop`;

// key → Unsplash photo id and alt text
const PHOTOS = {
  teeBlack: ["photo-1499971442178-8c10fdf5f6ac", "Black crew-neck tee on a hanger"],
  teeBlackWorn: ["photo-1618453292507-4959ece6429e", "Man in a black tee and black pants mid-jump"],
  teeCharcoal: ["photo-1524275539700-cf51138f679b", "Charcoal tees hanging on a rail"],
  teeWhite: ["photo-1581655353564-df123a1eb820", "Off-white crew-neck tee on a hanger"],
  teeWhiteWorn: ["photo-1574180566232-aaad1b5b8450", "Off-white tee worn with black jeans"],
  teeStack: ["photo-1716541425064-b07b68f436de", "Folded tees in black, charcoal and off-white"],
  longSleeve: ["photo-1618354691551-44de113f0164", "Black long-sleeve tee on a hanger"],
  poloBlack: ["photo-1625910513399-c9fcba54338c", "Man in a black polo"],
  poloWhite: ["photo-1622622016645-7b7065e7c129", "Off-white polo laid flat"],
  cropBlack: ["photo-1631492210747-6be6acde5dfa", "Woman in a black rib top"],
  cropWhite: ["photo-1673839869872-d8715706f9de", "Woman in an off-white top and black pants"],
  tankBlackW: ["photo-1586536253499-fd4c3698dce2", "Woman in a black tank"],
  tankBlackM: ["photo-1785355146243-6a944d173298", "Man in a black sleeveless top"],
  tankWhite: ["photo-1598554793905-075f7b355cd9", "Woman in an off-white sleeveless top"],
  athleticM: ["photo-1785355146214-271c6b6eba58", "Man in a black tank and shorts"],
  shortsBlack: ["photo-1789110519709-7a5311b51cb9", "Black shorts with white sneakers"],
  shortsGrey: ["photo-1789110520388-ebea45c8bbbb", "Charcoal shorts with white sneakers"],
  hoodieBlack: ["photo-1647797819874-f51a8a8fc5c0", "Person in a black hoodie"],
  hoodieBlackMood: ["photo-1513789181297-6f2ec112c0bc", "Black hoodie in low light"],
  hoodieGrey: ["photo-1556821840-3a63f95609a7", "Man in a charcoal pullover hoodie"],
  hoodieZip: ["photo-1787578994977-44deaae29ce2", "Man in a black zip hoodie"],
  hoodieWhite: ["photo-1615397587950-3cbb55f95b77", "Man in an off-white hoodie"],
  overshirt: ["photo-1644483878392-2d7e7c00eb3f", "Man in a black overshirt and black pants"],
  pantsBlack: ["photo-1605949478009-cf3e01396dd2", "Man in black tee and black pants against a wall"],
  tracksuitBlack: ["photo-1762575910569-46971cd69df3", "Man in a black tracksuit"],
  sweatpantsBlack: ["photo-1789110519894-e56e4db1f0c1", "Black sweatpants with white sneakers"],
  sweatpantsGrey: ["photo-1789110520164-2389992e5d0f", "Charcoal sweatpants with white sneakers"],
  jeans: ["photo-1633963643586-1a39077623be", "Stack of denim jeans"],
  skirtBlack: ["photo-1789110853398-539d78dd63bc", "Black skirt with an off-white tee"],
  boxers: ["photo-1601393709771-3938c63d41a6", "Black shorts on a hanger"],
  bra: ["photo-1622275048662-ee61e6d682f0", "Woman in a black sports bra"],
  sportTop: ["photo-1784924176793-7fe9f8cd96e7", "Woman in black training wear on a track"],
  leggings: ["photo-1789111161057-90c5ce12dc21", "Black leggings with white sneakers"],
  chainWorn: ["photo-1679973297361-b72700ced6a1", "Silver chain worn over a black top"],
  bracelet: ["photo-1744722093742-aad22c7fa68b", "Silver bracelet on a wrist"],
  rings: ["photo-1533657957778-3d76a086a95c", "Silver rings on a hand"],
  ringHand: ["photo-1612239396116-4da3087f8f79", "Hand wearing a silver ring"],
  capBlack: ["photo-1609868656710-4f299e957ec5", "Hand holding a dark cap"],
  capWhite: ["photo-1588850561407-ed78c282e89b", "Off-white cap on a white surface"],
  beanie: ["photo-1618354691792-d1d42acfd860", "Black knit beanie"],
  socksGrey: ["photo-1730447153639-f559d50a91ec", "Charcoal socks laid flat"],
  socksWhite: ["photo-1773837463640-e615246f7fa4", "Off-white socks worn"],
  socksStripe: ["photo-1639753249870-ca3b0c380fd3", "Ribbed socks with a stripe at the cuff"],
};

export const IMAGES = Object.fromEntries(
  Object.entries(PHOTOS).map(([key, [photo, alt]]) => [key, { key, url: unsplash(photo), alt }]),
);

// handle → the image for each colour (shown when that colour is picked), plus extra shots.
export const PRODUCT_IMAGES = {
  // tees
  "heavyweight-tee": { colours: { Black: "teeBlack", Charcoal: "teeCharcoal", "Off-white": "teeWhite" }, extra: ["teeBlackWorn"] },
  "boxy-tee": { colours: { Charcoal: "teeCharcoal", "Off-white": "teeWhiteWorn" }, extra: ["teeStack"] },
  "pocket-tee": { colours: { Black: "teeBlackWorn" }, extra: ["teeBlack"] },
  "long-sleeve-tee": { colours: { "Off-white": "teeWhite", Black: "longSleeve" } },
  "baby-tee": { colours: { Black: "teeBlack", "Off-white": "cropWhite" } },
  "fitted-tee": { colours: { Charcoal: "teeCharcoal" }, extra: ["teeStack"] },
  "long-sleeve-baby-tee": { colours: { Black: "longSleeve" } },
  // sportTop shows a third-party logo on the model's leggings, so it's uploaded but not used.
  "training-tee": { colours: { Black: "athleticM", Charcoal: "athleticM" } },
  // polos
  "pique-polo": { colours: { Black: "poloBlack", "Off-white": "poloWhite" } },
  "knit-polo": { colours: { Charcoal: "poloBlack" } },
  "cropped-polo": { colours: { "Off-white": "poloWhite", Black: "poloBlack" } },
  // crop tops
  "rib-crop-top": { colours: { Black: "cropBlack", "Off-white": "cropWhite" } },
  "boxy-crop-tee": { colours: { Charcoal: "teeCharcoal", "Off-white": "cropWhite" } },
  "tank-crop": { colours: { Black: "tankBlackW" } },
  // tanks
  "rib-tank": { colours: { Black: "tankBlackM", "Off-white": "tankWhite" } },
  "mesh-tank": { colours: { Black: "athleticM", Charcoal: "tankBlackM" } },
  "fitted-tank": { colours: { Black: "tankBlackW", "Off-white": "tankWhite", Charcoal: "cropBlack" } },
  "training-tank": { colours: { Black: "tankBlackM", "Off-white": "tankWhite" } },
  // shorts
  "sweat-short": { colours: { Black: "shortsBlack", Charcoal: "shortsGrey" } },
  "mesh-short": { colours: { Charcoal: "shortsGrey" } },
  "bike-short": { colours: { Black: "shortsBlack", Charcoal: "shortsGrey" } },
  "track-short": { colours: { Black: "athleticM" } },
  "running-short": { colours: { Black: "shortsBlack", Charcoal: "shortsGrey" } },
  // hoodies & jackets
  "heavyweight-hoodie": { colours: { Black: "hoodieBlack", Charcoal: "hoodieGrey" }, extra: ["hoodieBlackMood"] },
  "twill-overshirt": { colours: { Black: "overshirt", Charcoal: "overshirt", "Off-white": "overshirt" }, extra: ["pantsBlack"] },
  "zip-hoodie": { colours: { Charcoal: "hoodieZip" } },
  "cropped-hoodie": { colours: { Charcoal: "hoodieGrey", Black: "hoodieBlackMood" } },
  "fitted-zip-hoodie": { colours: { "Off-white": "hoodieWhite" } },
  "zip-training-jacket": { colours: { Black: "tracksuitBlack", Charcoal: "tracksuitBlack" } },
  // jeans & joggers
  "wide-pant": { colours: { Black: "pantsBlack", Charcoal: "sweatpantsGrey" }, extra: ["sweatpantsBlack"] },
  "fleece-jogger": { colours: { Black: "tracksuitBlack", Charcoal: "sweatpantsGrey" } },
  "straight-jean": { colours: { Black: "teeWhiteWorn" }, extra: ["jeans"] },
  "slim-jogger": { colours: { Charcoal: "sweatpantsGrey", Black: "sweatpantsBlack" } },
  "baggy-jean": { colours: { Black: "jeans" } },
  // skirts
  "mini-skirt": { colours: { Black: "skirtBlack", Charcoal: "skirtBlack" } },
  "pleated-skirt": { colours: { Black: "skirtBlack" } },
  // underwear
  "boxer-brief-3-pack": { colours: { Black: "boxers", Charcoal: "boxers" } },
  "soft-bra": { colours: { Black: "bra", "Off-white": "bra" } },
  "rib-brief-3-pack": { colours: { Black: "boxers", Charcoal: "boxers" } },
  // leggings
  "training-legging": { colours: { Black: "leggings", Charcoal: "leggings" } },
  "compression-legging": { colours: { Black: "leggings" } },
  // accessories
  "six-panel-cap": { colours: { Black: "capBlack", "Off-white": "capWhite" } },
  "washed-dad-cap": { colours: { Charcoal: "capBlack", "Off-white": "capWhite" } },
  "rib-beanie": { colours: { Black: "beanie", Charcoal: "beanie" } },
  "box-chain-necklace": { colours: { Silver: "chainWorn", Gunmetal: "chainWorn" } },
  "curb-chain-bracelet": { colours: { Silver: "bracelet", Gunmetal: "bracelet" } },
  "signet-ring": { colours: { Silver: "rings" }, extra: ["ringHand"] },
  "crew-sock-3-pack": { colours: { Black: "socksGrey", "Off-white": "socksWhite" } },
  "ribbed-sport-sock": { colours: { "Off-white": "socksStripe", Charcoal: "socksGrey" } },
  "logo-ankle-sock-2-pack": { colours: { Black: "socksGrey" } },
};
