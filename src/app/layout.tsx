import type { Metadata, Viewport } from "next";
import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

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
  themeColor: "#361F18",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gaqire.variable} ${josefin.variable} antialiased`}>
      <body className="min-h-dvh">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#24140f",
              color: "#f6efe6",
              border: "1px solid rgba(210,184,158,.25)",
              fontFamily: "var(--font-josefin)",
            },
          }}
        />
      </body>
    </html>
  );
}
