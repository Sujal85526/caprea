"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { dbError, runAction, type ActionResult } from "@/lib/admin";

const updateSchema = z
  .object({
    status: z.enum(["pending", "request", "quoted", "confirmed", "completed", "cancelled"]).optional(),
    payment_status: z.enum(["unpaid", "deposit_paid", "paid", "refunded"]).optional(),
    quote_amount: z.number().min(0).max(10_000_000).nullable().optional(),
    admin_notes: z
      .string()
      .max(5000)
      .nullable()
      .optional()
      .transform((v) => (v == null ? v : v.trim() || null)),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");

export type BookingUpdate = z.input<typeof updateSchema>;

export async function updateBooking(bookingId: string, input: BookingUpdate): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const rowId = z.uuid().parse(bookingId);
    const patch = updateSchema.parse(input);
    if (patch.status === "quoted") {
      // A quote needs an amount: either in this update or already stored.
      if (patch.quote_amount === undefined) {
        const { data } = await supabase.from("bookings").select("quote_amount").eq("id", rowId).single();
        if (data?.quote_amount == null) throw new Error("Set a quote amount before marking it quoted.");
      } else if (patch.quote_amount == null) {
        throw new Error("Set a quote amount before marking it quoted.");
      }
    }
    const { error, count } = await supabase.from("bookings").update(patch, { count: "exact" }).eq("id", rowId);
    dbError(error);
    if (!count) throw new Error("Booking not found.");
    refresh();
  });
}

export async function deleteBooking(bookingId: string): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const rowId = z.uuid().parse(bookingId);
    const { error, count } = await supabase.from("bookings").delete({ count: "exact" }).eq("id", rowId);
    dbError(error, "delete this booking");
    if (!count) throw new Error("Booking not found.");
  });
}
