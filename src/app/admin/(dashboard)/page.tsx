import { Vote, Crown, Users, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard — Admin" };

async function getCounts() {
  const supabase = await createClient();
  const [voteLinks, ranks, staff, visits] = await Promise.all([
    supabase.from("vote_links").select("id", { count: "exact", head: true }),
    supabase.from("ranks").select("id", { count: "exact", head: true }),
    supabase.from("staff").select("id", { count: "exact", head: true }),
    supabase.from("website_visits").select("id", { count: "exact", head: true }),
  ]);

  return {
    voteLinks: voteLinks.count ?? 0,
    ranks: ranks.count ?? 0,
    staff: staff.count ?? 0,
    visits: visits.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const stats = [
    { label: "Total Vote Sites", value: counts.voteLinks, icon: Vote, color: "text-ore" },
    { label: "Total Ranks", value: counts.ranks, icon: Crown, color: "text-gold" },
    { label: "Total Staff", value: counts.staff, icon: Users, color: "text-ore" },
    { label: "Website Visits", value: counts.visits, icon: Eye, color: "text-gold" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-pixel text-pixel-shadow text-lg text-ink">Dashboard</h1>
      <p className="mb-8 text-sm text-ink-muted">Overview of BanglaYX CORE</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="slot-notch border border-border bg-panel/60 p-5 shadow-slot"
          >
            <stat.icon className={`mb-3 h-5 w-5 ${stat.color}`} />
            <p className="text-2xl font-bold text-ink">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
