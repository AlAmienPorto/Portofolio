"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { usePortfolioData } from "@/lib/portfolio-context";

export default function FAB() {
  const { profile, socials } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = socials.whatsapp || `https://wa.me/${profile.whatsapp?.replace(/\D/g, "")}`;

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card p-4 rounded-2xl shadow-2xl mb-2 w-64"
          >
            <p className="text-sm font-bold mb-3" style={{ color: "var(--fg)" }}>
              Need help with a project?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              style={{ 
                backgroundColor: "var(--accent-lime)", 
                color: "#000",
                boxShadow: "0 0 20px var(--shadow-lime)" 
              }}
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative group"
        style={{ 
          backgroundColor: isOpen ? "var(--surface)" : "var(--accent-lime)",
          color: isOpen ? "var(--fg)" : "#000",
          border: isOpen ? "1px solid var(--border)" : "none",
          boxShadow: isOpen ? "none" : "0 0 30px var(--shadow-lime)"
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050510] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
