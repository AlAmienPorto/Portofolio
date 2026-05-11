"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  fontSize?: string;
}

export default function ShineLabel({ text, className = "", fontSize = "text-xs" }: Props) {
  return (
    <div 
      className={`inline-block text-transparent bg-clip-text font-medium tracking-[0.2em] uppercase animate-shine ${fontSize} ${className}`}
      style={{ 
        backgroundSize: "200% 100%", 
        backgroundClip: "text", 
        animationDuration: "3s",
        fontFamily: "var(--font-syne)",
        backgroundImage: "var(--shine-gradient)"
      }}
    >
      {text}
    </div>
  );
}


