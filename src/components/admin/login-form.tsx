"use client";

import { ArrowLeft, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PendingBtn } from "./client";
import { Field, inputCls } from "./ui";

const safeNext = (next: string | null) =>
  next && next.startsWith("/admin") && !next.startsWith("/admin/login") && !next.startsWith("//") ? next : "/admin";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  // Arriving with ?error=forbidden: the session belongs to a non-admin; sign it out.
  const forbidden = params.get("error") === "forbidden";
  useEffect(() => {
    if (forbidden) void createClient().auth.signOut();
  }, [forbidden]);

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
        return;
      }
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin !== true) {
        await supabase.auth.signOut();
        setError("This account is not authorised to use the admin panel.");
        return;
      }
      toast.success("Signed in");
      router.replace(next);
      router.refresh();
    });
  };

  const sendReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/login/reset`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    });
  };

  if (mode === "forgot") {
    return (
      <form onSubmit={sendReset} className="space-y-5">
        {sent ? (
          <div className="rounded-2xl border border-matcha/30 bg-matcha/10 p-4 text-sm text-cream/85">
            <Mail className="mb-2 h-5 w-5 text-matcha" />
            If <strong>{email}</strong> belongs to an admin, a reset link is on its way. Open it on this device to set a
            new password.
          </div>
        ) : (
          <>
            <p className="text-sm text-cream/65">Enter your email and we&apos;ll send you a link to set a new password.</p>
            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                autoFocus
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}
            <PendingBtn type="submit" pending={pending} className="w-full py-3">
              Send reset link
            </PendingBtn>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setSent(false);
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm text-sand hover:text-cream"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={signIn} className="space-y-5">
      {forbidden && !error && (
        <p className="rounded-xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
          That account is not authorised to use the admin panel.
        </p>
      )}
      <Field label="Email">
        <input
          type="email"
          required
          autoComplete="username"
          autoFocus
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          required
          autoComplete="current-password"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {error && (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
      <PendingBtn type="submit" pending={pending} className="w-full py-3">
        Sign in
      </PendingBtn>
      <button
        type="button"
        onClick={() => {
          setMode("forgot");
          setError(null);
        }}
        className="block w-full text-center text-sm text-sand/80 hover:text-cream"
      >
        Forgot your password?
      </button>
    </form>
  );
}
