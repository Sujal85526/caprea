import { Footer } from "@/components/site/footer";
import { Loader } from "@/components/site/loader";
import { Navbar } from "@/components/site/navbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <Loader />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
