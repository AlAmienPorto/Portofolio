"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}

/**
 * Editorial section header: an indexed meta rail on top, an oversized
 * display title, and an optional intro / aside on the right.
 */
export default function SectionHeader({ index, label, title, intro, aside }: SectionHeaderProps) {
  return (
    <header className="mb-14 md:mb-20">
      {/* Meta rail */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 pb-4 mb-8 md:mb-10 border-b hairline"
      >
        <span className="meta-label tabular-nums" style={{ color: "var(--accent)" }}>
          ({index})
        </span>
        <span className="meta-label">{label}</span>
        <span className="flex-1" />
        {aside && <span className="meta-label hidden sm:inline">{aside}</span>}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
        <div className="lg:col-span-8 overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display uppercase"
            style={{ fontSize: "clamp(3.25rem, 9vw, 8.5rem)", color: "var(--fg)" }}
          >
            {title}
          </motion.h2>
        </div>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 text-base md:text-lg leading-relaxed max-w-md lg:pb-3"
            style={{ color: "var(--muted)" }}
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
