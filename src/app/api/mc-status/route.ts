import { NextResponse } from "next/server";
import type { McStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const CACHE_MS = 30_000;
let cache: { data: McStatus; expires: number } | null = null;

async function fetchStatus(ip: string): Promise<McStatus> {
  // mcsrvstat.us is a free, no-key-required Minecraft server status API.
  const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`, {
    // mcsrvstat.us requires a descriptive, non-empty User-Agent header or it
    // rejects the request.
    headers: {
      "User-Agent": "BanglaYXCORE-StatusWidget/1.0 (+https://banglayxcore.fun)",
    },
    // Next's own fetch cache is separate from our in-memory cache; disable it
    // so our manual TTL is the single source of truth.
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`mcsrvstat responded ${res.status}`);
  const json = await res.json();

  if (!json.online) {
    return {
      online: false,
      players: { online: 0, max: 0 },
      ping: null,
      version: null,
      motd: null,
    };
  }

  return {
    online: true,
    players: {
      online: json.players?.online ?? 0,
      max: json.players?.max ?? 0,
    },
    ping: typeof json.debug?.ping === "number" ? json.debug.ping : null,
    version: json.version ?? null,
    motd: json.motd?.clean?.[0] ?? json.motd?.raw?.[0] ?? null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip") || process.env.NEXT_PUBLIC_MC_JAVA_IP || "";

  if (!ip) {
    return NextResponse.json(
      { online: false, players: { online: 0, max: 0 }, ping: null, version: null, motd: null, error: "Currently Unavailable" },
      { status: 200 }
    );
  }

  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await fetchStatus(ip);
    cache = { data, expires: now + CACHE_MS };
    return NextResponse.json(data);
  } catch (err) {
    const fallback: McStatus = {
      online: false,
      players: { online: 0, max: 0 },
      ping: null,
      version: null,
      motd: null,
      error: "Currently Unavailable",
    };
    // Cache the failure briefly too, so a flapping upstream doesn't hammer us.
    cache = { data: fallback, expires: now + 10_000 };
    return NextResponse.json(fallback);
  }
}
