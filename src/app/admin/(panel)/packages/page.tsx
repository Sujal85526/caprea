import type { Metadata } from "next";
import { Suspense } from "react";
import { PackagesEditor } from "@/components/admin/packages-editor";
import { PageHeader, PageSkeleton } from "@/components/admin/ui";
import { getPackages } from "../../_lib/data";

export const metadata: Metadata = { title: "Packages" };

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Packages"
        description="Guest-tier packages customers choose from when booking. Changes show on the website immediately."
      />
      <Suspense fallback={<PageSkeleton rows={5} />}>
        <Packages />
      </Suspense>
    </>
  );
}

async function Packages() {
  return <PackagesEditor packages={await getPackages()} />;
}
