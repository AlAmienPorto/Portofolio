"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: 1, title: "Quantum Nexus", category: "Web App / Dashboard", image: "/projects/1.png" },
  { id: 2, title: "Finance Flow", category: "Fintech Platform", image: "/projects/2.png" },
  { id: 3, title: "Velour", category: "E-commerce Experience", image: "/projects/3.png" },
  { id: 4, title: "Alex Chen", category: "3D Portfolio", image: "/projects/4.png" }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} id="works" className="w-full bg-black text-white py-32 px-4 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <h3 className="uppercase tracking-widest text-zinc-500 mb-4 font-bold text-sm">
              - Selected Works
            </h3>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
              Projects
            </h2>
          </div>
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            className="hover-target flex items-center gap-2 pb-2 border-b-2 border-white text-xl font-bold uppercase tracking-widest"
          >
            See All <ArrowUpRight />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`relative group ${index % 2 !== 0 ? "md:mt-32" : ""}`}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900 rounded-sm cursor-none hover-target"
      >
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />

        {/* Interactive Hover Glow */}
        {isHovered && (
          <div 
            className="absolute rounded-full pointer-events-none mix-blend-screen opacity-50 blur-3xl w-64 h-64 bg-white/30"
            style={{
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        <div className="absolute bottom-0 left-0 p-8 w-full z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-3">{project.category}</p>
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{project.title}</h3>
        </div>
      </div>
    </motion.div>
  );
}
