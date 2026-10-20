// Row shapes for the Supabase tables in supabase/migrations/0001_init.sql.

export type PricingMode = "packages" | "per_cup" | "both";

export type MenuCategory = "signature" | "matcha" | "coffee" | "smoothie" | "refresher" | "dessert" | "box";

export type Settings = {
  pricing_mode: PricingMode;
  deposit_percent: number;
  service_hours: number;
  extra_hour_price: number;
  min_notice_days: number;
  addon_min_qty: number;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  notify_email: string;
  terms: { title: string; body: string }[];
};

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: MenuCategory;
  price: number | null;
  image_url: string | null;
  best_seller: boolean;
  catering_signature: boolean;
  catering_coffee: boolean;
  catering_addon: boolean;
  addon_price: number | null;
  active: boolean;
  sort: number;
};

export type Package = {
  id: string;
  name: string;
  guests: number;
  max_signature_drinks: number;
  cups_per_drink: number;
  price: number;
  includes: string[];
  featured: boolean;
  active: boolean;
  sort: number;
};

export type CupTier = {
  id: string;
  label: string;
  min_cups: number;
  max_cups: number | null;
  price_per_cup: number;
  active: boolean;
  sort: number;
};

export type Region = { id: string; name: string; fee: number; active: boolean; sort: number };

export type ExtraUnit = "flat" | "per_hour" | "on_request";

export type Extra = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  unit: ExtraUnit;
  active: boolean;
  sort: number;
};

export type Catalog = {
  settings: Settings;
  menu: MenuItem[];
  packages: Package[];
  cupTiers: CupTier[];
  regions: Region[];
  extras: Extra[];
};

export type BookingKind = "package" | "per_cup" | "custom";
export type BookingStatus = "pending" | "request" | "quoted" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "deposit_paid" | "paid" | "refunded";

export type BookingLine = { slug: string; name: string; qty: number; unit_price: number | null; unit?: ExtraUnit };
export type BookingDrink = { slug: string; name: string; cups?: number };

export type Booking = {
  id: string;
  ref: string;
  kind: BookingKind;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_date: string;
  start_time: string;
  event_type: string | null;
  guests: number | null;
  region_id: string | null;
  region_name: string | null;
  address: string;
  package_id: string | null;
  package_name: string | null;
  cups: number | null;
  drinks: BookingDrink[];
  addons: BookingLine[];
  extras: BookingLine[];
  extra_hours: number;
  notes: string | null;
  subtotal: number;
  transport_fee: number;
  extras_total: number;
  total: number;
  deposit: number;
  quote_amount: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};
