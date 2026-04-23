"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#works", label: "Works" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-40 mix-blend-difference">
        <div className="text-white font-bold text-xl uppercase tracking-widest">
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-white hover-target p-2 focus:outline-none"
        >
          <Menu size={32} />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
            animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            exit={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 bg-zinc-900 text-white flex flex-col justify-between p-6 md:p-10"
          >
            <div className="flex justify-between items-center">
              <div className="font-bold text-xl uppercase tracking-widest">
                IfalEX
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover-target p-2 focus:outline-none transition-transform hover:rotate-90"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between h-full py-20 px-4 md:px-20">
              <ul className="flex flex-col gap-4 md:gap-8 justify-center h-full">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                    onClick={() => setIsOpen(false)}
                    className="overflow-hidden"
                  >
                    <Link
                      href={link.href}
                      className="text-5xl md:text-8xl uppercase font-black hover:text-zinc-500 transition-colors inline-block hover-target"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col justify-end gap-12 max-w-sm pb-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-zinc-500 uppercase text-sm font-bold tracking-widest mb-4">
                    About
                  </h3>
                  <p className="text-lg leading-relaxed">
                    A world-class Creative Developer specializing in Next.js, Motion,
                    and web interactions crafting high-end digital experiences.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-zinc-500 uppercase text-sm font-bold tracking-widest mb-4">
                    Socials
                  </h3>
                  <div className="flex gap-6">
                    <a href="https://wa.me/6285656969189" target="_blank" rel="noreferrer" className="hover-target hover:text-zinc-400 underline underline-offset-4">WhatsApp</a>
                    <a href="#" className="hover-target hover:text-zinc-400 underline underline-offset-4">LinkedIn</a>
                    <a href="#" className="hover-target hover:text-zinc-400 underline underline-offset-4">Instagram</a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
