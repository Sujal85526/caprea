import type { Metadata, Viewport } from "next";
import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const gaqire = localFont({
  src: "./fonts/Gaqire.otf",
  variable: "--font-gaqire",
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://capreacafe.com"),
  title: {
    default: "Caprea — Specialty Coffee & Matcha Catering, Abu Dhabi",
    template: "%s · Caprea",
  },
  description:
    "Caprea brings its specialty coffee and matcha cart to your celebration. Choose a catering package, customise your menu and book your date across the UAE.",
  openGraph: {
    title: "Caprea — Coffee & Matcha Catering",
    description: "Specialty coffee, matcha and signature drinks served at your event.",
    images: ["/photos/matcha-cup.webp"],
    locale: "en_AE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("antialiased", gaqire.variable, josefin.variable)}>
      <body className="min-h-dvh">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#361f18",
              color: "#fbf8f4",
              border: "none",
              borderRadius: "999px",
              fontFamily: "var(--font-josefin)",
            },
          }}
        />
      </body>
    </html>
  );
}
