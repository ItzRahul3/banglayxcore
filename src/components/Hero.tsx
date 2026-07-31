"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Vote, Crown, MessagesSquare } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import LiveStatusCards from "@/components/LiveStatusCards";
import type { SiteSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 ore-veins"
        style={
          settings.hero_background_url
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(10,13,10,0.55), rgba(10,13,10,0.92)), url(${settings.hero_background_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-block rounded-sm border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs tracking-wide text-gold"
        >
          ⛏ Season 1 is live now
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-pixel text-pixel-shadow text-[28px] leading-[1.5] text-ink sm:text-[38px] lg:text-[46px]"
        >
          <span className="text-ore">{settings.server_name.split(" ")[0]}</span>{" "}
          {settings.server_name.split(" ").slice(1).join(" ")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg"
        >
          {settings.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <CopyButton value={settings.java_ip} label={`Join: ${settings.java_ip}`} className="!px-4 !py-2.5 !text-sm" />
          <Link
            href="/vote"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold/50 hover:text-gold"
          >
            <Vote className="h-4 w-4" /> Vote
          </Link>
          <Link
            href="/ranks"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold/50 hover:text-gold"
          >
            <Crown className="h-4 w-4" /> Ranks
          </Link>
          <a
            href={settings.discord_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ore/50 hover:text-ore"
          >
            <MessagesSquare className="h-4 w-4" /> Discord
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2"
        >
          <div className="slot-notch-sm flex items-center justify-between border border-border bg-panel/60 px-4 py-3 backdrop-blur">
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-widest text-ink-faint">Java Edition</p>
              <p className="font-mono text-sm text-ink">{settings.java_ip}</p>
            </div>
            <CopyButton value={settings.java_ip} label="Copy" />
          </div>
          <div className="slot-notch-sm flex items-center justify-between border border-border bg-panel/60 px-4 py-3 backdrop-blur">
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-widest text-ink-faint">Bedrock Edition</p>
              <p className="font-mono text-sm text-ink">
                {settings.bedrock_ip}:{settings.bedrock_port}
              </p>
            </div>
            <CopyButton value={`${settings.bedrock_ip}:${settings.bedrock_port}`} label="Copy" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <LiveStatusCards discordInvite={settings.discord_invite} />
        </motion.div>
      </div>
    </section>
  );
}
