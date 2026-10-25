import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Logo } from "@/components/ui/logo";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";

export async function Footer() {
  "use cache";
  cacheLife("days");
  cacheTag(CATALOG_TAG);
  const { settings } = await getCatalog();

  const columns = [
    {
      title: "Explore",
      links: [
        { href: "/menu", label: "Menu" },
        { href: "/packages", label: "Catering packages" },
        { href: "/book", label: "Book an event" },
        { href: "/book?mode=custom", label: "Custom request" },
        { href: "/packages#terms", label: "Booking terms" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: `tel:${settings.phone.replace(/\s/g, "")}`, label: settings.phone },
        { href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp" },
        { href: `mailto:${settings.email}`, label: settings.email },
      ],
    },
    {
      title: "Follow",
      links: [{ href: `https://instagram.com/${settings.instagram}`, label: `Instagram @${settings.instagram}` }],
    },
  ];

  return (
    <footer id="contact" className="scroll-mt-20 bg-espresso text-cream">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-t border-cream/15 pt-16 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <p className="max-w-xs text-sm leading-relaxed text-cream/65">
            Specialty coffee and matcha catering from Abu Dhabi. Our cart, barista and signature drinks at your event, anywhere
            in the UAE.
          </p>
          {columns.map((c) => (
            <div key={c.title}>
              <p className="label mb-5 text-sand">{c.title}</p>
              <ul className="space-y-1">
                {c.links.map((l) => {
                  const external = l.href.startsWith("http");
                  const cls = "link-line inline-block py-1.5 text-sm break-all text-cream/80 hover:text-cream";
                  return (
                    <li key={l.href}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={cls}>
                          {l.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Logo className="w-full text-sand" />

        <div className="flex flex-col gap-2 pt-8 pb-10 text-xs tracking-wide text-cream/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Caprea · Abu Dhabi, UAE</p>
          <p>Specialty coffee · Matcha · Signature drinks</p>
        </div>
      </div>
    </footer>
  );
}
