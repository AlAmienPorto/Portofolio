"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, X, Tag, Calendar } from "lucide-react";
import { usePortfolioData, type Project } from "@/lib/portfolio-context";

const PROJECT_COLORS = ["#7c6fff", "#ff6fbb", "#6ff0ff", "#ffb86f", "#4ade80", "#f472b6"];

import ShineLabel from "@/components/ShineLabel";

export default function Projects() {
  const { projects } = usePortfolioData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(false);
    dragDistance.current = 0;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    dragDistance.current = Math.abs(walk);
    if (dragDistance.current > 5) setIsDragging(true);
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleCardClick = (project: Project) => {
    if (dragDistance.current < 8) setSelectedProject(project);
  };

  return (
    <section
      id="works"
      className="relative w-full py-24 md:py-40 overflow-hidden"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-4"
            >
              <ShineLabel text="✦ Selected Works" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "var(--font-bebas, var(--font-syne))",
                fontSize: "clamp(3rem, 7vw, 6rem)",
                letterSpacing: "0.03em",
                color: "var(--fg)",
                lineHeight: 1,
              }}
            >
              PROJECTS
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"
            style={{ color: "var(--muted)" }}
          >
            Click a card for details
            <ArrowUpRight size={14} />
          </motion.p>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="h-scroll-container px-6 md:px-16"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => handleCardClick(project)}
          />
        ))}

        {/* End spacer */}
        <div
          className="glass-card rounded-2xl flex-shrink-0 flex flex-col items-center justify-center gap-4 p-8"
          style={{ width: "240px", aspectRatio: "3/4", minHeight: "380px" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-glow)", border: "1px solid var(--border)" }}
          >
            <ArrowUpRight size={22} style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-center font-bold uppercase tracking-wider text-xs" style={{ color: "var(--muted)" }}>
            More Coming Soon
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 mt-4">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          ← Drag to explore → · Click to open
        </p>
      </div>

      {/* ── PROJECT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-[70]"
              style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(12px)" }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed z-[80] inset-4 md:inset-[10%] rounded-2xl overflow-hidden flex flex-col md:flex-row"
              style={{
                backgroundColor: "var(--surface)",
                border: `1px solid ${selectedProject.color}30`,
                maxHeight: "90vh",
              }}
            >
              {/* Image side */}
              <div className="relative w-full md:w-1/2 flex-shrink-0" style={{ minHeight: "250px" }}>
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Gradient on image */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, transparent 60%, var(--surface))`,
                  }}
                />
                {/* Color accent blob */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${selectedProject.color}, transparent 70%)`,
                  }}
                />
              </div>

              {/* Content side */}
              <div className="flex-1 flex flex-col p-8 md:p-10 overflow-y-auto">
                {/* Close */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="hover-target w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Category */}
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-3 inline-block px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${selectedProject.color}18`,
                    color: selectedProject.color,
                    border: `1px solid ${selectedProject.color}35`,
                  }}
                >
                  {selectedProject.category}
                </span>

                {/* Title */}
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-bebas, var(--font-syne))",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    letterSpacing: "0.03em",
                    lineHeight: 1,
                    color: "var(--fg)",
                  }}
                >
                  {selectedProject.title}
                </h2>

                {/* Description */}
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-manrope)" }}
                >
                  {selectedProject.description}
                </p>

                {/* Meta info */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} style={{ color: "var(--accent)" }} />
                    <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>
                      Year: <span style={{ color: "var(--fg)" }}>{selectedProject.year}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag size={14} style={{ color: "var(--accent)" }} />
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${selectedProject.color}15`,
                            color: selectedProject.color,
                            border: `1px solid ${selectedProject.color}30`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={selectedProject.link.startsWith("http") || selectedProject.link.startsWith("/") || selectedProject.link === "#" ? selectedProject.link : `https://${selectedProject.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary hover-target flex-1 justify-center"
                    style={{ textDecoration: "none" }}
                  >
                    <ExternalLink size={15} />
                    Live Preview
                  </a>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn-outline hover-target px-5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="flex-shrink-0 hover-target"
      style={{ width: "clamp(260px, 30vw, 360px)" }}
      onClick={onClick}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "3/4",
          backgroundColor: "var(--surface-2)",
          border: hovered ? `1px solid ${project.color}55` : "1px solid var(--border)",
          transition: "border-color 0.3s ease, transform 0.3s ease",
          transform: hovered ? "scale(1.02)" : "scale(1)",
        }}
      >
        {/* Image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          style={{
            opacity: hovered ? 0.9 : 0.65,
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--surface-2) 10%, transparent 80%)", opacity: 0.9 }}
        />

        {/* Color glow on hover */}
        {hovered && (
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(circle at 50% 80%, ${project.color}, transparent 60%)` }}
          />
        )}

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top: Year + "Click" hint */}
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full glass-card"
              style={{ color: "var(--muted)" }}
            >
              {project.year}
            </span>
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: project.color, color: "#000" }}
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </div>

          {/* Bottom: Info */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${project.color}20`, color: project.color, border: `1px solid ${project.color}30` }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: project.color }}>
              {project.category}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-bebas, var(--font-syne))",
                fontSize: "1.9rem",
                letterSpacing: "0.03em",
                lineHeight: 1,
                color: "var(--fg)",
              }}
            >
              {project.title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
