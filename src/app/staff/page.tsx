import { createClient } from "@/lib/supabase/server";
import type { StaffMember } from "@/lib/types";
import StaffGrid from "@/components/StaffGrid";

export const metadata = { title: "Staff — BanglaYX CORE" };
export const revalidate = 60;

export default async function StaffPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff")
    .select("*")
    .eq("enabled", true)
    .order("rank_weight", { ascending: true })
    .order("display_order", { ascending: true });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">The people behind the server</p>
        <h1 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">Staff Team</h1>
      </div>

      <StaffGrid staff={(staff ?? []) as StaffMember[]} />
    </section>
  );
}
