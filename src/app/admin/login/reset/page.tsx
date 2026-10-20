import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/auth-card";
import { ResetForm } from "@/components/admin/reset-form";

export const metadata: Metadata = { title: "Set a new password" };

// Lives under /admin/login so the proxy lets the recovery link through before a session exists.
export default function ResetPasswordPage() {
  return (
    <AuthCard title="New password" subtitle="Choose a new password for your admin account.">
      <ResetForm />
    </AuthCard>
  );
}
