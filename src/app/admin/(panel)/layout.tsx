import { Suspense } from "react";
import { AdminShell, SignOutButton } from "@/components/admin/shell";
import { getAdmin } from "@/lib/admin";

async function UserBadge() {
  const admin = await getAdmin();
  if (!admin) return null;
  return (
    <div className="space-y-2">
      <p className="eyebrow text-[0.6rem] text-cream/40">Signed in as</p>
      <p className="truncate text-sm text-cream/85" title={admin.email}>
        {admin.email}
      </p>
      <SignOutButton className="-ml-3" />
    </div>
  );
}

function UserBadgeFallback() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="h-2.5 w-20 animate-pulse rounded bg-sand/10" />
      <div className="h-4 w-40 animate-pulse rounded bg-sand/10" />
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      user={
        <Suspense fallback={<UserBadgeFallback />}>
          <UserBadge />
        </Suspense>
      }
    >
      {children}
    </AdminShell>
  );
}
