"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, MessageCircle, Mail, MapPin } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

import ShineLabel from "@/components/ShineLabel";

export default function Contact() {
  const { profile, socials } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi ${profile.name.split(" ")[0] || "Jawad"},\n\nMy name is ${name} and I'm reaching out via your portfolio.\n\n${message}\n\nBest regards,\n${name}\n${email}`
    );
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(124,111,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-24 py-24 md:py-40">
        <div className="w-full max-w-5xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex justify-center"
          >
            <ShineLabel text="Let's Build Together" />
          </motion.div>

          {/* Big heading */}
          <motion.h2
            className="text-center font-black uppercase tracking-tighter leading-none mb-16"
            style={{
              y: yText,
              opacity: opacityText,
              fontFamily: "var(--font-syne)",
              fontSize: "clamp(2.4rem, 9vw, 7rem)",
              color: "var(--fg)",
            } as any}
          >
            Got a{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-lime))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Project?
            </span>

            <br />
            Let's Make
            <br />
            It Happen.
          </motion.h2>

          {/* Two column: form + info */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      fontFamily: "var(--font-manrope)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c6fff")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      fontFamily: "var(--font-manrope)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c6fff")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                  Your Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                    fontFamily: "var(--font-manrope)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7c6fff")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,111,255,0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary hover-target self-start"
              >
                {sent ? "✓ Message Sent!" : (
                  <>
                    <Send size={16} />
                    Send Message via Gmail
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
                  Or reach out directly
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href={socials.whatsapp || `https://wa.me/${profile.whatsapp?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover-target glass-card flex items-center gap-4 p-4 rounded-xl group"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(74,222,128,0.1)" }}
                    >
                      <MessageCircle size={18} style={{ color: "#4ade80" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        WhatsApp
                      </p>
                      <p className="text-sm font-bold group-hover:text-[#7c6fff] transition-colors" style={{ color: "var(--fg)" }}>
                        {profile.whatsapp || "+62 ..."}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${profile.email}`}
                    className="hover-target glass-card flex items-center gap-4 p-4 rounded-xl group"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(124,111,255,0.1)" }}
                    >
                      <Mail size={18} style={{ color: "#7c6fff" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Email (Gmail)
                      </p>
                      <p className="text-sm font-bold group-hover:text-[#7c6fff] transition-colors" style={{ color: "var(--fg)" }}>
                        {profile.email || "hello@example.com"}
                      </p>
                    </div>
                  </a>

                  <div
                    className="glass-card flex items-center gap-4 p-4 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,111,187,0.1)" }}
                    >
                      <MapPin size={18} style={{ color: "#ff6fbb" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Location
                      </p>
                      <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>
                        {profile.location || "Indonesia 🇮🇩"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { profile, socials } = usePortfolioData();
  return (
    <footer
      className="w-full px-6 md:px-24 py-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        <span>© 2026 {profile.name}</span>

      </div>

      <div
        className="text-[8vw] md:text-[5vw] font-black uppercase tracking-tighter leading-none pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-syne)",
          background: "linear-gradient(135deg, rgba(124,111,255,0.15), rgba(255,111,187,0.15))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        je.el porto
      </div>

      <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
        {[
          { label: "WhatsApp", link: socials.whatsapp },
          { label: "LinkedIn", link: socials.linkedin },
          { label: "Instagram", link: socials.instagram },
          { label: "GitHub", link: socials.github }
        ].filter(s => s.link && s.link !== "#").map((s) => (
          <a
            key={s.label}
            href={s.link}
            target="_blank"
            rel="noreferrer"
            className="hover-target transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#7c6fff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--muted)")}
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
