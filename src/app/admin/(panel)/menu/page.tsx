import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuEditor } from "@/components/admin/menu-editor";
import { PageHeader, PageSkeleton } from "@/components/admin/ui";
import { getMenu } from "../../_lib/data";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Menu"
        description="Drinks and desserts shown on the website, and which of them customers can pick for catering."
      />
      <Suspense fallback={<PageSkeleton rows={6} />}>
        <Menu />
      </Suspense>
    </>
  );
}

async function Menu() {
  return <MenuEditor items={await getMenu()} />;
}
