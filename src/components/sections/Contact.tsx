"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, MessageCircle, Mail, MapPin, ArrowUpRight, ArrowUp } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";
import { Input } from "@/components/ui/input";


export default function Contact() {
  const { profile, socials } = usePortfolioData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [120, 0]);

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
            "radial-gradient(ellipse at 50% 80%, rgba(190,242,100,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-24 md:py-36">
        <div className="w-full max-w-7xl mx-auto">
          {/* Meta rail */}
          <div className="flex items-center gap-4 pb-4 mb-10 md:mb-14 border-b hairline">
            <span className="meta-label" style={{ color: "var(--accent)" }}>(06)</span>
            <span className="meta-label">Contact</span>
            <span className="flex-1" />
            <span className="meta-label hidden sm:inline">{profile.availability || "Open to projects"}</span>
          </div>

          {/* Layered stage: giant heading sits behind the form card */}
          <div className="relative">
            <motion.h2
              aria-label="Got a project? Let's make it happen."
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8 }}
              className="absolute inset-x-0 top-0 z-0 font-display uppercase text-center select-none pointer-events-none"
              style={{
                y: yText,
                fontSize: "clamp(4.25rem, 15.5vw, 14rem)",
                lineHeight: 0.84,
                color: "var(--fg)",
              }}
            >
              <span className="block">
                Got a <span style={{ color: "var(--accent)" }}>project?</span>
              </span>
              <span className="block text-outline" style={{ WebkitTextStroke: "1.5px var(--line-strong)" }}>
                Let&apos;s make
              </span>
              <span className="block text-outline" style={{ WebkitTextStroke: "1.5px var(--line-strong)" }}>
                it happen.
              </span>
            </motion.h2>

          {/* Two column: form + info, as a frosted card over the heading */}
          <div
            className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 p-6 md:p-10 rounded-2xl border hairline"
            style={{
              marginTop: "clamp(4.5rem, 14vw, 12.5rem)",
              backgroundColor: "color-mix(in srgb, var(--surface) 72%, transparent)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 30px 80px -30px var(--shadow)",
            }}
          >
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
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ fontFamily: "var(--font-manrope)" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ fontFamily: "var(--font-manrope)" }}
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
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px var(--accent-glow)" }}
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
                      style={{ backgroundColor: "var(--accent-glow)" }}
                    >
                      <MessageCircle size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        WhatsApp
                      </p>
                      <p className="text-sm font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
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
                      style={{ backgroundColor: "var(--accent-glow)" }}
                    >
                      <Mail size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Email (Gmail)
                      </p>
                      <p className="text-sm font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                        {profile.email || "hello@example.com"}
                      </p>
                    </div>
                  </a>

                  <div
                    className="glass-card flex items-center gap-4 p-4 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--accent-glow)" }}
                    >
                      <MapPin size={18} style={{ color: "var(--accent)" }} />
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
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { profile, socials } = usePortfolioData();
  const links = [
    { label: "Instagram", link: socials.instagram },
    { label: "LinkedIn", link: socials.linkedin },
    { label: "GitHub", link: socials.github },
    { label: "WhatsApp", link: socials.whatsapp },
  ].filter((s) => s.link && s.link !== "#");
  const name = profile.name || "Jawad Al Amien";

  return (
    <footer className="relative z-10 w-full px-6 md:px-12 pt-10 pb-28 md:pb-8 border-t hairline overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((s) => (
              <li key={s.label}>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 font-grotesk text-sm font-medium transition-colors duration-200 text-[var(--fg)] hover:text-[var(--accent)]"
                >
                  {s.label}
                  <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="self-start md:self-auto inline-flex items-center gap-2 h-11 px-5 rounded-full font-grotesk text-sm font-medium transition-colors duration-200 text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
            style={{ border: "1px solid var(--line-strong)" }}
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>

        <p
          aria-hidden
          className="font-display uppercase whitespace-nowrap select-none mt-10 md:mt-14 -mb-[0.12em] text-center"
          style={{ fontSize: "clamp(3rem, 15.2vw, 13.5rem)", lineHeight: 0.8, color: "var(--fg)" }}
        >
          {name}
          <span style={{ color: "var(--accent)" }}>.</span>
        </p>

        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-6 mt-6 border-t hairline">
          <span className="meta-label">© {new Date().getFullYear()} {name}</span>
          <span className="meta-label">Designed &amp; built in {profile.location || "Indonesia"}</span>
        </div>
      </div>
    </footer>
  );
}
