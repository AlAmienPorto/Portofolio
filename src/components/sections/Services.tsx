"use client";

import { motion } from "framer-motion";
import { Code2, PenTool, Layout, MonitorSmartphone } from "lucide-react";

const services = [
  {
    title: "Creative Development",
    description: "Building immersive, interactive web experiences using WebGL, Three.js, and complex GSAP/Motion animations that win awards.",
    icon: Code2
  },
  {
    title: "Front-End Engineering",
    description: "Architecting scalable and performant React applications with Next.js, TypeScript, and state-of-the-art tools.",
    icon: Layout
  },
  {
    title: "Motion Design",
    description: "Crafting fluid micro-interactions and scroll-linked animations that breathe life into digital products.",
    icon: PenTool
  },
  {
    title: "Responsive UX/UI",
    description: "Ensuring pixel-perfect implementations that work flawlessly seamlessly across all devices and screen sizes.",
    icon: MonitorSmartphone
  }
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-black text-white py-24 px-8 md:px-24 relative z-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h3 className="uppercase tracking-widest text-zinc-500 mb-4 font-bold text-sm">
              - Expertise
            </h3>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              Services
            </h2>
          </div>
          <p className="text-xl text-zinc-400 max-w-md uppercase font-bold leading-relaxed">
            Delivering high-performance digital solutions tailored to elevate your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black p-10 md:p-16 hover:bg-zinc-950 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <service.icon className="w-12 h-12 text-zinc-500 mb-8 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-3xl font-black uppercase mb-6">{service.title}</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
