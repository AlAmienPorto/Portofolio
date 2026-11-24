"use client";

import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

interface LineShadowTextProps extends React.HTMLAttributes<HTMLElement> {
  shadowColor?: string;
  as?: React.ElementType;
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  return (
    <Component
      style={
        {
          "--shadow-color": shadowColor,
        } as CSSProperties
      }
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:left-[0.04em] after:top-[0.04em]",
        "after:content-[attr(data-text)]",
        "after:[color:var(--shadow-color)]",
        "after:[-webkit-text-fill-color:var(--shadow-color)]",
        "after:[z-index:-1]",
        className,
      )}
      data-text={children}
      {...props}
    >
      {children}
    </Component>
  );
}
