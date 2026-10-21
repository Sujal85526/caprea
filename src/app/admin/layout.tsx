import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Caprea Admin" },
  robots: { index: false, follow: false },
};

// The admin panel keeps its dark espresso theme; the public site is light.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-espresso-900 text-cream [color-scheme:dark]">{children}</div>;
}
