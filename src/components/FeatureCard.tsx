"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="slot-notch group relative border border-border bg-panel/60 p-5 shadow-slot transition hover:border-ore/50 hover:bg-panel"
    >
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-sm bg-ore/10 text-ore transition group-hover:bg-ore/20">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-bold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
    </motion.div>
  );
}
