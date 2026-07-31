import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVICE ROLE client — bypasses RLS. Never import this into client components.
// Only use inside API route handlers (src/app/api/**) for trusted server logic,
// e.g. logging website_visits in bulk or admin-only aggregate stats.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
