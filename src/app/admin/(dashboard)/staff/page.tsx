"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { StaffMember } from "@/lib/types";

const ROLE_WEIGHTS: Record<string, number> = { Owner: 0, Admin: 1, Moderator: 2, Helper: 3 };

const EMPTY: Omit<StaffMember, "id"> = {
  name: "",
  role: "Helper",
  rank_weight: 3,
  avatar_url: "",
  discord_username: "",
  display_order: 0,
  enabled: true,
};

export default function AdminStaffPage() {
  const supabase = createClient();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StaffMember, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("staff").select("*").order("rank_weight").order("display_order");
    if (error) toast.error(error.message);
    setStaff((data ?? []) as StaffMember[]);
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

  function startEdit(member: StaffMember) {
    setEditingId(member.id);
    const { id, ...rest } = member;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const payload = {
      ...form,
      avatar_url: form.avatar_url || null,
      discord_username: form.discord_username || null,
      rank_weight: ROLE_WEIGHTS[form.role] ?? form.rank_weight,
    };

    const { error } = editingId
      ? await supabase.from("staff").update(payload).eq("id", editingId)
      : await supabase.from("staff").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Staff member updated" : "Staff member added");
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this staff member?")) return;
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  }

  async function toggleEnabled(member: StaffMember) {
    const { error } = await supabase.from("staff").update({ enabled: !member.enabled }).eq("id", member.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-pixel-shadow text-lg text-ink">Staff</h1>
          <p className="text-sm text-ink-muted">Manage the staff team roster</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore hover:bg-ore/20"
        >
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      {showForm && (
        <div className="slot-notch mb-6 border border-border bg-panel/60 p-5 shadow-slot">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{editingId ? "Edit Staff Member" : "New Staff Member"}</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-ink-muted" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <select className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Owner</option>
                <option>Admin</option>
                <option>Moderator</option>
                <option>Helper</option>
              </select>
            </Field>
            <Field label="Avatar URL">
              <input className="admin-input" value={form.avatar_url ?? ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
            </Field>
            <Field label="Discord Username">
              <input className="admin-input" value={form.discord_username ?? ""} onChange={(e) => setForm({ ...form, discord_username: e.target.value })} />
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
      ) : staff.length === 0 ? (
        <p className="text-sm text-ink-muted">No staff yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Discord</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((member) => (
                <tr key={member.id} className="bg-panel/40">
                  <td className="px-4 py-3 font-medium text-ink">{member.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{member.role}</td>
                  <td className="px-4 py-3 text-ink-muted">{member.discord_username || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEnabled(member)}
                      className={`rounded-sm px-2 py-1 text-xs font-semibold ${
                        member.enabled ? "bg-ore/10 text-ore" : "bg-danger/10 text-danger"
                      }`}
                    >
                      {member.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(member)} className="mr-2 text-ink-muted hover:text-ore"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(member.id)} className="text-ink-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-muted">{label}</label>
      {children}
    </div>
  );
}
