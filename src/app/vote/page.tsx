import { ExternalLink, Key, Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { VoteLink } from "@/lib/types";
import Image from "next/image";

export const runtime = "edge";

export const metadata = { title: "Vote — BanglaYX CORE" };
export const revalidate = 60;

export default async function VotePage() {
  const supabase = await createClient();
  const { data: voteLinks } = await supabase
    .from("vote_links")
    .select("*")
    .eq("enabled", true)
    .order("display_order", { ascending: true });

  const links = (voteLinks ?? []) as VoteLink[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">Support the server</p>
        <h1 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">Vote for BanglaYX CORE</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Voting takes seconds and helps more players find the server. Vote on every site
          below once every 24 hours for the full rewards.
        </p>
      </div>

      {links.length === 0 ? (
        <div className="slot-notch mx-auto max-w-md border border-border bg-panel/60 p-8 text-center text-sm text-ink-muted">
          No vote sites are configured yet. Check back soon, or ask an admin to add one
          from the Admin Panel.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="slot-notch flex flex-col border border-border bg-panel/60 p-5 shadow-slot transition hover:border-ore/50"
            >
              <div className="mb-3 flex items-center gap-3">
                {link.logo_url ? (
                  <Image
                    src={link.logo_url}
                    alt={link.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-sm border border-border object-cover"
                  />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-panel-2 font-pixel text-[10px] text-ore">
                    {link.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <h3 className="text-sm font-bold text-ink">{link.name}</h3>
              </div>

              <p className="mb-4 flex-1 text-sm text-ink-muted">{link.description}</p>

              <div className="mb-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-sm border border-gold/30 bg-gold/10 px-2 py-1 text-gold">
                  <Key className="h-3 w-3" /> {link.reward_key_amount} Vote Key
                </span>
                <span className="inline-flex items-center gap-1 rounded-sm border border-ore/30 bg-ore/10 px-2 py-1 text-ore">
                  <Coins className="h-3 w-3" /> ${link.reward_money_amount}
                </span>
              </div>

              <a
                href={link.vote_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore transition hover:bg-ore/20"
              >
                Vote Now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
