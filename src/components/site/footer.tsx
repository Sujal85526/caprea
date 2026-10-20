import Link from "next/link";
import { ArrowUpRight, AtSign, Mail, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cacheLife, cacheTag } from "next/cache";
import { CATALOG_TAG, getCatalog } from "@/lib/catalog";

export async function Footer() {
  "use cache";
  cacheLife("days");
  cacheTag(CATALOG_TAG);
  const { settings } = await getCatalog();

  return (
    <footer id="contact" className="relative overflow-hidden bg-espresso-900 grain">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-10 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-6 text-sand">Let&apos;s pour something special</p>
            <h2 className="max-w-xl font-display text-5xl text-cream uppercase sm:text-7xl">
              Your event, <span className="text-sand">our cart.</span>
            </h2>
            <Link
              href="/book"
              className="group mt-10 inline-flex items-center gap-3 border-b border-sand/40 pb-2 text-sm tracking-[0.25em] text-sand uppercase transition-colors hover:border-sand hover:text-cream"
            >
              Start your booking
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-5 text-sand/70">Contact</p>
              <ul className="space-y-3 text-cream/80">
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-cream">
                    <Phone className="size-4 text-sand" /> {settings.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cream">
                    <MessageCircle className="size-4 text-sand" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-cream">
                    <Mail className="size-4 text-sand" /> {settings.email}
                  </a>
                </li>
                <li>
                  <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cream">
                    <AtSign className="size-4 text-sand" /> @{settings.instagram}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-sand/70">Explore</p>
              <ul className="space-y-3 text-cream/80">
                {[
                  ["/packages", "Catering packages"],
                  ["/menu", "Our menu"],
                  ["/book", "Book an event"],
                  ["/book?mode=custom", "Custom request"],
                  ["/packages#terms", "Booking terms"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-cream">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Logo className="mt-24 w-full text-sand/90" />

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-sand/10 pt-6 text-xs tracking-[0.2em] text-cream/40 uppercase sm:flex-row">
          <p>© {new Date().getFullYear()} Caprea · Abu Dhabi, UAE</p>
          <p>Specialty coffee · Matcha · Signature drinks</p>
        </div>
      </div>
    </footer>
  );
}
