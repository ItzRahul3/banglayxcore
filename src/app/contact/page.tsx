import { MessageSquare, Server } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "Contact — BanglaYX CORE" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">Get in touch</p>
        <h1 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          The fastest way to reach the team is Discord — support tickets, rank
          purchases, and appeals all go through there.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="slot-notch flex flex-col items-center gap-3 border border-border bg-panel/60 p-8 text-center shadow-slot">
          <div className="grid h-12 w-12 place-items-center rounded-sm bg-ore/10 text-ore">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-ink">Discord</h3>
          <p className="text-sm text-ink-muted">Join our community and open a support ticket.</p>
          <a
            href={settings.discord_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore transition hover:bg-ore/20"
          >
            Join Discord
          </a>
        </div>

        <div className="slot-notch flex flex-col items-center gap-3 border border-border bg-panel/60 p-8 text-center shadow-slot">
          <div className="grid h-12 w-12 place-items-center rounded-sm bg-gold/10 text-gold">
            <Server className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-ink">Server IP</h3>
          <p className="font-mono text-sm text-ink-muted">{settings.java_ip}</p>
          <CopyButton value={settings.java_ip} label="Copy IP" className="mt-2" />
        </div>
      </div>
    </section>
  );
}
