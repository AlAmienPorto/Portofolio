"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity";

export default function VelocityScrollSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16">
      <ScrollVelocityContainer
        className="text-4xl font-black tracking-tighter md:text-7xl leading-[0.8] uppercase flex flex-col justify-center"
        style={{ fontFamily: "var(--font-syne)", color: "var(--fg)" }}
      >
        <ScrollVelocityRow baseVelocity={1} direction={1} className="z-10">
          IN OMNIA <span style={{ color: "var(--accent-lime)" }}>PARATUS</span>
        </ScrollVelocityRow>
        <ScrollVelocityRow
          baseVelocity={1}
          direction={-1}
          className="mt-2 md:mt-4 text-transparent stroke-text z-0"
          style={{ WebkitTextStroke: "1px var(--fg)", color: "transparent" }}
        >
          A CREATIVE DEVELOPER
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      {/* Gradient edges for fading effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10" />
    </section>
  );
}
