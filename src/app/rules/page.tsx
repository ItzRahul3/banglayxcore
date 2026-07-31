import { ShieldCheck, Ban, MessagesSquare, Hammer, UserX, Megaphone } from "lucide-react";

export const runtime = "edge";

export const metadata = { title: "Rules — BanglaYX CORE" };

const RULES = [
  { icon: ShieldCheck, title: "Respect Everyone", body: "Treat every player and staff member with respect. Harassment, hate speech, and discrimination are never tolerated." },
  { icon: Ban, title: "No Cheating", body: "Hacked clients, X-ray, dupe glitches, and other unfair advantages result in an immediate ban." },
  { icon: Hammer, title: "Respect Builds & Claims", body: "Griefing, stealing, or destroying unclaimed builds outside of PvP zones is prohibited." },
  { icon: MessagesSquare, title: "Keep Chat Clean", body: "No spam, excessive caps, advertising other servers, or NSFW content in chat." },
  { icon: UserX, title: "One Account Per Player", body: "Alt accounts used to bypass bans or exploit systems are not allowed." },
  { icon: Megaphone, title: "Follow Staff Instructions", body: "Staff decisions are final in-game. Disputes can be appealed politely through a Discord ticket." },
];

export default function RulesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">Keep it fair for everyone</p>
        <h1 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">Server Rules</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Breaking these rules may result in a warning, mute, kick, or ban depending on
          severity. Staff have final discretion.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {RULES.map((rule, i) => (
          <div
            key={rule.title}
            className="slot-notch flex gap-4 border border-border bg-panel/60 p-5 shadow-slot transition hover:border-ore/50"
          >
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-sm bg-ore/10 text-ore">
              <rule.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">
                Rule {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-1 text-sm font-bold text-ink">{rule.title}</h3>
              <p className="text-sm text-ink-muted">{rule.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
