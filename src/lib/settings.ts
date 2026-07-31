import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
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

// Server Component / Route Handler only — reads the settings key/value table
// into a typed object, falling back to sane defaults for any key that isn't
// set yet (so the site never breaks before an admin has configured settings).
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("settings").select("key,value");
    if (error || !data) return DEFAULT_SETTINGS;

    const merged = { ...DEFAULT_SETTINGS };
    for (const row of data) {
      if (row.key in merged) {
        (merged as any)[row.key] = row.value;
      }
    }
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
