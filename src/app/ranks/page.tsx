import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import type { Rank } from "@/lib/types";
import RanksGrid from "@/components/RanksGrid";

export const metadata = { title: "Ranks — BanglaYX CORE" };
export const revalidate = 60;

export default async function RanksPage() {
  const supabase = await createClient();
  const [{ data: ranks }, settings] = await Promise.all([
    supabase.from("ranks").select("*").eq("enabled", true).order("display_order", { ascending: true }),
    getSiteSettings(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">Support & unlock perks</p>
        <h1 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">Server Ranks</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          All purchases are handled securely through a Discord ticket — no online
          payment on this site.
        </p>
      </div>

      <RanksGrid ranks={(ranks ?? []) as Rank[]} discordInvite={settings.discord_invite} />
    </section>
  );
}
