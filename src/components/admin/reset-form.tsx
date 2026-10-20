"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PendingBtn, Spinner } from "./client";
import { Field, btnCls, inputCls } from "./ui";

export function ResetForm() {
  const router = useRouter();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    // The browser client exchanges the ?code= (or #access_token) from the recovery link on init.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled && session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) setReady("ok");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setReady(data.session ? "ok" : "invalid");
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    start(async () => {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      toast.success("Password updated");
      router.replace("/admin");
      router.refresh();
    });
  };

  if (ready === "checking")
    return (
      <div className="flex items-center gap-3 text-sm text-cream/60">
        <Spinner /> Checking your reset link…
      </div>
    );

  if (ready === "invalid")
    return (
      <div className="space-y-5">
        <p className="text-sm text-cream/70">
          This reset link is invalid or has expired. Request a new one from the sign-in page and open it on this device.
        </p>
        <Link href="/admin/login" className={btnCls("primary", "md", "w-full py-3")}>
          Back to sign in
        </Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="New password" hint="At least 8 characters.">
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Field label="Confirm password">
        <input
          type="password"
          required
          autoComplete="new-password"
          className={inputCls}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </Field>
      {error && (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
      <PendingBtn type="submit" pending={pending} className="w-full py-3">
        Save password
      </PendingBtn>
    </form>
  );
}
