import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { EnvelopeSimple, InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/logo";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";

/** Espresso footer: big wordmark and contact blocks on the left, two link columns on the right. */
export async function Footer() {
  "use cache";
  cacheLife("days");
  cacheTag(CATALOG_TAG);
  const { settings } = await getCatalog();

  const wa = `https://wa.me/${settings.whatsapp}`;
  const ig = `https://instagram.com/${settings.instagram}`;
  const tel = `tel:${settings.phone.replace(/\s/g, "")}`;
  const mail = `mailto:${settings.email}`;

  const social = [
    { href: wa, label: "WhatsApp", Icon: WhatsappLogo },
    { href: ig, label: "Instagram", Icon: InstagramLogo },
    { href: tel, label: "Call us", Icon: Phone },
    { href: mail, label: "Email", Icon: EnvelopeSimple },
  ];

  const columns: { title: string; links: [string, string][] }[] = [
    {
      title: "The experience",
      links: [
        ["/packages", "Packages"],
        ["/menu", "Menu"],
        ["/book", "Book your event"],
        ["/book?mode=custom", "Custom request"],
      ],
    },
    {
      title: "Explore",
      links: [
        [ig, "Instagram"],
        [wa, "WhatsApp"],
        ["/packages#terms", "Booking terms"],
        [tel, "Call us"],
        [mail, "Contact"],
      ],
    },
  ];

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-cream/5 bg-espresso px-4 pt-16 pb-5 text-cream sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:gap-10">
          <div className="max-w-md">
            <Link href="/" aria-label="Caprea home" className="inline-block">
              <Logo className="w-[min(70vw,22rem)] text-cream" />
            </Link>
            <p className="mt-7 leading-relaxed text-cream/80">
              Specialty coffee &amp; matcha catering. Our cart, a barista and our signature drinks, poured at your event.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-cream/10 pt-6">
              <div>
                <p className="display text-[0.7rem] tracking-[0.06em]">Abu Dhabi · Café</p>
                <p className="mt-2 text-xs leading-relaxed text-cream/60">Catering across the UAE</p>
                <a href={tel} className="mt-1 block text-xs text-cream/60 hover:text-cream">
                  {settings.phone}
                </a>
              </div>
              <div>
                <p className="display text-[0.7rem] tracking-[0.06em]">Bookings</p>
                <p className="mt-2 text-xs leading-relaxed text-cream/60">{settings.min_notice_days} days&apos; notice</p>
                <a href={mail} className="mt-1 block text-xs break-all text-cream/60 hover:text-cream">
                  {settings.email}
                </a>
              </div>
            </div>

            <ul className="mt-8 flex gap-3">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="grid size-11 place-items-center rounded-full border border-cream/20 transition-colors hover:border-cream hover:bg-cream hover:text-espresso"
                  >
                    <Icon className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="display text-sm tracking-[0.12em]">{c.title}</p>
                <ul className="mt-5 space-y-1">
                  {c.links.map(([href, label]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        className="inline-flex min-h-9 items-center text-[0.95rem] text-cream/70 transition-colors hover:text-cream"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="label-caps mt-16 border-t border-cream/10 pt-6 text-center text-[0.68rem] tracking-[0.08em] sm:mt-20">
          © {new Date().getFullYear()} Caprea. Poured in Abu Dhabi.
        </p>
      </div>
    </footer>
  );
}
