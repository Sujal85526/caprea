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
    { href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp", Icon: WhatsappLogo },
    { href: `tel:${settings.phone.replace(/\s/g, "")}`, label: settings.phone, Icon: Phone },
    { href: `mailto:${settings.email}`, label: settings.email, Icon: EnvelopeSimple },
    { href: `https://instagram.com/${settings.instagram}`, label: `@${settings.instagram}`, Icon: InstagramLogo },
  ];

  const links = [
    ["/packages", "Packages"],
    ["/menu", "Menu"],
    ["/book", "Book"],
    ["/packages#terms", "Terms"],
  ];

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-espresso/10 bg-cream text-espresso">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-32 sm:px-10 lg:pb-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo className="w-32" />
            <p className="mt-4 max-w-xs text-sm text-espresso/60">Specialty coffee &amp; matcha catering, Abu Dhabi.</p>
          </div>

          <ul className="grid gap-x-10 gap-y-1 text-sm sm:grid-cols-2">
            {contact.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 text-espresso/75 transition-colors hover:text-espresso"
                >
                  <Icon className="size-4" weight="light" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-espresso/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <ul className="-mx-2 flex flex-wrap gap-x-2">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-espresso/75 transition-colors hover:text-espresso">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-espresso/45">© {new Date().getFullYear()} Caprea · Abu Dhabi, UAE</p>
        </div>
      </div>
    </footer>
  );
}
