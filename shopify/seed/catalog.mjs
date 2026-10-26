// Shadoz catalogue, transcribed from the "Shadoz Storefront" design artifact
// (CollectionPage: the 50-product list; PDP: full detail for 13 of them).
// Placeholder copy in [brackets] is kept as-is so it is easy to find and replace.

export const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const SOCK = ['UK 3–6', 'UK 6–9', 'UK 9–12'];

const TOP_GUIDE = {
  men: { head: ['Size', 'Chest (cm)', 'Length (cm)'], rows: [['XS', '86–91', '68'], ['S', '91–96', '70'], ['M', '96–101', '72'], ['L', '101–106', '74'], ['XL', '106–112', '76'], ['XXL', '112–118', '78']] },
  women: { head: ['Size', 'Bust (cm)', 'Length (cm)'], rows: [['XS', '78–82', '68'], ['S', '82–87', '70'], ['M', '87–92', '72'], ['L', '92–97', '74'], ['XL', '97–103', '76'], ['XXL', '103–109', '78']] }
};
const SOCK_GUIDE = { men: { head: ['Size', 'UK shoe', 'EU shoe'], rows: [['UK 3–6', '3–6', '36–39'], ['UK 6–9', '6–9', '39–43'], ['UK 9–12', '9–12', '43–47']] } };

// Products without a full product page in the design get this many units per variant (0 if sold out).
export const DEFAULT_STOCK = 6;

// gender: men | women | unisex (apparel) or all (sportswear and accessories)
// dept: sportswear | accessories, or absent for apparel shown under Mens / Womens
export const products = [
  // ---- apparel with full product pages ----
  {
    handle: 'heavyweight-tee', title: 'Heavyweight Tee', price: 6900, gender: 'unisex', type: 'Tees', sku: 'SZ-TEE-001',
    colours: ['Black', 'Charcoal', 'Off-white'], sizes: APPAREL, isNew: true, released: '2026-09-28', feature: 'Embroidered', fit: 'Boxy',
    stock: { Black: { XS: 0, S: 6, M: 12, L: 9, XL: 4, XXL: 2 }, Charcoal: { XS: 3, S: 5, M: 0, L: 7, XL: 3, XXL: 0 }, 'Off-white': { XS: 4, S: 8, M: 10, L: 0, XL: 5, XXL: 1 } },
    desc: '240gsm cotton. Boxy through the body, dropped shoulder. Washes soft, holds shape.',
    fitNote: 'Boxy. Size down for a regular fit.',
    details: '100% cotton jersey, 240gsm. Ribbed collar. Garment-washed.',
    fitDetails: 'Boxy, dropped shoulder. Model is 182cm and wears L.',
    care: 'Cold wash inside out. Hang dry. Do not tumble.',
    sizeGuide: TOP_GUIDE
  },
  {
    handle: 'wide-pant', title: 'Wide Pant', price: 10000, gender: 'unisex', type: 'Jeans & Joggers', sku: 'SZ-PNT-001',
    colours: ['Black', 'Charcoal'], sizes: APPAREL, released: '2026-08-14', feature: 'Embroidered', fit: 'Regular',
    stock: { Black: { XS: 2, S: 5, M: 8, L: 6, XL: 0, XXL: 2 }, Charcoal: { XS: 0, S: 3, M: 4, L: 5, XL: 2, XXL: 1 } },
    desc: 'Wide through the leg, high rise, clean at the hem. Cut to sit the same on any frame.',
    fitNote: 'Relaxed, high rise. Take your usual size.',
    details: '[Fabric, weight and trims.] High rise, wide leg, two side pockets, one back pocket.',
    care: 'Cold wash inside out. Hang dry. Do not tumble.',
    sizeGuide: {
      men: { head: ['Size', 'Waist (cm)', 'Hip (cm)', 'Inseam (cm)'], rows: [['XS', '71–76', '88–93', '78'], ['S', '76–81', '93–98', '79'], ['M', '81–86', '98–103', '80'], ['L', '86–91', '103–108', '81'], ['XL', '91–97', '108–114', '82'], ['XXL', '97–103', '114–120', '82']] },
      women: { head: ['Size', 'Waist (cm)', 'Hip (cm)', 'Inseam (cm)'], rows: [['XS', '62–66', '88–92', '76'], ['S', '66–70', '92–97', '77'], ['M', '70–75', '97–102', '78'], ['L', '75–80', '102–107', '79'], ['XL', '80–86', '107–113', '80'], ['XXL', '86–92', '113–119', '80']] }
    }
  },
  {
    handle: 'heavyweight-hoodie', title: 'Heavyweight Hoodie', price: 13500, gender: 'unisex', type: 'Hoodies & Jackets', sku: 'SZ-HOD-001',
    colours: ['Black', 'Charcoal'], sizes: APPAREL, released: '2026-07-20', feature: 'Printed', fit: 'Oversized',
    stock: { Black: { XS: 3, S: 6, M: 0, L: 8, XL: 5, XXL: 2 }, Charcoal: { XS: 2, S: 4, M: 6, L: 4, XL: 0, XXL: 0 } },
    desc: 'Heavy brushed-back fleece. Double-lined hood, ribbed cuffs and hem.',
    fitNote: 'Relaxed, dropped shoulder. Take your usual size.',
    details: '[Fabric weight and composition.] Kangaroo pocket. Double-lined hood.',
    care: 'Cold wash inside out. Hang dry. Do not tumble.',
    sizeGuide: TOP_GUIDE
  },
  {
    handle: 'twill-overshirt', title: 'Twill Overshirt', price: 11900, gender: 'men', type: 'Hoodies & Jackets', sku: 'SZ-SHT-001',
    colours: ['Black', 'Charcoal', 'Off-white'], sizes: APPAREL, isNew: true, released: '2026-10-06', feature: 'Embroidered', fit: 'Boxy',
    stock: { Black: { XS: 0, S: 4, M: 7, L: 6, XL: 3, XXL: 1 }, Charcoal: { XS: 1, S: 3, M: 5, L: 0, XL: 2, XXL: 1 }, 'Off-white': { XS: 0, S: 2, M: 3, L: 3, XL: 1, XXL: 0 } },
    desc: 'Heavy cotton twill. Two chest pockets, tonal buttons, straight hem.',
    fitNote: 'Boxy. Wear it open over a tee or buttoned as a shirt.',
    details: '[Fabric weight and composition.] Two chest pockets. Tonal buttons.',
    care: 'Cold wash inside out. Hang dry. Do not tumble.',
    sizeGuide: { men: TOP_GUIDE.men }
  },

  // ---- mens apparel ----
  { handle: 'boxy-tee', title: 'Boxy Tee', price: 5900, gender: 'men', type: 'Tees', colours: ['Charcoal', 'Off-white'], released: '2026-05-30', feature: 'Printed', fit: 'Boxy', desc: 'Wide through the body, cut high.' },
  { handle: 'pocket-tee', title: 'Pocket Tee', price: 5500, gender: 'men', type: 'Tees', colours: ['Black'], isNew: true, released: '2026-09-15', feature: 'Embroidered', fit: 'Regular', desc: 'Regular fit with a chest pocket.' },
  { handle: 'long-sleeve-tee', title: 'Long Sleeve Tee', price: 7900, gender: 'men', type: 'Tees', colours: ['Off-white', 'Black'], released: '2026-05-02', feature: 'Printed', fit: 'Regular', desc: 'Ribbed cuffs, relaxed body.' },
  { handle: 'rib-tank', title: 'Rib Tank', price: 4900, gender: 'men', type: 'Tanks', colours: ['Black', 'Off-white'], released: '2026-06-18', feature: 'Embroidered', fit: 'Regular', desc: 'Heavy rib knit tank, bound edges.' },
  { handle: 'zip-hoodie', title: 'Zip Hoodie', price: 14500, gender: 'men', type: 'Hoodies & Jackets', colours: ['Charcoal'], released: '2026-04-21', feature: 'Embroidered', fit: 'Oversized', desc: 'Full zip, brushed fleece, ribbed hem.' },
  { handle: 'pique-polo', title: 'Piqué Polo', price: 7500, gender: 'men', type: 'Polos', colours: ['Black', 'Off-white'], released: '2026-07-02', feature: 'Embroidered', fit: 'Regular', desc: 'Cotton piqué, two-button placket.' },
  { handle: 'knit-polo', title: 'Knit Polo', price: 9500, gender: 'men', type: 'Polos', colours: ['Charcoal'], soldOut: true, released: '2026-04-08', feature: 'Embroidered', fit: 'Regular', desc: 'Fine-gauge knit, open collar.' },
  { handle: 'mesh-tank', title: 'Mesh Tank', price: 4500, gender: 'men', type: 'Tanks', colours: ['Black', 'Charcoal'], isNew: true, released: '2026-09-22', feature: 'Printed', fit: 'Boxy', desc: 'Open mesh tank, dropped armhole, printed chest logo.' },
  { handle: 'sweat-short', title: 'Sweat Short', price: 6900, gender: 'men', type: 'Shorts', colours: ['Black', 'Charcoal'], released: '2026-06-05', feature: 'Embroidered', fit: 'Regular', desc: 'Brushed fleece short, 7-inch inseam, side pockets.' },
  { handle: 'mesh-short', title: 'Mesh Short', price: 7400, gender: 'men', type: 'Shorts', colours: ['Charcoal'], soldOut: true, released: '2026-05-20', feature: 'Printed', fit: 'Relaxed', desc: 'Double-layer mesh short, printed side stripe.' },
  { handle: 'fleece-jogger', title: 'Fleece Jogger', price: 11500, gender: 'men', type: 'Jeans & Joggers', colours: ['Black', 'Charcoal'], isNew: true, released: '2026-10-01', feature: 'Embroidered', fit: 'Relaxed', desc: 'Heavy brushed fleece jogger, tapered leg, ribbed cuff.' },
  { handle: 'straight-jean', title: 'Straight Jean', price: 13900, gender: 'men', type: 'Jeans & Joggers', colours: ['Black'], released: '2026-08-10', feature: 'Embroidered', fit: 'Regular', desc: '14oz rigid denim, straight leg, embroidered back pocket.' },
  { handle: 'boxer-brief-3-pack', title: 'Boxer Brief 3-Pack', price: 5400, gender: 'men', type: 'Underwear', colours: ['Black', 'Charcoal'], released: '2026-04-15', feature: 'Printed', fit: 'Regular', desc: 'Cotton-modal boxer briefs with a printed waistband. Three pairs.' },

  // ---- womens apparel ----
  { handle: 'baby-tee', title: 'Baby Tee', price: 4900, gender: 'women', type: 'Tees', colours: ['Black', 'Off-white'], isNew: true, released: '2026-09-08', feature: 'Printed', fit: 'Regular', desc: 'Close fit, cut high.' },
  { handle: 'rib-crop-top', title: 'Rib Crop Top', price: 4500, gender: 'women', type: 'Crop Tops', colours: ['Black', 'Off-white'], isNew: true, released: '2026-08-27', feature: 'Embroidered', fit: 'Regular', desc: 'Stretch rib, cropped length.' },
  { handle: 'cropped-hoodie', title: 'Cropped Hoodie', price: 12500, gender: 'women', type: 'Hoodies & Jackets', colours: ['Charcoal', 'Black'], released: '2026-07-30', feature: 'Printed', fit: 'Oversized', desc: 'Boxy, cropped, brushed fleece.' },
  { handle: 'fitted-tee', title: 'Fitted Tee', price: 5400, gender: 'women', type: 'Tees', colours: ['Charcoal'], released: '2026-03-26', feature: 'Printed', fit: 'Regular', desc: 'Slim through the body.' },
  { handle: 'boxy-crop-tee', title: 'Boxy Crop Tee', price: 5200, gender: 'women', type: 'Crop Tops', colours: ['Charcoal', 'Off-white'], released: '2026-03-14', feature: 'Printed', fit: 'Boxy', desc: 'Wide and cropped.' },
  { handle: 'long-sleeve-baby-tee', title: 'Long Sleeve Baby Tee', price: 5900, gender: 'women', type: 'Tees', colours: ['Black'], released: '2026-03-03', feature: 'Embroidered', fit: 'Regular', desc: 'Close fit, long sleeve.' },
  { handle: 'fitted-zip-hoodie', title: 'Fitted Zip Hoodie', price: 13900, gender: 'women', type: 'Hoodies & Jackets', colours: ['Off-white'], released: '2026-02-18', feature: 'Embroidered', fit: 'Regular', desc: 'Slim fit, full zip.' },
  { handle: 'tank-crop', title: 'Tank Crop', price: 3900, gender: 'women', type: 'Crop Tops', colours: ['Black'], soldOut: true, released: '2026-02-05', feature: 'Printed', fit: 'Regular', desc: 'Sleeveless, cropped.' },
  { handle: 'cropped-polo', title: 'Cropped Polo', price: 6900, gender: 'women', type: 'Polos', colours: ['Off-white', 'Black'], released: '2026-07-22', feature: 'Embroidered', fit: 'Regular', desc: 'Cotton piqué polo, cropped, embroidered chest logo.' },
  { handle: 'fitted-tank', title: 'Fitted Tank', price: 4200, gender: 'women', type: 'Tanks', colours: ['Black', 'Off-white', 'Charcoal'], isNew: true, released: '2026-09-18', feature: 'Embroidered', fit: 'Regular', desc: 'Stretch rib tank, close fit, embroidered hem tab.' },
  { handle: 'bike-short', title: 'Bike Short', price: 5200, gender: 'women', type: 'Shorts', colours: ['Black', 'Charcoal'], released: '2026-06-25', feature: 'Printed', fit: 'Regular', desc: 'High-rise stretch bike short, printed side logo.' },
  { handle: 'slim-jogger', title: 'Slim Jogger', price: 10500, gender: 'women', type: 'Jeans & Joggers', colours: ['Charcoal', 'Black'], released: '2026-07-14', feature: 'Embroidered', fit: 'Regular', desc: 'Brushed fleece jogger, slim leg, ribbed cuff.' },
  { handle: 'baggy-jean', title: 'Baggy Jean', price: 13500, gender: 'women', type: 'Jeans & Joggers', colours: ['Black'], isNew: true, released: '2026-09-30', feature: 'Embroidered', fit: 'Oversized', desc: '13oz denim, low rise, wide baggy leg.' },
  { handle: 'mini-skirt', title: 'Mini Skirt', price: 7900, gender: 'women', type: 'Skirts', colours: ['Black', 'Charcoal'], released: '2026-08-18', feature: 'Embroidered', fit: 'Regular', desc: 'Heavy twill mini skirt, low rise, embroidered pocket.' },
  { handle: 'pleated-skirt', title: 'Pleated Skirt', price: 8900, gender: 'women', type: 'Skirts', colours: ['Black'], released: '2026-05-08', feature: 'Printed', fit: 'Regular', desc: 'Knife-pleat skirt, printed waistband tape.' },
  { handle: 'soft-bra', title: 'Soft Bra', price: 4400, gender: 'women', type: 'Underwear', colours: ['Black', 'Off-white'], released: '2026-04-28', feature: 'Printed', fit: 'Regular', desc: 'Wire-free rib bra with a printed underband.' },
  { handle: 'rib-brief-3-pack', title: 'Rib Brief 3-Pack', price: 4900, gender: 'women', type: 'Underwear', colours: ['Black', 'Charcoal'], released: '2026-04-10', feature: 'Printed', fit: 'Regular', desc: 'Stretch rib briefs with a printed waistband. Three pairs.' },

  // ---- sportswear: its own department, not split by gender ----
  { handle: 'training-tee', title: 'Training Tee', price: 5900, gender: 'all', dept: 'sportswear', type: 'Tops', colours: ['Black', 'Charcoal'], isNew: true, released: '2026-10-08', feature: 'Printed', fit: 'Regular', desc: 'Quick-dry training tee, printed reflective logo.' },
  { handle: 'training-tank', title: 'Training Tank', price: 4900, gender: 'all', dept: 'sportswear', type: 'Tops', colours: ['Black', 'Off-white'], released: '2026-09-12', feature: 'Printed', fit: 'Regular', desc: 'Quick-dry tank, racer back, printed logo.' },
  { handle: 'zip-training-jacket', title: 'Zip Training Jacket', price: 12900, gender: 'all', dept: 'sportswear', type: 'Tops', colours: ['Black', 'Charcoal'], released: '2026-08-02', feature: 'Embroidered', fit: 'Regular', desc: 'Lightweight stretch jacket, full zip, embroidered chest logo.' },
  { handle: 'track-short', title: 'Track Short', price: 6400, gender: 'all', dept: 'sportswear', type: 'Shorts', colours: ['Black'], released: '2026-08-30', feature: 'Printed', fit: 'Relaxed', desc: 'Lightweight track short, inner brief, printed stripe.' },
  { handle: 'running-short', title: 'Running Short', price: 5900, gender: 'all', dept: 'sportswear', type: 'Shorts', colours: ['Black', 'Charcoal'], isNew: true, released: '2026-10-05', feature: 'Printed', fit: 'Regular', desc: '5-inch running short, split hem, printed side logo.' },
  { handle: 'training-legging', title: 'Training Legging', price: 8900, gender: 'all', dept: 'sportswear', type: 'Leggings', colours: ['Black', 'Charcoal'], released: '2026-07-18', feature: 'Printed', fit: 'Regular', desc: 'High-rise 7/8 legging, printed waistband logo.' },
  { handle: 'compression-legging', title: 'Compression Legging', price: 9900, gender: 'all', dept: 'sportswear', type: 'Leggings', colours: ['Black'], soldOut: true, released: '2026-06-01', feature: 'Printed', fit: 'Regular', desc: 'Full-length compression legging, flat seams, printed calf logo.' },

  // ---- accessories: full product pages, no fit filter ----
  {
    handle: 'six-panel-cap', title: 'Six-Panel Cap', price: 4900, gender: 'all', dept: 'accessories', type: 'Caps & Hats', sku: 'SZ-CAP-001',
    colours: ['Black', 'Off-white'], sizes: ['One size'], released: '2026-06-10', feature: 'Embroidered',
    stock: { Black: { 'One size': 14 }, 'Off-white': { 'One size': 6 } },
    desc: 'Unstructured six-panel cap. Low profile, curved brim, tonal stitching.',
    fitNote: 'Fits most heads; the strap adjusts.', sizeNote: 'One size — adjustable strap at the back.',
    details: '[Fabric and closure.] Six panels, tonal eyelets, embroidered logo.', care: 'Spot clean only.',
    sizeGuide: { men: { head: ['Size', 'Head (cm)', 'Adjusts'], rows: [['One size', '55–60', 'Strap']] } }, sizeGuideNote: 'Head circumference.'
  },
  {
    handle: 'washed-dad-cap', title: 'Washed Dad Cap', price: 4500, gender: 'all', dept: 'accessories', type: 'Caps & Hats', sku: 'SZ-CAP-002',
    colours: ['Charcoal', 'Off-white'], sizes: ['One size'], released: '2026-09-02', feature: 'Embroidered',
    stock: { Charcoal: { 'One size': 9 }, 'Off-white': { 'One size': 0 } },
    desc: 'Garment-washed cotton twill. Low crown, pre-curved brim, embroidered logo.',
    fitNote: 'Fits most heads; the buckle adjusts.', sizeNote: 'One size — brass buckle adjuster.',
    details: '[Fabric and closure.] Six panels, brass buckle, embroidered front.', care: 'Spot clean only.',
    sizeGuide: { men: { head: ['Size', 'Head (cm)', 'Adjusts'], rows: [['One size', '54–60', 'Buckle']] } }, sizeGuideNote: 'Head circumference.'
  },
  {
    handle: 'rib-beanie', title: 'Rib Beanie', price: 3900, gender: 'all', dept: 'accessories', type: 'Caps & Hats', sku: 'SZ-HAT-001',
    colours: ['Black', 'Charcoal'], sizes: ['One size'], isNew: true, released: '2026-10-12', feature: 'Embroidered',
    stock: { Black: { 'One size': 11 }, Charcoal: { 'One size': 7 } },
    desc: 'Chunky rib knit with a turned-up cuff and a small embroidered tab.',
    fitNote: 'Stretches to fit; wear it slouched or cuffed.', sizeNote: 'One size — stretch rib knit.',
    details: '[Yarn and weight.] Turned-up cuff, embroidered tab.', care: 'Hand wash cold. Dry flat.',
    sizeGuide: { men: { head: ['Size', 'Head (cm)', 'Depth (cm)'], rows: [['One size', '54–61', '23']] } }, sizeGuideNote: 'Head circumference.'
  },
  {
    handle: 'box-chain-necklace', title: 'Box Chain Necklace', price: 6500, gender: 'all', dept: 'accessories', type: 'Chains & Jewellery', sku: 'SZ-JWL-001',
    colours: ['Silver', 'Gunmetal'], sizes: ['One size'], isNew: true, released: '2026-10-02',
    stock: { Silver: { 'One size': 8 }, Gunmetal: { 'One size': 4 } },
    desc: 'Stainless steel box chain. Sits just below the collarbone.',
    fitNote: '50cm. Sits just below the collarbone.', sizeNote: 'One size — 50cm chain with a lobster clasp.',
    details: '[Metal, plating and width.] Lobster clasp, maker’s tag.', care: 'Keep dry. Wipe with a soft cloth.',
    sizeGuide: { men: { head: ['Length', 'Sits'], rows: [['50 cm', 'Just below the collarbone']] } }, sizeGuideNote: 'Chain length, clasp to clasp.'
  },
  {
    handle: 'curb-chain-bracelet', title: 'Curb Chain Bracelet', price: 4900, gender: 'all', dept: 'accessories', type: 'Chains & Jewellery', sku: 'SZ-JWL-002',
    colours: ['Silver', 'Gunmetal'], sizes: ['Adjustable'], released: '2026-09-20',
    stock: { Silver: { Adjustable: 10 }, Gunmetal: { Adjustable: 3 } },
    desc: 'Flat curb links with an extender chain, so one size fits most wrists.',
    fitNote: 'Adjusts from 17cm to 21cm.', sizeNote: 'Adjustable — 17cm to 21cm with an extender.',
    details: '[Metal, plating and width.] Lobster clasp, 4cm extender.', care: 'Keep dry. Wipe with a soft cloth.',
    sizeGuide: { men: { head: ['Size', 'Wrist (cm)'], rows: [['Adjustable', '17–21']] } }, sizeGuideNote: 'Wrist circumference.'
  },
  {
    handle: 'signet-ring', title: 'Signet Ring', price: 5500, gender: 'all', dept: 'accessories', type: 'Chains & Jewellery', sku: 'SZ-JWL-003',
    colours: ['Silver'], sizes: ['Adjustable'], released: '2026-08-05',
    stock: { Silver: { Adjustable: 12 } },
    desc: 'Flat-top signet on an open band. Bend gently to size.',
    fitNote: 'Adjusts from about UK size N to T.', sizeNote: 'Adjustable — the open band fits most fingers.',
    details: '[Metal and finish.] Flat polished face, open band.', care: 'Keep dry. Wipe with a soft cloth.',
    sizeGuide: { men: { head: ['Size', 'UK', 'Inside (mm)'], rows: [['Adjustable', 'N–T', '17–19']] } }, sizeGuideNote: 'Approximate fit range.'
  },
  {
    handle: 'crew-sock-3-pack', title: 'Crew Sock 3-Pack', price: 2900, gender: 'all', dept: 'accessories', type: 'Socks', sku: 'SZ-SCK-001',
    colours: ['Black', 'Off-white'], sizes: SOCK, released: '2026-05-15', feature: 'Embroidered',
    stock: { Black: { 'UK 3–6': 8, 'UK 6–9': 14, 'UK 9–12': 0 }, 'Off-white': { 'UK 3–6': 5, 'UK 6–9': 9, 'UK 9–12': 6 } },
    desc: 'Cushioned cotton crew socks with an embroidered logo. Three pairs.',
    fitNote: 'Take your shoe size.',
    details: '[Yarn blend.] Cushioned sole, ribbed cuff, embroidered logo.', care: 'Machine wash warm. Tumble dry low.',
    sizeGuide: SOCK_GUIDE, sizeGuideNote: 'Shoe sizes.'
  },
  {
    handle: 'ribbed-sport-sock', title: 'Ribbed Sport Sock', price: 1500, gender: 'all', dept: 'accessories', type: 'Socks', sku: 'SZ-SCK-002',
    colours: ['Off-white', 'Charcoal'], sizes: SOCK, released: '2026-07-08', feature: 'Printed',
    stock: { 'Off-white': { 'UK 3–6': 6, 'UK 6–9': 0, 'UK 9–12': 4 }, Charcoal: { 'UK 3–6': 3, 'UK 6–9': 7, 'UK 9–12': 5 } },
    desc: 'Ribbed leg, cushioned sole and a printed stripe at the cuff.',
    fitNote: 'Take your shoe size.',
    details: '[Yarn blend.] Ribbed leg, cushioned sole, printed stripe.', care: 'Machine wash warm. Tumble dry low.',
    sizeGuide: SOCK_GUIDE, sizeGuideNote: 'Shoe sizes.'
  },
  {
    handle: 'logo-ankle-sock-2-pack', title: 'Logo Ankle Sock 2-Pack', price: 1900, gender: 'all', dept: 'accessories', type: 'Socks', sku: 'SZ-SCK-003',
    colours: ['Black'], sizes: SOCK, released: '2026-08-22', feature: 'Printed',
    stock: { Black: { 'UK 3–6': 7, 'UK 6–9': 10, 'UK 9–12': 2 } },
    desc: 'Low-cut ankle socks with a printed logo. Two pairs.',
    fitNote: 'Take your shoe size.',
    details: '[Yarn blend.] Low cut, printed logo, heel tab.', care: 'Machine wash warm. Tumble dry low.',
    sizeGuide: SOCK_GUIDE, sizeGuideNote: 'Shoe sizes.'
  }
];

// "Pairs with" on each product page — linked in a later step, once the products have IDs.
export const pairs = {
  'heavyweight-tee': ['wide-pant', 'heavyweight-hoodie', 'twill-overshirt', 'six-panel-cap'],
  'wide-pant': ['heavyweight-tee', 'heavyweight-hoodie', 'six-panel-cap', 'twill-overshirt'],
  'heavyweight-hoodie': ['wide-pant', 'heavyweight-tee', 'six-panel-cap', 'twill-overshirt'],
  'twill-overshirt': ['heavyweight-tee', 'wide-pant', 'heavyweight-hoodie', 'six-panel-cap'],
  'six-panel-cap': ['washed-dad-cap', 'rib-beanie', 'heavyweight-tee', 'heavyweight-hoodie'],
  'washed-dad-cap': ['six-panel-cap', 'rib-beanie', 'crew-sock-3-pack', 'heavyweight-tee'],
  'rib-beanie': ['six-panel-cap', 'heavyweight-hoodie', 'crew-sock-3-pack', 'box-chain-necklace'],
  'box-chain-necklace': ['curb-chain-bracelet', 'signet-ring', 'heavyweight-tee', 'twill-overshirt'],
  'curb-chain-bracelet': ['box-chain-necklace', 'signet-ring', 'heavyweight-tee', 'twill-overshirt'],
  'signet-ring': ['box-chain-necklace', 'curb-chain-bracelet', 'twill-overshirt', 'heavyweight-tee'],
  'crew-sock-3-pack': ['ribbed-sport-sock', 'logo-ankle-sock-2-pack', 'wide-pant', 'six-panel-cap'],
  'ribbed-sport-sock': ['crew-sock-3-pack', 'logo-ankle-sock-2-pack', 'wide-pant', 'heavyweight-tee'],
  'logo-ankle-sock-2-pack': ['crew-sock-3-pack', 'ribbed-sport-sock', 'six-panel-cap', 'heavyweight-tee']
};
