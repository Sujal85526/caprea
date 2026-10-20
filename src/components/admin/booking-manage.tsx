"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBooking, updateBooking } from "@/app/admin/_actions/bookings";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";
import { ConfirmDialog, NumberInput, PendingBtn, useAction } from "./client";
import { Btn, Card, Field, PAYMENT_LABEL, STATUS_LABEL, SectionTitle, Select, inputCls } from "./ui";

const STATUS_ORDER: BookingStatus[] = ["pending", "request", "quoted", "confirmed", "completed", "cancelled"];
const PAYMENT_ORDER: PaymentStatus[] = ["unpaid", "deposit_paid", "paid", "refunded"];

export function BookingManage({ booking: b }: { booking: Booking }) {
  const router = useRouter();
  const [statusPending, runStatus] = useAction();
  const [paymentPending, runPayment] = useAction();
  const [quotePending, runQuote] = useAction();
  const [notesPending, runNotes] = useAction();
  const [deletePending, runDelete] = useAction();

  const [status, setStatus] = useState(b.status);
  const [payment, setPayment] = useState(b.payment_status);
  const [quote, setQuote] = useState<number | null>(b.quote_amount);
  const [notes, setNotes] = useState(b.admin_notes ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const changeStatus = async (next: BookingStatus) => {
    const prev = status;
    setStatus(next); // optimistic
    const ok = await runStatus(() => updateBooking(b.id, { status: next }), { success: `Marked ${STATUS_LABEL[next].toLowerCase()}` });
    if (!ok) setStatus(prev);
  };

  const changePayment = async (next: PaymentStatus) => {
    const prev = payment;
    setPayment(next);
    const ok = await runPayment(() => updateBooking(b.id, { payment_status: next }), { success: `Payment: ${PAYMENT_LABEL[next]}` });
    if (!ok) setPayment(prev);
  };

  const saveQuote = (markQuoted: boolean) =>
    runQuote(
      () => updateBooking(b.id, markQuoted ? { quote_amount: quote, status: "quoted" } : { quote_amount: quote }),
      {
        success: markQuoted ? "Quote saved and marked quoted" : "Quote saved",
        onSuccess: () => markQuoted && setStatus("quoted"),
      },
    );

  const showQuote = b.kind === "custom" || b.quote_amount != null;

  return (
    <>
      <Card>
        <SectionTitle>Manage</SectionTitle>
        <div className="space-y-5">
          <Field label="Booking status">
            <Select
              value={status}
              disabled={statusPending}
              onChange={(e) => changeStatus(e.target.value as BookingStatus)}
              aria-busy={statusPending}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Payment">
            <Select
              value={payment}
              disabled={paymentPending}
              onChange={(e) => changePayment(e.target.value as PaymentStatus)}
              aria-busy={paymentPending}
            >
              {PAYMENT_ORDER.map((s) => (
                <option key={s} value={s}>
                  {PAYMENT_LABEL[s]}
                </option>
              ))}
            </Select>
          </Field>

          {showQuote && (
            <div className="rounded-2xl border border-sand/15 bg-sand/[0.04] p-4">
              <Field label="Quote (AED)" hint="The final price you agreed with the customer.">
                <NumberInput
                  min={0}
                  step="0.01"
                  allowEmpty
                  className={inputCls}
                  value={quote}
                  onChange={setQuote}
                  placeholder={b.total ? String(b.total) : "0"}
                />
              </Field>
              <div className="mt-3 flex flex-wrap gap-2">
                <PendingBtn size="sm" variant="outline" pending={quotePending} onClick={() => saveQuote(false)}>
                  Save quote
                </PendingBtn>
                {status === "request" && (
                  <PendingBtn size="sm" pending={quotePending} disabled={quote == null} onClick={() => saveQuote(true)}>
                    Save & mark quoted
                  </PendingBtn>
                )}
                {status === "quoted" && (
                  <PendingBtn size="sm" pending={statusPending} onClick={() => changeStatus("confirmed")}>
                    Mark confirmed
                  </PendingBtn>
                )}
              </div>
            </div>
          )}

          <Field label="Admin notes" hint="Only visible to admins.">
            <textarea
              rows={4}
              className={`${inputCls} resize-y`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes: payment reference, setup details…"
            />
          </Field>
          <PendingBtn
            size="sm"
            variant="outline"
            pending={notesPending}
            disabled={notes === (b.admin_notes ?? "")}
            onClick={() => runNotes(() => updateBooking(b.id, { admin_notes: notes }), { success: "Notes saved" })}
          >
            Save notes
          </PendingBtn>
        </div>
      </Card>

      <div className="flex justify-end">
        <Btn variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
          <Trash2 className="h-3.5 w-3.5" /> Delete booking
        </Btn>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete booking ${b.ref}?`}
        confirmLabel="Delete booking"
        pending={deletePending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          runDelete(() => deleteBooking(b.id), {
            success: "Booking deleted",
            onSuccess: () => {
              setConfirmDelete(false);
              router.replace("/admin/bookings");
              router.refresh();
            },
          })
        }
      >
        This permanently removes {b.customer_name}&apos;s booking. To keep a record, set the status to cancelled instead.
      </ConfirmDialog>
    </>
  );
}
