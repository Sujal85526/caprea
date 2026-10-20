# Caprea — catering booking website · project brief

Caprea is a specialty café in Abu Dhabi (coffee, matcha, smoothies, desserts) that runs a mobile cart at events.
The site lets a customer pick a catering package, customise it and book it. The competitor reference is
[twoblends.ae/catering](https://www.twoblends.ae/catering); Caprea needs the same kind of business flow with its own,
more polished look.

- Site: caprea.ae · Instagram @caprea.ae · Phone +971 52 225 0022 · Email info@capreacafe.com
- Stack: Next.js on Vercel, Supabase (Postgres, Auth, Storage), GSAP for animation.

## Brand

| Token | Value | Note |
| --- | --- | --- |
| Brown | `#361F18` | Swatch image; the chat said `#361C12` |
| Beige | `#D2B89E` | Swatch image; the chat said `#D2B495` |
| Headings | Gaqire (`Gaqire.otf`) | Menu headings, wordmark style |
| Body | Josefin Sans | Google Fonts |

Visual language from the PDFs: dark-brown backgrounds, beige type, oversized faint "CAPREA" letterforms behind the
content, rounded beige cards.

## Customer flows

1. **Ready-made package → pay and confirm.** The customer picks a package, chooses its drinks, add-ons, date, location
   and extras, and sees the live total. For now the booking is created as confirmed (payment comes later; the terms ask
   for a 50% non-refundable deposit).
2. **Custom request → admin.** The customer builds their own selection; it goes to the admin as a request, the admin
   quotes or edits it, then confirms.

## Admin

- See and manage bookings and custom requests (status, quote, notes).
- Edit packages, menu items, prices, add-ons, transport fees and extra services.

## Catering packages (from "Caprea Catering Packages.pdf"; the client says prices will change slightly)

| Guests | Signature drinks | Cups each | Price (AED) |
| --- | --- | --- | --- |
| 30 | up to 3 | 5 | 1,200 |
| 60 | up to 5 | 6 | 1,900 |
| 100 | up to 6 | 9 | 2,800 |
| 200 | up to 6 | 15 | 4,600 |
| 300 | up to 6 | 25 | 6,500 |

Remaining servings come from the coffee selection. All packages include Caprea's cart, 1 barista and 1 waiter, and
4 hours of service.

- Signature drinks: Matcha Latte, Velvet Sunset Refresher, Peach Iced Tea, Cloud Nine Smoothie, Golden Hour Smoothie,
  Acai Smoothie
- Coffee selection: Americano, Flat White, Cortado, Latte, Spanish Latte, V60
- Add-ons (minimum 10 each): 24K Strawberries 20, Krispy Treat 20, Cookies 22 each, Coconut 25
- Transport: Abu Dhabi 180; Al Ain, Dubai, Sharjah, Ajman 500
- Extras: Customised cups 250, Customised corner 200, Additional hour 150, Extra cups on request

Booking terms: 50% non-refundable deposit confirms the date; balance due 24 h before; 4 h on site including setup and
pack-down; client provides a power outlet and a washing area with running water; extra cups must be agreed and paid
before service; changes at least 72 h before.

The client is still deciding on the package model. Two Blends prices by cup count with one shared menu; Caprea lets the
customer choose and customise drinks. The data model should support both.

## Full menu (latest prices, "The Oasis Edition" PDF)

Matcha: Salted Vanilla 39, Milky 35, Cloudy 35, Strawberry 35 · Smoothies/refreshers: Berry Obsessed 32,
Golden Hour 32, Cloud Nine 32, Acai 40, Velvet Sunset 30, Peach Iced Tea 30 · Coffee: Salted Caramel Latte 30,
Spanish Latte 30, V60 30, Americano 30, Dirty Espresso 28, Cortado 25 · Desserts: Milk Choc / Biscoff / White Choc /
S'mores cookies 25, Caprea Coconut 25, Aseeda Bites (3) 20, Banana Pudding 20. Gathering boxes: Matcha 170–190,
Spanish Latte 150–180, V60 130–180 (prices differ between PDFs; confirm with the client).

## Photo assets (`~/Downloads/Photos` + `~/Downloads/Photos 2`, 539 JPGs, 7008×4672, ~2.1 GB)

The photos are camera burst sequences shot on a grey studio background. They suit scroll-scrubbed frame animations.
File numbers are `A74023xx`–`A74028xx`; Photos 2 fills gaps in the same sequence.

| Range | Content |
| --- | --- |
| 2328–2402 | Iced americano and berry drinks on a wooden coaster, hand-held, overhead ice shots |
| 2403–2418 | Iced latte, milk-foam pour |
| 2419–2469 | Acai, Golden Hour and Cloud Nine smoothies; three cups overhead; layered drinks on the coaster |
| 2470–2482 | Caprea coconut held in hand |
| 2483–2515 | Cookies: s'mores, white chocolate, Biscoff, stacks and rows |
| 2516–2531 | Barista in Caprea tee/apron holding branded paper cups |
| 2532–2603 | V60 pour from carafe into a branded paper cup (long sequence, good for a hero scrub) |
| 2604–2633 | Hot/iced coffee in paper cup, overhead latte art, iced latte milk pour, Krispy Treat close-up |
| 2634–2680 | Matcha poured from a pink bowl into milk (strong hero sequence) |
| 2681–2714 | Matcha cup splash and spill |
| 2715–2749 | Strawberry cream poured over matcha (Strawberry Matcha) |
| 2750–2812 | Water then thick matcha poured, spoon drip (Cloudy Matcha) |
| 2813–2868 | Whisk, pink bowl, matcha foam macro |

Other files: `Caprea Logo.pdf` (wordmark), `Bag (38).pdf` (packaging), `Menu (13).pdf` (background art),
`Abu Dhabi, UAE.pdf` (brand deck with the full café menu).
