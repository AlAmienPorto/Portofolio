"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "IfalEX completely reimagined our digital presence. The scrollytelling experience he built increased our user engagement by 300%.",
    author: "Sarah Jenkins",
    role: "Creative Director at Nexus Design"
  },
  {
    quote: "Working with someone who understands both the deep technical aspects and the high-end creative direction is rare. An absolute professional.",
    author: "Marcus Aurelius",
    role: "Founder, Stoic Tech"
  },
  {
    quote: "The interactive WebGL portfolio he developed for us won Site of the Month. He is a motion wizard.",
    author: "Elena Rodriguez",
    role: "Lead Producer, Awwwards"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-black text-white py-32 px-8 md:px-24 relative z-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <h3 className="uppercase tracking-widest text-zinc-500 mb-20 font-bold text-center text-sm">
          - What They Say
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col justify-between"
            >
              <p className="text-xl md:text-3xl font-bold italic leading-relaxed text-zinc-300 mb-8">
                &quot;{testi.quote}&quot;
              </p>
              <div>
                <p className="font-bold uppercase tracking-widest text-white">{testi.author}</p>
                <p className="text-zinc-500 text-sm">{testi.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
