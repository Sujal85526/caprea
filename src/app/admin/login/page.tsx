import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/auth-card";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to manage bookings, menu and pricing.">
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
