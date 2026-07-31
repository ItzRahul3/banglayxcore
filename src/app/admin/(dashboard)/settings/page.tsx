"use client";

import { useEffect, useState } from "react";
import { Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

const DEFAULTS: SiteSettings = {
  server_name: "BanglaYX CORE",
  java_ip: "play.banglayxcore.fun",
  bedrock_ip: "play.banglayxcore.fun",
  bedrock_port: 19193,
  discord_invite: "https://discord.gg/bWTWSUPK2y",
  discord_server_id: "",
  hero_background_url: "",
  website_logo_url: "",
  vote_reward_key: 1,
  vote_reward_money: 200,
  tagline: "The Ultimate Bangladeshi Minecraft Survival Experience",
};

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("settings").select("key,value");
      if (error) toast.error(error.message);
      if (data) {
        const merged = { ...DEFAULTS };
        for (const row of data) {
          if (row.key in merged) (merged as any)[row.key] = row.value;
        }
        setSettings(merged);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  if (loading) return <p className="text-sm text-ink-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-pixel text-pixel-shadow text-lg text-ink">Settings</h1>
      <p className="mb-6 text-sm text-ink-muted">Everything here updates the live site instantly</p>

      <div className="slot-notch space-y-5 border border-border bg-panel/60 p-6 shadow-slot">
        <Section title="Server">
          <Field label="Server Name">
            <input className="admin-input" value={settings.server_name} onChange={(e) => set("server_name", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input className="admin-input" value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Java IP">
              <input className="admin-input" value={settings.java_ip} onChange={(e) => set("java_ip", e.target.value)} />
            </Field>
            <Field label="Bedrock IP">
              <input className="admin-input" value={settings.bedrock_ip} onChange={(e) => set("bedrock_ip", e.target.value)} />
            </Field>
          </div>
          <Field label="Bedrock Port">
            <input type="number" className="admin-input" value={settings.bedrock_port} onChange={(e) => set("bedrock_port", Number(e.target.value))} />
          </Field>
        </Section>

        <Section title="Discord">
          <Field label="Discord Invite URL">
            <input className="admin-input" value={settings.discord_invite} onChange={(e) => set("discord_invite", e.target.value)} />
          </Field>
          <Field label="Discord Server ID (for live widget stats)">
            <input className="admin-input" value={settings.discord_server_id} onChange={(e) => set("discord_server_id", e.target.value)} />
            <p className="mt-1.5 flex items-start gap-1 text-xs text-ink-faint">
              Requires Server Settings → Widget → Enable Server Widget on Discord.
              <a
                href="https://support.discord.com/hc/en-us/articles/360028391011"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-ore hover:underline"
              >
                Learn how <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </Field>
        </Section>

        <Section title="Branding">
          <Field label="Website Logo URL">
            <input className="admin-input" value={settings.website_logo_url} onChange={(e) => set("website_logo_url", e.target.value)} />
          </Field>
          <Field label="Hero Background Image URL">
            <input className="admin-input" value={settings.hero_background_url} onChange={(e) => set("hero_background_url", e.target.value)} />
          </Field>
        </Section>

        <Section title="Default Vote Reward">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Vote Key Amount">
              <input type="number" className="admin-input" value={settings.vote_reward_key} onChange={(e) => set("vote_reward_key", Number(e.target.value))} />
            </Field>
            <Field label="Money Amount ($)">
              <input type="number" className="admin-input" value={settings.vote_reward_money} onChange={(e) => set("vote_reward_money", Number(e.target.value))} />
            </Field>
          </div>
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-5 py-2.5 text-sm font-semibold text-ore hover:bg-ore/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <style>{`
        .admin-input { width: 100%; background: #0a0d0a; border: 1px solid #243024; border-radius: 2px; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #e9f2e6; }
        .admin-input:focus { outline: none; border-color: rgba(85,255,85,0.5); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5 last:border-0 last:pb-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">{title}</h3>
      <div className="space-y-3">{children}</div>
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
