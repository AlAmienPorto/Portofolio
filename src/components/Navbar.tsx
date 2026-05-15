"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Home, User, Layers, Briefcase, Mail } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { usePortfolioData } from "@/lib/portfolio-context";

const navLinks = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#services", label: "Services", icon: Layers },
  { href: "#works", label: "Works", icon: Briefcase },
  { href: "#contact", label: "Contact", icon: Mail },
];

import ShineLabel from "@/components/ShineLabel";
import AnimatedThemeToggler from "@/components/AnimatedThemeToggler";

export default function Navbar() {
  const { profile } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = ["home", "about", "services", "works", "testimonials", "contact"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 160 && bottom >= 160) { setActive(id); break; }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? theme === "dark"
      ? "rgba(5,5,16,0.60)"
      : "rgba(244,243,255,0.60)"
    : "transparent";

  return (
    <>
      {/* ── TOP NAV BAR ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: navBg,
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="hover-target flex items-center gap-2">
            <ShineLabel
              text="Al Amien's Portfolio"
              fontSize="text-[10px] sm:text-xs md:text-sm"
              className="!tracking-[0.05em] sm:!tracking-[0.1em] !font-black"
            />
          </Link>

          {/* Desktop links */}

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`hover-target relative px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                        : "text-[var(--muted)] hover:text-[var(--accent-lime)] hover:bg-[var(--accent-lime-glow)]"
                    }`}
                  >
                    {/* Render icon if active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, width: 0, marginRight: 0 }}
                          animate={{ scale: 1, opacity: 1, width: 22, marginRight: 4 }}
                          exit={{ scale: 0, opacity: 0, width: 0, marginRight: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                          className="flex items-center justify-center p-1 rounded-full overflow-hidden whitespace-nowrap"
                          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                        >
                          <Icon size={14} strokeWidth={3} className="shrink-0" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {link.label}

                    {/* Active border indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid var(--accent)", zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <AnimatedThemeToggler />

            {/* CTA — desktop */}
            <a
              href="#contact"
              className="inline-flex hover-target btn-primary py-1 px-2.5 md:py-2 md:px-5 text-[9px] md:text-xs whitespace-nowrap"
              style={{ color: theme === "dark" ? "#000" : "#fff" }}
            >
              Let's Talk
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden hover-target p-2 rounded-xl"
              style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ backgroundColor: "var(--surface)" }}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-bebas, var(--font-syne))",
                  fontSize: "1.3rem",
                  letterSpacing: "0.08em",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MENU
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover-target p-2 rounded-xl transition-transform hover:rotate-90"
                style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="hover-target flex items-center gap-4 py-4 group"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <span
                        className="text-xs font-bold tabular-nums flex items-center gap-3"
                        style={{ color: "var(--accent)", fontFamily: "var(--font-manrope)" }}
                      >
                        0{i + 1}
                        <span className="flex items-center justify-center p-1.5 rounded-full" style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent)" }}>
                          <Icon size={16} strokeWidth={2.5} />
                        </span>
                      </span>
                      <span
                        className="text-4xl uppercase font-black tracking-tighter group-hover:translate-x-2 transition-transform"
                        style={{ fontFamily: "var(--font-bebas, var(--font-syne))", color: "var(--fg)", letterSpacing: "0.03em" }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-8 py-8"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Connect</p>
              <div className="flex gap-6">
                {["WhatsApp", "LinkedIn", "Instagram"].map((s) => (
                  <a key={s} href="#" className="hover-target text-sm font-bold underline underline-offset-4" style={{ color: "var(--fg)" }}>
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
