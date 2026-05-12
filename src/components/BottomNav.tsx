"use client";

import { motion } from "framer-motion";
import { Home, User, Layers, Briefcase, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const items = [
  { id: "home", icon: Home, label: "Home" },
  { id: "about", icon: User, label: "About" },
  { id: "services", icon: Layers, label: "Services" },
  { id: "works", icon: Briefcase, label: "Works" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const ids = items.map(item => item.id);
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 300 && bottom >= 300) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] md:hidden w-[90%] max-w-sm">
      <div className="glass-card flex items-center justify-between px-6 py-3 rounded-2xl shadow-2xl overflow-hidden">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative flex flex-col items-center gap-1 group"
              onClick={() => setActive(item.id)}
            >
              <div 
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'scale-110 text-[var(--accent-lime)] bg-[var(--accent-lime-glow)]' 
                    : 'opacity-50 group-hover:opacity-100 text-[var(--fg)] group-hover:text-[var(--accent-lime)] group-hover:bg-[var(--accent-lime-glow)]'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="w-1 h-1 rounded-full bg-lime-400"
                  style={{ backgroundColor: "var(--accent-lime)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
