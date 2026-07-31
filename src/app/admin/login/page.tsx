"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Blocks, Lock } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-sm border border-ore/40 bg-ore/10 slot-notch">
          <Blocks className="h-6 w-6 text-ore" />
        </span>
        <h1 className="font-pixel text-pixel-shadow text-base text-ink">Admin Panel</h1>
        <p className="mt-2 text-sm text-ink-muted">Sign in to manage BanglaYX CORE</p>
      </div>

      <form onSubmit={handleSubmit} className="slot-notch space-y-4 border border-border bg-panel/60 p-6 shadow-slot">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-border bg-void px-3 py-2 text-sm text-ink focus:border-ore/50 focus:outline-none"
            placeholder="owner@banglayxcore.fun"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-border bg-void px-3 py-2 text-sm text-ink focus:border-ore/50 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-ore/40 bg-ore/10 px-4 py-2.5 text-sm font-semibold text-ore transition hover:bg-ore/20 disabled:opacity-50"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
