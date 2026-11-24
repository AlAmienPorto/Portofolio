"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
