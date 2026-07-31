import Link from "next/link";
import { Compass } from "lucide-react";

export const runtime = "edge";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-sm border border-ore/40 bg-ore/10 slot-notch">
        <Compass className="h-8 w-8 text-ore" />
      </div>
      <h1 className="font-pixel text-pixel-shadow text-2xl text-ink">404</h1>
      <p className="mt-3 text-sm text-ink-muted">
        You've wandered off the map. This chunk hasn't been generated yet.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm border border-ore/40 bg-ore/10 px-5 py-2.5 text-sm font-semibold text-ore transition hover:bg-ore/20"
      >
        Back to Spawn
      </Link>
    </section>
  );
}
