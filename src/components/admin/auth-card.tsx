import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-espresso-900 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(210,184,158,0.16),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(143,163,106,0.08),transparent_55%)]"
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-sand">
          <Logo className="w-40" />
          <p className="eyebrow mt-3 text-cream/45">Admin panel</p>
        </div>
        <div className="glass rounded-3xl p-7 sm:p-9">
          <h1 className="text-4xl text-cream">{title}</h1>
          <p className="mt-2 text-sm text-cream/60">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </main>
  );
}
