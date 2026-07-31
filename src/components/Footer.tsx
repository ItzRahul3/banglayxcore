import Link from "next/link";
import { Blocks } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-panel border border-ore/40 slot-notch-sm">
                <Blocks className="h-4 w-4 text-ore" />
              </span>
              <span className="font-pixel text-[9px] text-ink">{settings.server_name}</span>
            </div>
            <p className="text-sm text-ink-muted">
              A premium Bangladeshi Minecraft survival server built for a friendly,
              lag-free community.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><Link href="/vote" className="hover:text-ore">Vote</Link></li>
              <li><Link href="/ranks" className="hover:text-ore">Ranks</Link></li>
              <li><Link href="/rules" className="hover:text-ore">Rules</Link></li>
              <li><Link href="/staff" className="hover:text-ore">Staff</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <a href={settings.discord_invite} target="_blank" rel="noopener noreferrer" className="hover:text-ore">
                  Discord
                </a>
              </li>
              <li><Link href="/contact" className="hover:text-ore">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
              Connect
            </h4>
            <p className="font-mono text-sm text-ink-muted">Java: {settings.java_ip}</p>
            <p className="font-mono text-sm text-ink-muted">
              Bedrock: {settings.bedrock_ip}:{settings.bedrock_port}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} {settings.server_name}. Not affiliated with Mojang or Microsoft.
        </div>
      </div>
    </footer>
  );
}
