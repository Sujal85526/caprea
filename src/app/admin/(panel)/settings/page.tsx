import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader, PageSkeleton } from "@/components/admin/ui";
import { getSettings } from "../../_lib/data";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Business"
        title="Settings"
        description="Deposit, service hours, contact details and the booking terms customers agree to."
      />
      <Suspense fallback={<PageSkeleton rows={3} />}>
        <SettingsLoader />
      </Suspense>
    </>
  );
}

async function SettingsLoader() {
  return <SettingsForm settings={await getSettings()} />;
}
