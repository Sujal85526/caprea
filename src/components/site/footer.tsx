import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { EnvelopeSimple, InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/logo";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";

export async function Footer() {
  "use cache";
  cacheLife("days");
  cacheTag(CATALOG_TAG);
  const { settings } = await getCatalog();

  const contact = [
    { href: `tel:${settings.phone.replace(/\s/g, "")}`, label: settings.phone, Icon: Phone },
    { href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp", Icon: WhatsappLogo },
    { href: `mailto:${settings.email}`, label: settings.email, Icon: EnvelopeSimple },
    { href: `https://instagram.com/${settings.instagram}`, label: `@${settings.instagram}`, Icon: InstagramLogo },
  ];

  return (
    <footer id="contact" className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-10 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo className="w-36 text-sand" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              Specialty coffee and matcha catering from Abu Dhabi. Our cart, barista and signature drinks at your event.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5 text-sand">Contact</p>
            <ul className="space-y-3 text-sm">
              {contact.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-cream/75 transition-colors hover:text-cream"
                  >
                    <Icon className="size-4 text-sand" weight="light" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-sand">Explore</p>
            <ul className="space-y-3 text-sm">
              {[
                ["/packages", "Catering packages"],
                ["/menu", "Menu"],
                ["/book", "Book an event"],
                ["/book?mode=custom", "Custom request"],
                ["/packages#terms", "Booking terms"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-cream/75 transition-colors hover:text-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Caprea · Abu Dhabi, UAE</p>
          <p>Specialty coffee · Matcha · Signature drinks</p>
        </div>
      </div>
    </footer>
  );
}
