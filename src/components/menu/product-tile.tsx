import Image from "next/image";
import { aed } from "@/lib/pricing";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export const CATEGORY_LABEL: Record<MenuCategory, string> = {
  signature: "Signature",
  matcha: "Matcha",
  coffee: "Coffee",
  smoothie: "Smoothie",
  refresher: "Refresher",
  dessert: "Dessert",
  box: "Gathering box",
};

export function Tag({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center border px-2 text-[0.6rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase",
        dark ? "border-espresso bg-espresso text-cream" : "border-espresso/25 text-espresso/75",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Product tile: the drink centred on a soft cream square, then a clean name / price row and small tags.
 * Gathering boxes are photographs, so they fill the square instead.
 */
export function ProductTile({
  item,
  showSignature = true,
  compact,
  sizes,
  className,
}: {
  item: MenuItem;
  /** name, price and category only, for denser rows */
  compact?: boolean;
  /** tag drinks that can be chosen in catering packages */
  showSignature?: boolean;
  sizes?: string;
  className?: string;
}) {
  const photo = item.category === "box";
  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-square overflow-hidden bg-cream">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            unoptimized={item.image_url.startsWith("http")}
            sizes={sizes ?? "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"}
            className={cn(
              "transition-transform duration-1000 ease-(--ease-luxe) group-hover:scale-[1.04]",
              photo ? "object-cover" : "object-contain p-[13%]",
            )}
          />
        )}
        {item.best_seller && (
          <span className="absolute top-3 left-3">
            <Tag dark>Best seller</Tag>
          </span>
        )}
      </div>
      <div className={cn("mt-4 flex flex-col gap-1", !compact && "sm:flex-row sm:items-baseline sm:gap-3")}>
        <h3 className={cn("font-display leading-tight tracking-[0.04em] text-espresso uppercase", compact ? "text-base" : "text-[1.05rem] sm:text-lg")}>{item.name}</h3>
        {item.price != null && (
          <>
            {!compact && <span aria-hidden className="hidden h-px min-w-4 flex-1 translate-y-[-0.2rem] border-b border-dotted border-espresso/30 sm:block" />}
            <p className="text-sm whitespace-nowrap text-espresso/80 tabular-nums">{aed(item.price)}</p>
          </>
        )}
      </div>
      {!compact && item.description && <p className="mt-1.5 text-sm leading-relaxed text-espresso/60">{item.description}</p>}
      <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-2.5" : "mt-3")}>
        <Tag>{CATEGORY_LABEL[item.category]}</Tag>
        {showSignature && item.catering_signature && <Tag>Catering signature</Tag>}
      </div>
    </article>
  );
}
