"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Vote, Crown, Users, Settings, LogOut, Blocks } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vote-links", label: "Vote Links", icon: Vote },
  { href: "/admin/ranks", label: "Ranks", icon: Crown },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full flex-shrink-0 border-b border-border bg-surface md:w-56 md:border-b-0 md:border-r md:min-h-screen">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-sm border border-ore/40 bg-ore/10 slot-notch-sm">
          <Blocks className="h-4 w-4 text-ore" />
        </span>
        <span className="font-pixel text-[9px] text-ink">Admin Panel</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible md:pb-4">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition ${
                active ? "bg-ore/10 text-ore" : "text-ink-muted hover:bg-panel hover:text-ink"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="mt-2 flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium text-danger/90 transition hover:bg-danger/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
