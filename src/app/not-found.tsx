import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div className="flex flex-col items-center">
        <Link href="/" aria-label="Caprea home">
          <Logo className="w-32 text-espresso" />
        </Link>
        <p className="mt-10 text-lg text-espresso/65 italic">Page not found</p>
        <h1 className="display mt-3 text-[clamp(5rem,22vw,11rem)] leading-[0.85] text-espresso">404</h1>
        <p className="mt-6 max-w-sm text-lg leading-relaxed text-espresso/70">This cup is empty. The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="label-caps group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-7 text-[0.72rem] text-cream transition-colors hover:bg-espresso-700"
        >
          Back to Caprea <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
