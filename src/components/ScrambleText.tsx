"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!&%$";

interface ScrambleTextProps {
  text: string;
  delay?: number;    // ms prima di partire
  speed?: number;    // ms tra ogni frame
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrambleText({
  text,
  delay = 0,
  speed = 45,
  className,
  style,
}: ScrambleTextProps) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    // Generate random char
    const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    // Start with fully scrambled
    const scrambled = text.split("").map(c => (c === " " ? " " : rand())).join("");
    setOutput(scrambled);

    const timeout = setTimeout(() => {
      let step = 0;
      const total = text.length;

      const interval = setInterval(() => {
        // Numero di caratteri "risolti" aumenta ogni ~2 frame
        const resolved = Math.min(Math.floor(step / 2), total);

        const next = text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (i < resolved) return char;          // bloccato
          return rand();                          // ancora scramble
        }).join("");

        setOutput(next);
        step++;

        if (resolved >= total) {
          setOutput(text);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span className={className} style={style}>
      {output}
    </span>
  );
}
