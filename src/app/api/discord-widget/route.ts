import { NextResponse } from "next/server";
import type { DiscordStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const CACHE_MS = 60_000;
let cache: { data: DiscordStatus; expires: number } | null = null;

async function fetchWidget(serverId: string): Promise<DiscordStatus> {
  const res = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (res.status === 403) {
    return {
      available: false,
      name: null,
      iconUrl: null,
      memberCount: null,
      presenceCount: null,
      voiceCount: null,
      reason:
        "Discord Widget is disabled for this server. Enable it in Discord: Server Settings > Widget > Enable Server Widget.",
    };
  }
  if (!res.ok) throw new Error(`discord widget responded ${res.status}`);

  const json = await res.json();
  const members: any[] = json.members ?? [];
  const voiceCount = members.filter((m) => !!m.channel_id).length;

  return {
    available: true,
    name: json.name ?? null,
    iconUrl: null, // widget.json doesn't include the icon; optional bot-token path could add it
    memberCount: json.presence_count ?? null, // widget only reports online members
    presenceCount: json.presence_count ?? null,
    voiceCount,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get("id") || process.env.DISCORD_SERVER_ID || "";

  if (!serverId) {
    return NextResponse.json({
      available: false,
      name: null,
      iconUrl: null,
      memberCount: null,
      presenceCount: null,
      voiceCount: null,
      reason:
        "No Discord Server ID configured. Set discord_server_id in Admin > Settings, and enable the widget in Discord: Server Settings > Widget.",
    } satisfies DiscordStatus);
  }

  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await fetchWidget(serverId);
    cache = { data, expires: now + CACHE_MS };
    return NextResponse.json(data);
  } catch {
    const fallback: DiscordStatus = {
      available: false,
      name: null,
      iconUrl: null,
      memberCount: null,
      presenceCount: null,
      voiceCount: null,
      reason: "Currently Unavailable",
    };
    cache = { data: fallback, expires: now + 15_000 };
    return NextResponse.json(fallback);
  }
}
