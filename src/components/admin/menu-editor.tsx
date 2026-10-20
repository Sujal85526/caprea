"use client";

import clsx from "clsx";
import { ImageOff, ImageUp, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { deleteRow, reorderRows, saveMenuItem, setActive } from "@/app/admin/_actions/catalog";
import { createClient } from "@/lib/supabase/client";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { ConfirmDialog, MoveButtons, NumberInput, PendingBtn, Spinner, Toggle, move, useAction } from "./client";
import { aed } from "./format";
import { Btn, Field, Pill, Select, inputCls } from "./ui";

export const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "signature", label: "Signature" },
  { value: "matcha", label: "Matcha" },
  { value: "coffee", label: "Coffee" },
  { value: "smoothie", label: "Smoothies" },
  { value: "refresher", label: "Refreshers" },
  { value: "dessert", label: "Desserts" },
  { value: "box", label: "Gathering boxes" },
];

type Draft = Omit<MenuItem, "id" | "sort"> & { id?: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const blank = (category: MenuCategory): Draft => ({
  slug: "",
  name: "",
  description: "",
  category,
  price: null,
  image_url: null,
  best_seller: false,
  catering_signature: false,
  catering_coffee: false,
  catering_addon: false,
  addon_price: null,
  active: true,
});

export function MenuEditor({ items }: { items: MenuItem[] }) {
  const [list, setList] = useState(items);
  const [prevItems, setPrevItems] = useState(items);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState<MenuCategory | null>(null);
  const [filter, setFilter] = useState<MenuCategory | "all">("all");
  const [reorderPending, runReorder] = useAction();

  if (items !== prevItems) {
    setPrevItems(items);
    setList(items);
  }

  const reorder = async (category: MenuCategory, index: number, dir: -1 | 1) => {
    const prev = list;
    const group = list.filter((m) => m.category === category);
    const moved = move(group, index, dir);
    // Swap the two items' positions inside the full list so the UI updates instantly.
    const sorts = group.map((m) => m.sort);
    const next = list.map((m) => {
      const j = moved.findIndex((x) => x.id === m.id);
      return j === -1 ? m : { ...m, sort: sorts[j] };
    });
    setList(next.sort((a, b) => a.sort - b.sort));
    const ok = await runReorder(() => reorderRows("menu_items", moved.map((m) => m.id)));
    if (!ok) setList(prev);
  };

  const groups = CATEGORIES.map((c) => ({ ...c, items: list.filter((m) => m.category === c.value) })).filter(
    (g) => (filter === "all" || g.value === filter) && (g.items.length > 0 || creating === g.value || filter === g.value),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[{ value: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === c.value ? "bg-sand text-espresso" : "border border-sand/20 text-cream/65 hover:text-cream",
              )}
            >
              {c.label}
              {c.value !== "all" && <span className="ml-1.5 opacity-60">{list.filter((m) => m.category === c.value).length}</span>}
            </button>
          ))}
        </div>
        <Btn
          onClick={() => {
            const cat = filter === "all" ? "signature" : filter;
            setCreating(cat);
            setEditing(null);
          }}
        >
          <Plus className="h-4 w-4" /> New item
        </Btn>
      </div>

      {groups.map((g) => (
        <section key={g.value}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-sand">
              {g.label} <span className="ml-1 text-cream/35">{g.items.length}</span>
            </h2>
            <Btn
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(g.value);
                setEditing(null);
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Btn>
          </div>
          <div className="space-y-2">
            {creating === g.value && <MenuForm initial={blank(g.value)} onDone={() => setCreating(null)} />}
            {g.items.map((m, i) =>
              editing === m.id ? (
                <MenuForm key={m.id} initial={m} onDone={() => setEditing(null)} />
              ) : (
                <MenuRow
                  key={`${m.id}:${m.active}`}
                  item={m}
                  onEdit={() => {
                    setEditing(m.id);
                    setCreating(null);
                  }}
                  moveButtons={
                    <MoveButtons
                      disabled={reorderPending}
                      disableUp={i === 0}
                      disableDown={i === g.items.length - 1}
                      onUp={() => reorder(g.value, i, -1)}
                      onDown={() => reorder(g.value, i, 1)}
                    />
                  }
                />
              ),
            )}
            {g.items.length === 0 && creating !== g.value && <p className="text-sm text-cream/45">No items in this category yet.</p>}
          </div>
        </section>
      ))}
    </div>
  );
}

function Thumb({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={clsx("shrink-0 overflow-hidden rounded-xl bg-espresso-700/50", className)}>
      {src && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of local or Supabase images
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sand/40">
          <ImageOff className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function MenuRow({ item: m, onEdit, moveButtons }: { item: MenuItem; onEdit: () => void; moveButtons: React.ReactNode }) {
  const [active, setActiveState] = useState(m.active);
  const [activePending, runActive] = useAction();
  const [deletePending, runDelete] = useAction();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className={clsx("glass flex items-center gap-3 rounded-2xl p-3 sm:gap-4", !active && "opacity-55")}>
      {moveButtons}
      <Thumb src={m.image_url} alt={m.name} className="h-14 w-14" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-cream">{m.name}</span>
          {m.best_seller && (
            <Pill tone="gold">
              <Star className="h-3 w-3" /> Best seller
            </Pill>
          )}
          {m.catering_signature && <Pill tone="matcha">Signature</Pill>}
          {m.catering_coffee && <Pill>Coffee selection</Pill>}
          {m.catering_addon && <Pill>Add-on{m.addon_price != null ? ` ${aed(m.addon_price)}` : ""}</Pill>}
          {!active && <Pill tone="muted">Hidden</Pill>}
        </div>
        {m.description && <p className="mt-0.5 line-clamp-1 text-xs text-cream/50">{m.description}</p>}
      </div>
      <span className="hidden shrink-0 text-sm tabular-nums text-cream/85 sm:block">{m.price != null ? aed(m.price) : "—"}</span>
      <div className="flex shrink-0 items-center gap-1">
        <Toggle
          size="sm"
          checked={active}
          disabled={activePending}
          label={<span className="sr-only">{active ? "Visible" : "Hidden"}</span>}
          onChange={async (v) => {
            setActiveState(v);
            const ok = await runActive(() => setActive("menu_items", m.id, v), { success: v ? `${m.name} is visible` : `${m.name} hidden` });
            if (!ok) setActiveState(!v);
          }}
        />
        <Btn size="icon" variant="ghost" onClick={onEdit} aria-label={`Edit ${m.name}`}>
          <Pencil className="h-4 w-4" />
        </Btn>
        <Btn size="icon" variant="ghost" onClick={() => setConfirm(true)} aria-label={`Delete ${m.name}`}>
          <Trash2 className="h-4 w-4" />
        </Btn>
      </div>
      <ConfirmDialog
        open={confirm}
        title={`Delete ${m.name}?`}
        pending={deletePending}
        onClose={() => setConfirm(false)}
        onConfirm={() => runDelete(() => deleteRow("menu_items", m.id), { success: `${m.name} deleted`, onSuccess: () => setConfirm(false) })}
      >
        It disappears from the menu and the booking options. To bring it back later, hide it instead.
      </ConfirmDialog>
    </div>
  );
}

function MenuForm({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [d, setD] = useState<Draft>({ ...initial, description: initial.description ?? "" });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [pending, run] = useAction();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file (JPG, PNG or WebP).");
    if (file.size > 5 * 1024 * 1024) return toast.error("Images must be under 5 MB.");
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${d.slug || slugify(d.name) || "item"}-${Date.now().toString(36)}.${ext}`;
      const { error } = await supabase.storage.from("menu").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (error) throw error;
      const { data } = supabase.storage.from("menu").getPublicUrl(path);
      set("image_url", data.publicUrl);
      toast.success("Image uploaded. Save the item to use it.");
    } catch (e) {
      toast.error(e instanceof Error ? `Upload failed: ${e.message}` : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(
      () =>
        saveMenuItem({
          id: d.id,
          slug: d.slug,
          name: d.name,
          description: d.description || null,
          category: d.category,
          price: d.price,
          image_url: d.image_url || null,
          best_seller: d.best_seller,
          catering_signature: d.catering_signature,
          catering_coffee: d.catering_coffee,
          catering_addon: d.catering_addon,
          addon_price: d.catering_addon ? d.addon_price : null,
          active: d.active,
        }),
      { success: d.id ? `${d.name} saved` : `${d.name} added`, onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl border-sand/40 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-sans text-base font-semibold tracking-normal text-cream">{d.id ? `Edit ${initial.name}` : "New menu item"}</h3>
        <Btn size="icon" variant="ghost" onClick={onDone} aria-label="Close editor">
          <X className="h-4 w-4" />
        </Btn>
      </div>

      <div className="grid gap-6 md:grid-cols-[11rem_1fr]">
        <div className="space-y-2">
          <Thumb key={d.image_url ?? "none"} src={d.image_url} alt={d.name || "Menu item"} className="aspect-square w-full max-w-44" />
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <Btn size="sm" variant="outline" className="w-full" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Spinner className="h-3.5 w-3.5" /> : <ImageUp className="h-3.5 w-3.5" />}
            {uploading ? "Uploading…" : "Upload image"}
          </Btn>
          {d.image_url && (
            <button type="button" onClick={() => set("image_url", null)} className="block w-full text-center text-xs text-cream/45 hover:text-cream">
              Remove image
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Field label="Name" className="col-span-2">
            <input
              required
              className={inputCls}
              value={d.name}
              onChange={(e) => {
                const name = e.target.value;
                setD((x) => ({ ...x, name, slug: slugTouched ? x.slug : slugify(name) }));
              }}
            />
          </Field>
          <Field label="Slug" className="col-span-2" hint="Used in links and bookings. Changing it on an existing item can break old references.">
            <input
              required
              className={inputCls}
              value={d.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              }}
            />
          </Field>
          <Field label="Category" className="col-span-2 lg:col-span-1">
            <Select value={d.category} onChange={(e) => set("category", e.target.value as MenuCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price (AED)" className="col-span-2 lg:col-span-1">
            <NumberInput min={0} step="0.01" allowEmpty className={inputCls} value={d.price} onChange={(v) => set("price", v)} />
          </Field>
          <Field label="Image URL" className="col-span-2" hint="Upload above, or paste a path like /menu/latte.webp">
            <input className={inputCls} value={d.image_url ?? ""} onChange={(e) => set("image_url", e.target.value || null)} />
          </Field>
          <Field label="Description" className="col-span-2 lg:col-span-4">
            <textarea rows={2} className={`${inputCls} resize-y`} value={d.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div className="col-span-2 space-y-3 rounded-2xl border border-sand/15 bg-sand/[0.04] p-4 lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-cream/55">Catering roles</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Toggle checked={d.catering_signature} onChange={(v) => set("catering_signature", v)} label="Signature drink (packages)" />
              <Toggle checked={d.catering_coffee} onChange={(v) => set("catering_coffee", v)} label="Coffee selection" />
              <Toggle checked={d.catering_addon} onChange={(v) => set("catering_addon", v)} label="Add-on" />
            </div>
            {d.catering_addon && (
              <Field label="Add-on price per piece (AED)" hint="Leave empty to use the menu price." className="max-w-xs">
                <NumberInput min={0} step="0.01" allowEmpty className={inputCls} value={d.addon_price} onChange={(v) => set("addon_price", v)} />
              </Field>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-sand/10 pt-5">
        <div className="flex flex-wrap gap-5">
          <Toggle checked={d.best_seller} onChange={(v) => set("best_seller", v)} label="Best seller" />
          <Toggle checked={d.active} onChange={(v) => set("active", v)} label="Visible on website" />
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onDone}>
            Cancel
          </Btn>
          <PendingBtn type="submit" pending={pending} disabled={uploading}>
            {d.id ? "Save item" : "Add item"}
          </PendingBtn>
        </div>
      </div>
    </form>
  );
}
