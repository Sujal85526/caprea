import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
