"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, AtSign } from "lucide-react";
import type { StaffMember } from "@/lib/types";

export default function StaffGrid({ staff }: { staff: StaffMember[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)
    );
  }, [staff, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, StaffMember[]>();
    for (const member of filtered) {
      const list = map.get(member.role) ?? [];
      list.push(member);
      map.set(member.role, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <div className="mx-auto mb-8 max-w-sm">
        <div className="flex items-center gap-2 rounded-sm border border-border bg-panel px-3 py-2">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="slot-notch mx-auto max-w-md border border-border bg-panel/60 p-8 text-center text-sm text-ink-muted">
          {staff.length === 0
            ? "Staff members haven't been added yet."
            : "No staff match your search."}
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([role, members]) => (
            <div key={role}>
              <h2 className="mb-4 font-pixel text-[11px] text-gold">{role}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="slot-notch flex flex-col items-center gap-2 border border-border bg-panel/60 p-5 text-center shadow-slot transition hover:border-ore/50"
                  >
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-sm border border-border object-cover"
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-sm border border-border bg-panel-2 font-pixel text-sm text-ore">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm font-bold text-ink">{member.name}</p>
                    {member.discord_username && (
                      <p className="flex items-center gap-1 text-xs text-ink-muted">
                        <AtSign className="h-3 w-3" /> {member.discord_username}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
