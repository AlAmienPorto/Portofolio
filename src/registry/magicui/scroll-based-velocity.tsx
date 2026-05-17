"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Safe wrap function in case framer-motion doesn't export it
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function ScrollVelocityContainer({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  style,
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-10, 0, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = direction * baseVelocity * (delta / 1000);

    // Change directionFactor based on scroll velocity
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Render 10 copies. -10% of total width equals exactly 1 copy width.
  return (
    <div className={cn("flex whitespace-nowrap", className)} style={style}>
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="block pr-[4rem]">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
