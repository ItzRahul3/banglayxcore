"use client";

import { useMemo, useState } from "react";
import { Search, Check, Crown } from "lucide-react";
import type { Rank } from "@/lib/types";

export default function RanksGrid({ ranks, discordInvite }: { ranks: Rank[]; discordInvite: string }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ranks;
    return ranks.filter((r) => r.name.toLowerCase().includes(q));
  }, [ranks, query]);

  return (
    <div>
      <div className="mx-auto mb-8 max-w-sm">
        <div className="flex items-center gap-2 rounded-sm border border-border bg-panel px-3 py-2">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ranks..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="slot-notch mx-auto max-w-md border border-border bg-panel/60 p-8 text-center text-sm text-ink-muted">
          {ranks.length === 0
            ? "No ranks are configured yet. Ask an admin to add one from the Admin Panel."
            : "No ranks match your search."}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((rank) => (
            <div
              key={rank.id}
              className="relative rounded-lg p-[1.5px]"
              style={{
                background: `linear-gradient(135deg, ${rank.gradient_from}, ${rank.gradient_to})`,
              }}
            >
              <div className="slot-notch flex h-full flex-col bg-panel p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" style={{ color: rank.gradient_from }} />
                    <h3 className="font-pixel text-[11px] text-ink">{rank.name}</h3>
                  </div>
                  {rank.badge_text && (
                    <span
                      className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        color: rank.gradient_to,
                        border: `1px solid ${rank.gradient_to}55`,
                        background: `${rank.gradient_to}15`,
                      }}
                    >
                      {rank.badge_text}
                    </span>
                  )}
                </div>

                <p className="mb-4 text-2xl font-bold text-ink">
                  {rank.currency} {rank.price}
                </p>

                <ul className="mb-5 flex-1 space-y-2">
                  {rank.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: rank.gradient_from }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-bold text-void transition hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${rank.gradient_from}, ${rank.gradient_to})`,
                  }}
                >
                  Buy Rank
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
