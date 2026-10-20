import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-espresso px-6 text-center grain">
      <div className="flex flex-col items-center gap-8">
        <Logo className="w-40 text-sand" />
        <p className="font-display text-[9rem] leading-none text-cream/90">404</p>
        <p className="max-w-sm text-cream/65">This cup is empty. The page you&apos;re looking for doesn&apos;t exist.</p>
        <ButtonLink href="/">Back to Caprea</ButtonLink>
      </div>
    </main>
  );
}
