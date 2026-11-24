"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, FileText, Maximize2, X } from "lucide-react";
import type { Certificate } from "@/lib/portfolio-context";

const pad = (n: number) => String(n).padStart(2, "0");
const isPdf = (file: string) => /\.pdf($|\?)/i.test(file || "");

function normaliseUrl(u?: string) {
  const v = (u || "").trim();
  if (!v || v === "#") return null;
  return v.startsWith("http") ? v : `https://${v}`;
}

/** E-certificates grid + full-size viewer, shown under Professional Experience. */
export default function Certificates({ certificates }: { certificates: Certificate[] }) {
  const items = certificates.filter((c) => c.title || c.file);
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;

  const issuers = new Set(items.map((c) => c.issuer).filter(Boolean)).size;

  return (
    <div className="mt-24 md:mt-32">
      <div className="flex items-center gap-4 pb-4 mb-10 md:mb-14 border-b hairline">
        <span className="meta-label" style={{ color: "var(--accent)" }}>(01.2)</span>
        <span className="meta-label">E-Certificates</span>
        <span className="flex-1" />
        <span className="meta-label hidden sm:inline">
          {pad(items.length)} {items.length === 1 ? "certificate" : "certificates"}
          {issuers ? ` · ${pad(issuers)} issuers` : ""}
        </span>
      </div>

      <h3 className="font-display uppercase mb-12 md:mb-16" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "var(--fg)" }}>
        Certified &amp; <span style={{ color: "var(--accent)" }}>credentialed</span>
      </h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {items.map((c, i) => (
          <motion.li
            key={c.id ?? i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.06 }}
          >
            <CertificateCard cert={c} index={i} onOpen={() => setOpen(i)} />
          </motion.li>
        ))}
      </ul>

      <CertificateViewer items={items} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </div>
  );
}

function CertificateCard({ cert, index, onOpen }: { cert: Certificate; index: number; onOpen: () => void }) {
  const verify = normaliseUrl(cert.url);
  const pdf = isPdf(cert.file);

  return (
    <article className="group h-full flex flex-col rounded-xl border hairline overflow-hidden transition-colors duration-300 hover:border-[var(--accent)]" style={{ backgroundColor: "var(--surface)" }}>
      {/* "Paper on a desk" preview */}
      <button
        onClick={onOpen}
        aria-label={`View certificate: ${cert.title}`}
        className="relative block w-full aspect-[1.414/1] overflow-hidden"
        style={{ backgroundColor: "var(--surface-2)" }}
      >
        <span className="absolute inset-0 p-5 md:p-6 flex items-center justify-center">
          {cert.file && !pdf ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.file}
              alt=""
              loading="lazy"
              className="max-w-full max-h-full object-contain rounded-[3px] transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:-rotate-[0.6deg]"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.15), 0 12px 28px -10px rgba(0,0,0,0.45)" }}
            />
          ) : (
            <span
              className="w-[70%] aspect-[1.414/1] rounded-[3px] flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "var(--bg)", boxShadow: "0 12px 28px -10px rgba(0,0,0,0.45)" }}
            >
              {pdf ? <FileText size={28} style={{ color: "var(--accent)" }} /> : <Award size={28} style={{ color: "var(--accent)" }} />}
              <span className="meta-label !text-[10px]">{pdf ? "PDF certificate" : "Certificate"}</span>
            </span>
          )}
        </span>
        <span className="absolute top-3 left-3 meta-label tabular-nums px-2 h-6 flex items-center rounded-full" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
          {pad(index + 1)}
        </span>
        <span
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ backgroundColor: "#bef264", color: "#0a0a0b" }}
          aria-hidden
        >
          <Maximize2 size={14} />
        </span>
      </button>

      <div className="flex-1 flex flex-col p-5">
        {cert.issuer && (
          <p className="meta-label mb-2 truncate" style={{ color: "var(--accent)" }}>
            {cert.issuer}
          </p>
        )}
        <h4 className="font-grotesk text-base md:text-[17px] font-medium leading-snug mb-4" style={{ color: "var(--fg)" }}>
          {cert.title}
        </h4>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t hairline">
          <div className="min-w-0">
            {cert.date && <p className="meta-label tabular-nums">{cert.date}</p>}
            {cert.credentialId && (
              <p className="font-grotesk text-[11px] truncate mt-1" style={{ color: "var(--muted)" }} title={cert.credentialId}>
                ID · {cert.credentialId}
              </p>
            )}
          </div>
          {verify && (
            <a
              href={verify}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 font-grotesk text-xs font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
            >
              Verify <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CertificateViewer({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: Certificate[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const cert = index !== null ? items[index] : null;
  const open = !!cert;

  const go = useCallback(
    (d: 1 | -1) => {
      if (index === null || items.length < 2) return;
      onNavigate((index + d + items.length) % items.length);
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis, onClose, go]);

  const verify = normaliseUrl(cert?.url);
  const pdf = isPdf(cert?.file || "");
  // Portal to <body>: the About section creates its own stacking context,
  // which would otherwise keep the viewer under the navbar and floating buttons.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {cert && (
        <motion.div
          key="cert-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${cert.title}`}
          className="fixed inset-0 z-[110] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0" onClick={onClose} style={{ backgroundColor: "var(--overlay-bg)", backdropFilter: "blur(10px)" }} />

          {/* Top bar */}
          <div className="relative flex items-center gap-3 px-4 md:px-8 h-16 shrink-0">
            <span className="meta-label tabular-nums" style={{ color: "var(--accent)" }}>
              {pad(index! + 1)} / {pad(items.length)}
            </span>
            <span className="flex-1" />
            {items.length > 1 && (
              <>
                <RoundButton label="Previous certificate" onClick={() => go(-1)}><ArrowLeft size={18} /></RoundButton>
                <RoundButton label="Next certificate" onClick={() => go(1)}><ArrowRight size={18} /></RoundButton>
              </>
            )}
            <RoundButton label="Close" onClick={onClose} ref={closeRef}><X size={18} /></RoundButton>
          </div>

          {/* Certificate */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-10 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={cert.id ?? index}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto max-w-5xl w-full h-full flex items-center justify-center"
              >
                {pdf ? (
                  <iframe
                    src={`${cert.file}#view=FitH`}
                    title={cert.title}
                    className="w-full h-full rounded-md border-0"
                    style={{ backgroundColor: "#fff" }}
                  />
                ) : cert.file ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.file}
                    alt={`${cert.title} — ${cert.issuer}`}
                    className="max-w-full max-h-full object-contain rounded-md"
                    style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
                  />
                ) : (
                  <span className="meta-label">No file uploaded</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Details */}
          <div className="relative shrink-0 px-4 md:px-8 py-5">
            <div
              className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-8 p-4 md:px-6 rounded-xl border hairline"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="meta-label mb-1 truncate" style={{ color: "var(--accent)" }}>{cert.issuer}</p>
                <p className="font-grotesk text-base md:text-lg font-medium leading-snug md:truncate" style={{ color: "var(--fg)" }}>{cert.title}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {cert.date && (
                  <span>
                    <span className="meta-label block !text-[10px]">Issued</span>
                    <span className="font-grotesk text-sm" style={{ color: "var(--fg)" }}>{cert.date}</span>
                  </span>
                )}
                {cert.credentialId && (
                  <span className="min-w-0">
                    <span className="meta-label block !text-[10px]">Credential ID</span>
                    <span className="font-grotesk text-sm break-all" style={{ color: "var(--fg)" }}>{cert.credentialId}</span>
                  </span>
                )}
                {verify && (
                  <a href={verify} target="_blank" rel="noreferrer" className="btn-primary !py-2.5 !px-5">
                    Verify credential <ArrowUpRight size={15} />
                  </a>
                )}
                {pdf && (
                  <a href={cert.file} target="_blank" rel="noreferrer" className="btn-outline !py-2.5 !px-5">
                    Open PDF <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const RoundButton = ({
  label,
  onClick,
  children,
  ref,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) => (
  <button
    ref={ref}
    aria-label={label}
    onClick={onClick}
    className="w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
    style={{ border: "1px solid var(--line-strong)", backgroundColor: "var(--surface)" }}
  >
    {children}
  </button>
);
