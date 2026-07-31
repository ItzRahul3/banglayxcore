"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Rank } from "@/lib/types";

const EMPTY: Omit<Rank, "id"> = {
  name: "",
  price: 0,
  currency: "BDT",
  features: [],
  gradient_from: "#55ff55",
  gradient_to: "#e6b93c",
  badge_text: "",
  image_url: "",
  display_order: 0,
  enabled: true,
};

export default function AdminRanksPage() {
  const supabase = createClient();
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Rank, "id">>(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("ranks").select("*").order("display_order");
    if (error) toast.error(error.message);
    setRanks((data ?? []) as Rank[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(EMPTY);
    setFeaturesText("");
    setShowForm(true);
  }

  function startEdit(rank: Rank) {
    setEditingId(rank.id);
    const { id, ...rest } = rank;
    setForm(rest);
    setFeaturesText(rank.features.join("\n"));
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Rank name is required");
      return;
    }
    const payload = {
      ...form,
      image_url: form.image_url || null,
      features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    const { error } = editingId
      ? await supabase.from("ranks").update(payload).eq("id", editingId)
      : await supabase.from("ranks").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Rank updated" : "Rank added");
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this rank?")) return;
    const { error } = await supabase.from("ranks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleEnabled(rank: Rank) {
    const { error } = await supabase.from("ranks").update({ enabled: !rank.enabled }).eq("id", rank.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-pixel-shadow text-lg text-ink">Ranks</h1>
          <p className="text-sm text-ink-muted">Manage purchasable server ranks</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore hover:bg-ore/20"
        >
          <Plus className="h-4 w-4" /> Add Rank
        </button>
      </div>

      {showForm && (
        <div className="slot-notch mb-6 border border-border bg-panel/60 p-5 shadow-slot">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{editingId ? "Edit Rank" : "New Rank"}</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-ink-muted" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Rank Name">
              <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Badge Text">
              <input className="admin-input" value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} placeholder="e.g. Popular" />
            </Field>
            <Field label="Price">
              <input type="number" className="admin-input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Currency">
              <input className="admin-input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </Field>
            <Field label="Gradient From">
              <input type="color" className="admin-input h-10" value={form.gradient_from} onChange={(e) => setForm({ ...form, gradient_from: e.target.value })} />
            </Field>
            <Field label="Gradient To">
              <input type="color" className="admin-input h-10" value={form.gradient_to} onChange={(e) => setForm({ ...form, gradient_to: e.target.value })} />
            </Field>
            <Field label="Image URL">
              <input className="admin-input" value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </Field>
            <Field label="Display Order">
              <input type="number" className="admin-input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </Field>
            <Field label="Features (one per line)" full>
              <textarea className="admin-input" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Kit /rankup\nColored chat\nExtra homes"} />
            </Field>
            <Field label="Enabled">
              <select className="admin-input" value={form.enabled ? "1" : "0"} onChange={(e) => setForm({ ...form, enabled: e.target.value === "1" })}>
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </select>
            </Field>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore hover:bg-ore/20">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : ranks.length === 0 ? (
        <p className="text-sm text-ink-muted">No ranks yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranks.map((rank) => (
                <tr key={rank.id} className="bg-panel/40">
                  <td className="px-4 py-3 font-medium text-ink">{rank.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{rank.currency} {rank.price}</td>
                  <td className="px-4 py-3 text-ink-muted">{rank.display_order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEnabled(rank)}
                      className={`rounded-sm px-2 py-1 text-xs font-semibold ${
                        rank.enabled ? "bg-ore/10 text-ore" : "bg-danger/10 text-danger"
                      }`}
                    >
                      {rank.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(rank)} className="mr-2 text-ink-muted hover:text-ore"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(rank.id)} className="text-ink-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-input { width: 100%; background: #0a0d0a; border: 1px solid #243024; border-radius: 2px; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #e9f2e6; }
        .admin-input:focus { outline: none; border-color: rgba(85,255,85,0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-semibold text-ink-muted">{label}</label>
      {children}
    </div>
  );
}
