"use client";

import { MessageCircle } from "lucide-react";

export default function DiscordFloatingButton({ discordInvite }: { discordInvite: string }) {
  return (
    <a
      href={discordInvite}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Discord"
      className="group fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-ore/40 bg-panel/90 px-4 py-3 shadow-ore backdrop-blur transition hover:bg-panel"
    >
      <MessageCircle className="h-5 w-5 text-ore" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-ink transition-all duration-300 group-hover:max-w-xs">
        Join Discord
      </span>
    </a>
  );
}
