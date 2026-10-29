import { Footer } from "@/components/site/footer";
import { Loader } from "@/components/site/loader";
import { Navbar } from "@/components/site/navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-cream">
      <Loader />
      <Navbar />
      <main className="overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
