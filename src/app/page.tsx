import {
  Package, Coins, Swords, MapPinned, Briefcase, Gift,
  ThumbsUp, Boxes, Shuffle, Users2, Gauge,
} from "lucide-react";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import { getSiteSettings } from "@/lib/settings";

const FEATURES = [
  { icon: Package, title: "Keep Inventory Enabled", description: "Never lose your gear on death — jump back into the action instantly." },
  { icon: Coins, title: "Economy Survival", description: "Buy, sell, and trade in a player-driven in-game economy." },
  { icon: Swords, title: "PvP Arena", description: "Test your skills in dedicated arenas built for fair, fast-paced combat." },
  { icon: MapPinned, title: "Land Claim", description: "Protect your builds and base with simple, reliable land claiming." },
  { icon: Briefcase, title: "Jobs", description: "Earn steady income with a range of in-game jobs and professions." },
  { icon: Gift, title: "Daily Rewards", description: "Log in every day to claim free crates, cash, and items." },
  { icon: ThumbsUp, title: "Vote Rewards", description: "Vote on top server lists and get rewarded instantly." },
  { icon: Boxes, title: "Crates", description: "Unlock exclusive cosmetics, gear, and keys from our crate system." },
  { icon: Shuffle, title: "Random Teleport", description: "Explore fresh, unclaimed terrain with a single command." },
  { icon: Users2, title: "Friendly Community", description: "A welcoming Bangladeshi community that keeps gameplay fun and fair." },
  { icon: Gauge, title: "Lag Free Gameplay", description: "Optimized hardware and network for smooth, stable performance." },
];

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero settings={settings} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            What's inside
          </p>
          <h2 className="font-pixel text-pixel-shadow text-xl text-ink sm:text-2xl">
            Server Features
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              index={i}
              icon={<f.icon className="h-5 w-5" />}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}
