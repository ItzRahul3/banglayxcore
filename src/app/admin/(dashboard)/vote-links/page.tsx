"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { VoteLink } from "@/lib/types";

const EMPTY: Omit<VoteLink, "id"> = {
  name: "",
  logo_url: "",
  description: "",
  vote_url: "",
  reward_key_amount: 1,
  reward_money_amount: 200,
  display_order: 0,
  enabled: true,
};

export default function AdminVoteLinksPage() {
  const supabase = createClient();
  const [links, setLinks] = useState<VoteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<VoteLink, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("vote_links").select("*").order("display_order");
    if (error) toast.error(error.message);
    setLinks((data ?? []) as VoteLink[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function startEdit(link: VoteLink) {
    setEditingId(link.id);
    const { id, ...rest } = link;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.vote_url.trim()) {
      toast.error("Name and Vote URL are required");
      return;
    }
    const payload = { ...form, logo_url: form.logo_url || null };

    const { error } = editingId
      ? await supabase.from("vote_links").update(payload).eq("id", editingId)
      : await supabase.from("vote_links").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Vote site updated" : "Vote site added");
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this vote site?")) return;
    const { error } = await supabase.from("vote_links").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleEnabled(link: VoteLink) {
    const { error } = await supabase
      .from("vote_links")
      .update({ enabled: !link.enabled })
      .eq("id", link.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-pixel-shadow text-lg text-ink">Vote Links</h1>
          <p className="text-sm text-ink-muted">Manage the sites players can vote on</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore hover:bg-ore/20"
        >
          <Plus className="h-4 w-4" /> Add Vote Site
        </button>
      </div>

      {showForm && (
        <div className="slot-notch mb-6 border border-border bg-panel/60 p-5 shadow-slot">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{editingId ? "Edit Vote Site" : "New Vote Site"}</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-ink-muted" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Website Name">
              <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Logo URL">
              <input className="admin-input" value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
            </Field>
            <Field label="Vote URL" full>
              <input className="admin-input" value={form.vote_url} onChange={(e) => setForm({ ...form, vote_url: e.target.value })} />
            </Field>
            <Field label="Description" full>
              <textarea className="admin-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Vote Key Reward">
              <input type="number" className="admin-input" value={form.reward_key_amount} onChange={(e) => setForm({ ...form, reward_key_amount: Number(e.target.value) })} />
            </Field>
            <Field label="Money Reward ($)">
              <input type="number" className="admin-input" value={form.reward_money_amount} onChange={(e) => setForm({ ...form, reward_money_amount: Number(e.target.value) })} />
            </Field>
            <Field label="Display Order">
              <input type="number" className="admin-input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
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
      ) : links.length === 0 ? (
        <p className="text-sm text-ink-muted">No vote sites yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((link) => (
                <tr key={link.id} className="bg-panel/40">
                  <td className="px-4 py-3 font-medium text-ink">{link.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{link.reward_key_amount} Key · ${link.reward_money_amount}</td>
                  <td className="px-4 py-3 text-ink-muted">{link.display_order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEnabled(link)}
                      className={`rounded-sm px-2 py-1 text-xs font-semibold ${
                        link.enabled ? "bg-ore/10 text-ore" : "bg-danger/10 text-danger"
                      }`}
                    >
                      {link.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(link)} className="mr-2 text-ink-muted hover:text-ore"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(link.id)} className="text-ink-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%;
          background: #0a0d0a;
          border: 1px solid #243024;
          border-radius: 2px;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #e9f2e6;
        }
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
