// Shoot photos in public/photos for menu items that have one; others fall back to their cut-out illustration.
const BY_SLUG: Record<string, string> = {
  "acai-smoothie": "/photos/acai.webp",
  "biscoff-cookie": "/photos/biscoff-cookie.webp",
  "caprea-coconut": "/photos/coconut.webp",
  "cloud-nine": "/photos/cloud-nine.webp",
  "cloudy-matcha": "/photos/cloudy-matcha.webp",
  "golden-hour": "/photos/golden-hour.webp",
  "iced-latte": "/photos/iced-latte-pour.webp",
  "krispy-treat": "/photos/krispy-treat.webp",
  "matcha-latte": "/photos/matcha-cup.webp",
  "milk-chocolate-cookie": "/photos/milk-choc-cookie.webp",
  "smores-cookie": "/photos/smores-cookie.webp",
  "strawberry-matcha": "/photos/strawberry-matcha.webp",
  americano: "/photos/iced-americano.webp",
  v60: "/photos/v60-pour.webp",
  "white-chocolate-cookie": "/photos/white-choc-cookie.webp",
};

export const photoFor = (slug: string) => BY_SLUG[slug] ?? null;
