"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!textRef.current) return;

    // Split text into lines/words/chars
    const text = new SplitType(textRef.current, { types: "chars,words,lines" });

    // Initial state: chars hidden
    gsap.set(text.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
    });

    // Reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play reverse play reverse",
      },
    });

    tl.to(text.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.02,
      duration: 1,
      ease: "power3.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      text.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="w-full min-h-screen bg-black text-white flex items-center justify-center p-8 md:p-24 relative z-10"
    >
      <div className="max-w-6xl w-full">
        <h3 className="uppercase tracking-widest text-zinc-500 mb-12 font-bold text-sm md:text-base selection:bg-zinc-800">
          - About Me
        </h3>
        
        <h2 
          ref={textRef} 
          className="text-4xl md:text-7xl font-bold uppercase leading-[1.1] tracking-tight perspective-1000"
        >
          I am a hyper-focused creative developer blending design and engineering to build immersive digital experiences that push the boundaries of the modern web.
        </h2>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-zinc-400 text-lg md:text-2xl leading-relaxed">
              With a strong foundation in modern JavaScript frameworks and a keen eye for motion design, I transform complex technical requirements into elegant, award-winning interfaces.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-t border-zinc-800 pt-6">
              <span className="block text-zinc-500 uppercase text-xs font-bold tracking-widest mb-2">Location</span>
              <span className="text-xl uppercase font-bold">Indonesia</span>
            </div>
            <div className="border-t border-zinc-800 pt-6">
              <span className="block text-zinc-500 uppercase text-xs font-bold tracking-widest mb-2">Experience</span>
              <span className="text-xl uppercase font-bold">5+ Years in Digital Production</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
