"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Parallax effect on the background and text
  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);
  const yText = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <section 
      ref={containerRef} 
      id="contact" 
      className="w-full min-h-screen bg-zinc-950 text-white relative z-10 overflow-hidden flex flex-col justify-center items-center"
    >
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 bg-black"
        // optional texture or noise could go here
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto text-center h-full">
        <motion.div style={{ y: yText }}>
          <h3 className="uppercase tracking-widest text-zinc-500 mb-8 font-bold text-sm">
            - Got a project in mind?
          </h3>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-12">
            Let's Make <br /> It Happen.
          </h2>
          
          <a 
            href="https://wa.me/6285656969189" 
            target="_blank" 
            rel="noreferrer"
            className="group relative inline-flex items-center justify-center w-48 h-48 bg-white text-black rounded-full hover-target overflow-hidden"
          >
            <div className="absolute inset-0 bg-zinc-200 transform scale-0 group-hover:scale-150 transition-transform duration-500 ease-out rounded-full" />
            <span className="relative z-10 font-bold uppercase tracking-widest text-lg group-hover:scale-110 transition-transform duration-300">
              WhatsApp
            </span>
          </a>
        </motion.div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.footer 
      ref={footerRef}
      style={{ y, opacity }}
      className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-end z-20"
    >
      <div className="flex gap-8 mb-8 md:mb-0 w-full md:w-auto overflow-hidden">
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">© 2026 IfalEX.</p>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Developed with Next.js</p>
      </div>
      <div>
        <h1 className="text-[12vw] leading-none font-black uppercase tracking-tighter text-zinc-800 pointer-events-none user-select-none mix-blend-screen">
          IfalEX
        </h1>
      </div>
    </motion.footer>
  );
}
