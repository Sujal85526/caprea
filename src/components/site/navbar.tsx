import { cacheLife, cacheTag } from "next/cache";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  "use cache";
  cacheLife("days");
  cacheTag(CATALOG_TAG);
  const { settings } = await getCatalog();
  return <NavbarClient whatsapp={settings.whatsapp} instagram={settings.instagram} />;
}
