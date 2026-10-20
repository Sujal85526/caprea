import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import type { Booking } from "@/lib/types";

export type AdminSession = {
  email: string;
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
};

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

/**
 * Reads the session and checks the signed-in email is listed in public.admins (via is_admin()).
 * Returns null when signed out, `false` when signed in but not an admin. Cached per request.
 */
export const getAdmin = cache(async (): Promise<AdminSession | null | false> => {
  // Admin pages are always request-time: the auth client checks token expiry with Date.now().
  await connection();
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (error || !data?.claims || !email) return null;
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || isAdmin !== true) return false;
  return { email, supabase };
});

/** For admin pages: redirects signed-out visitors and non-admins to the login page. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (admin === null) redirect("/admin/login");
  if (admin === false) redirect("/admin/login?error=forbidden");
  return admin;
}

/** For server actions: throws instead of redirecting so the client can show a toast. */
export async function assertAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) throw new AdminError("You are not authorised to do this. Please sign in again.");
  return admin;
}

export class AdminError extends Error {}

/** Wraps a server action body: admin check, error capture, consistent result shape. */
export async function runAction<T = void>(
  fn: (admin: AdminSession) => Promise<T | void>,
): Promise<ActionResult<T>> {
  try {
    const admin = await assertAdmin();
    const data = (await fn(admin)) as T | undefined;
    return data === undefined ? { ok: true } : { ok: true, data };
  } catch (e) {
    if (e instanceof AdminError) return { ok: false, error: e.message };
    if (e && typeof e === "object" && "issues" in e) {
      const issues = (e as { issues: { message: string; path: PropertyKey[] }[] }).issues;
      const first = issues[0];
      return {
        ok: false,
        error: first ? `${first.path.length ? `${first.path.join(".")}: ` : ""}${first.message}` : "Invalid input.",
      };
    }
    console.error("[admin action]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/** Turns a Supabase error into a readable AdminError. */
export function dbError(error: { message: string; code?: string } | null, what = "save") {
  if (!error) return;
  if (error.code === "23503")
    throw new AdminError(`Can't ${what}: it is used by existing bookings. Switch it off (inactive) instead.`);
  if (error.code === "23505") throw new AdminError("That slug or name is already in use.");
  if (error.code === "42501") throw new AdminError("Not authorised.");
  throw new AdminError(error.message);
}

const num = (v: unknown) => (v == null ? null : Number(v));

/** Postgres numerics arrive as strings; normalise a booking row. */
export function normaliseBooking(b: Record<string, unknown>): Booking {
  const row = b as unknown as Booking;
  return {
    ...row,
    subtotal: Number(row.subtotal ?? 0),
    transport_fee: Number(row.transport_fee ?? 0),
    extras_total: Number(row.extras_total ?? 0),
    total: Number(row.total ?? 0),
    deposit: Number(row.deposit ?? 0),
    quote_amount: num(row.quote_amount),
    drinks: Array.isArray(row.drinks) ? row.drinks : [],
    addons: (Array.isArray(row.addons) ? row.addons : []).map((a) => ({ ...a, unit_price: num(a.unit_price) })),
    extras: (Array.isArray(row.extras) ? row.extras : []).map((a) => ({ ...a, unit_price: num(a.unit_price) })),
  };
}

/** The amount that counts for a booking: the quote when one is set for a custom request. */
export const bookingAmount = (b: Pick<Booking, "kind" | "total" | "quote_amount">) =>
  b.quote_amount != null ? b.quote_amount : b.total;
