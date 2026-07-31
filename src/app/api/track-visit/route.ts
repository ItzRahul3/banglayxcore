import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    const supabase = createAdminClient();
    await supabase.from("website_visits").insert({ path: path || "/" });
    return NextResponse.json({ ok: true });
  } catch {
    // Visit tracking failing should never break the page.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
