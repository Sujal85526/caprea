import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingEditor } from "@/components/admin/pricing-editor";
import { PageHeader, PageSkeleton } from "@/components/admin/ui";
import { getPricing } from "../../_lib/data";

export const metadata: Metadata = { title: "Pricing & Areas" };

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Pricing & Areas"
        description="How customers book, per-cup prices, delivery areas and optional extras."
      />
      <Suspense fallback={<PageSkeleton rows={4} />}>
        <Pricing />
      </Suspense>
    </>
  );
}

async function Pricing() {
  const data = await getPricing();
  return <PricingEditor {...data} />;
}
