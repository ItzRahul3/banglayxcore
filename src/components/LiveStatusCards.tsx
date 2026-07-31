"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Signal, MessageSquare, Mic, ExternalLink } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import type { McStatus, DiscordStatus } from "@/lib/types";

const MC_REFRESH_MS = 45_000;
const DISCORD_REFRESH_MS = 60_000;

export default function LiveStatusCards({ discordInvite }: { discordInvite: string }) {
  const [mc, setMc] = useState<McStatus | null>(null);
  const [discord, setDiscord] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    let alive = true;
    const loadMc = () =>
      fetch("/api/mc-status")
        .then((r) => r.json())
        .then((data) => alive && setMc(data))
        .catch(() => alive && setMc({ online: false, players: { online: 0, max: 0 }, ping: null, version: null, motd: null, error: "Currently Unavailable" }));

    loadMc();
    const id = setInterval(loadMc, MC_REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadDiscord = () =>
      fetch("/api/discord-widget")
        .then((r) => r.json())
        .then((data) => alive && setDiscord(data))
        .catch(() => alive && setDiscord({ available: false, name: null, iconUrl: null, memberCount: null, presenceCount: null, voiceCount: null, reason: "Currently Unavailable" }));

    loadDiscord();
    const id = setInterval(loadDiscord, DISCORD_REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2">
      {/* Minecraft server card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="slot-notch border border-border bg-panel/70 p-5 shadow-slot backdrop-blur"
      >
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              mc?.online ? "bg-ore animate-pulse-ring" : mc ? "bg-danger" : "bg-ink-faint"
            }`}
          />
          <span className="text-sm font-bold text-ink">Minecraft Server</span>
        </div>

        {!mc ? (
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="h-5 w-24" />
          </div>
        ) : mc.error ? (
          <p className="text-sm text-ink-muted">Currently Unavailable</p>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Users className="h-3.5 w-3.5" /> Online Players
              </span>
              <span className="font-mono font-semibold text-ink">
                {mc.players.online} / {mc.players.max}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Signal className="h-3.5 w-3.5" /> Ping
              </span>
              <span className="font-mono font-semibold text-ink">
                {mc.ping !== null ? `${mc.ping}ms` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Status</span>
              <span className={`font-semibold ${mc.online ? "text-ore" : "text-danger"}`}>
                {mc.online ? "Online" : "Offline"}
              </span>
            </div>
            {mc.version && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Version</span>
                <span className="font-mono text-xs text-ink-muted">{mc.version}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Discord card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="slot-notch border border-border bg-panel/70 p-5 shadow-slot backdrop-blur"
      >
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gold" />
          <span className="text-sm font-bold text-ink">Discord</span>
        </div>

        {!discord ? (
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-28" />
            <LoadingSkeleton className="h-5 w-20" />
          </div>
        ) : !discord.available ? (
          <p className="text-sm text-ink-muted">{discord.reason ?? "Currently Unavailable"}</p>
        ) : (
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Online</span>
              <span className="font-mono font-semibold text-ink">{discord.presenceCount ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Mic className="h-3.5 w-3.5" /> In Voice
              </span>
              <span className="font-mono font-semibold text-ink">{discord.voiceCount ?? "—"}</span>
            </div>
          </div>
        )}

        <a
          href={discordInvite}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-sm border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/20"
        >
          Join Discord <ExternalLink className="h-3 w-3" />
        </a>
      </motion.div>
    </div>
  );
}
