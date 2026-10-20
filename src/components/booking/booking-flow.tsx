"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { submitBooking } from "@/app/(site)/book/actions";
import { useLenis } from "@/components/site/smooth-scroll";
import { Button } from "@/components/ui/button";
import type { BookingKind, Catalog } from "@/lib/types";
import {
  FIELD_STEP,
  STEPS,
  STEP_LABELS,
  emptyForm,
  quoteFor,
  validateAll,
  validateStep,
  type BookingForm,
  type FieldErrors,
  type StepId,
} from "./model";
import { StepContact } from "./step-contact";
import { StepCups, StepDrinks } from "./step-drinks";
import { StepEvent } from "./step-event";
import { StepExtras } from "./step-extras";
import { StepIndicator } from "./step-indicator";
import { StepMode } from "./step-mode";
import { StepPackage } from "./step-package";
import { StepReview } from "./step-review";
import { SummaryCard, SummarySheet } from "./summary";

gsap.registerPlugin(useGSAP);

export type BookingStart = { kind: BookingKind | null; packageId: string | null };

function initialState(start: BookingStart) {
  const form: BookingForm = { ...emptyForm(), kind: start.kind, packageId: start.packageId };
  // Deep links skip what's already chosen: ?package=… lands on drinks, ?mode=… on its first step.
  const step = start.kind === "package" && start.packageId ? 2 : start.kind ? 1 : 0;
  return { form, step };
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BookingFlow({ catalog, start }: { catalog: Catalog; start: BookingStart }) {
  const router = useRouter();
  const lenis = useLenis();
  const init = useMemo(() => initialState(start), [start]);
  const [form, setForm] = useState<BookingForm>(init.form);
  const [stepIndex, setStepIndex] = useState(init.step);
  const [maxReached, setMaxReached] = useState(init.step);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();
  const direction = useRef(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const steps = STEPS[form.kind ?? "package"];
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const quote = useMemo(() => quoteFor(form, catalog), [form, catalog]);
  const isLast = step === "review";

  const update = useCallback((patch: Partial<BookingForm> | ((f: BookingForm) => Partial<BookingForm>)) => {
    setForm((f) => {
      const p = typeof patch === "function" ? patch(f) : patch;
      setErrors((e) => {
        const keys = Object.keys(p).filter((k) => e[k]);
        if (!keys.length) return e;
        const next = { ...e };
        keys.forEach((k) => delete next[k]);
        return next;
      });
      return { ...f, ...p };
    });
  }, []);

  // Step transition: fade/slide the panel, stagger its cards.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !panelRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(panelRef.current, { autoAlpha: 0, x: 24 * direction.current, duration: 0.45, clearProps: "all" });
      const items = panelRef.current.querySelectorAll("[data-animate]");
      if (items.length)
        tl.from(
          items,
          { autoAlpha: 0, y: 18, duration: 0.5, stagger: { each: 0.035, amount: 0.35 }, clearProps: "all" },
          0.05,
        );
    },
    { dependencies: [step, form.kind], scope: rootRef },
  );

  const scrollToY = (top: number) => {
    if (lenis) lenis.scrollTo(top, { duration: 0.9 });
    else window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const goTo = useCallback(
    (i: number) => {
      direction.current = i >= stepIndex ? 1 : -1;
      setStepIndex(i);
      setMaxReached((m) => Math.max(m, i));
      setErrors({});
      requestAnimationFrame(() => {
        const el = rootRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        if (window.scrollY > top) scrollToY(top);
        panelRef.current?.focus({ preventScroll: true });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stepIndex, lenis],
  );

  const showErrors = (e: FieldErrors) => {
    setErrors(e);
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("[aria-invalid='true'], [role='alert']");
      if (first) scrollToY(first.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3);
      if (first && "focus" in first && first.matches("input,select,textarea")) first.focus({ preventScroll: true });
    });
  };

  const next = () => {
    const e = validateStep(step, form, catalog);
    if (Object.keys(e).length) return showErrors(e);
    goTo(stepIndex + 1);
  };

  const back = () => stepIndex > 0 && goTo(stepIndex - 1);

  const chooseKind = (kind: BookingKind) => {
    if (kind !== form.kind) {
      // drink selections mean different things per flow, so start fresh
      setForm((f) => ({ ...f, kind, drinks: {}, cups: 0, packageId: kind === "package" ? f.packageId : null }));
      setMaxReached(0);
    }
    setErrors({});
    direction.current = 1;
    window.setTimeout(() => goTo(1), 180);
  };

  const jumpToFirstError = (e: FieldErrors) => {
    const order = STEPS[form.kind ?? "package"];
    const target = order.findIndex((s) => Object.keys(e).some((k) => FIELD_STEP[k] === s));
    if (target >= 0 && target !== stepIndex) {
      goTo(target);
      requestAnimationFrame(() => setErrors(e));
    } else showErrors(e);
  };

  const submit = () => {
    const e = validateAll(form, catalog);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return jumpToFirstError(e);
    }
    startTransition(async () => {
      const res = await submitBooking(form).catch(() => null);
      if (!res) {
        toast.error("Something went wrong. Please check your connection and try again.");
        return;
      }
      if (!res.ok) {
        toast.error(res.error);
        if (res.fieldErrors) jumpToFirstError(res.fieldErrors);
        return;
      }
      toast.success(form.kind === "custom" ? "Request sent" : "Booking confirmed");
      router.push(`/booking/${encodeURIComponent(res.ref)}?e=${encodeURIComponent(res.email)}`);
    });
  };

  const props = { form, update, catalog, errors };

  const panels: Record<StepId, React.ReactNode> = {
    mode: <StepMode {...props} onChoose={chooseKind} />,
    package: <StepPackage {...props} />,
    cups: <StepCups {...props} />,
    drinks: <StepDrinks {...props} />,
    extras: <StepExtras {...props} />,
    event: <StepEvent {...props} />,
    contact: <StepContact {...props} />,
    review: <StepReview {...props} quote={quote} onEdit={(s) => goTo(steps.indexOf(s))} />,
  };

  return (
    <div ref={rootRef} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
      <div className="min-w-0">
        <StepIndicator steps={steps} current={stepIndex} maxReached={maxReached} onJump={goTo} />

        <div
          ref={panelRef}
          key={`${form.kind}-${step}`}
          tabIndex={-1}
          role="group"
          aria-label={`Step ${stepIndex + 1}: ${STEP_LABELS[step]}`}
          className="outline-none"
        >
          {panels[step]}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-sand/15 pt-8">
          {stepIndex > 0 ? (
            <Button type="button" variant="outline" onClick={back} disabled={pending} className="px-5 sm:px-7">
              <ArrowLeft className="size-4" /> <span className="max-sm:sr-only">Back</span>
            </Button>
          ) : (
            <span />
          )}

          {isLast ? (
            <Button type="button" onClick={submit} disabled={pending} aria-busy={pending} className="min-w-[13rem]">
              {pending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> {form.kind === "custom" ? "Sending…" : "Confirming…"}
                </>
              ) : form.kind === "custom" ? (
                "Send request"
              ) : (
                "Confirm booking"
              )}
            </Button>
          ) : step === "mode" && !form.kind ? (
            <span />
          ) : (
            <Button type="button" onClick={next}>
              Continue <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>

      <SummaryCard form={form} catalog={catalog} quote={quote} />
      <SummarySheet form={form} catalog={catalog} quote={quote} />
    </div>
  );
}
