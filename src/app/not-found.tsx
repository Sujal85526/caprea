import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <Logo className="w-32 text-espresso" />
        <p className="font-display text-8xl leading-none text-espresso">404</p>
        <p className="max-w-sm text-muted-foreground">This cup is empty. The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/">Back to Caprea</Link>
        </Button>
      </div>
    </main>
  );
}
