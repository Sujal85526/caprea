import { Footer } from "@/components/site/footer";
import { Loader } from "@/components/site/loader";
import { Navbar } from "@/components/site/navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Loader />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
