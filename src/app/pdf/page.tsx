"use client";

import { useEffect, useState } from "react";
import { PortfolioProvider, usePortfolioData } from "@/lib/portfolio-context";
import { 
  Mail, Phone, MapPin, Briefcase, Calendar, 
  Code2, Layout, PenTool, MonitorSmartphone, 
  Github, Linkedin, Instagram, CheckCircle2 
} from "lucide-react";

function PDFContent() {
  const { profile, socials, skills, services, projects, experience, creativeWorks } = usePortfolioData();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  useEffect(() => {
    const onBeforePrint = () => setIsPrinting(true);
    const onAfterPrint = () => setIsPrinting(false);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2": return <Code2 size={16} strokeWidth={1.5} />;
      case "Layout": return <Layout size={16} strokeWidth={1.5} />;
      case "PenTool": return <PenTool size={16} strokeWidth={1.5} />;
      case "MonitorSmartphone": return <MonitorSmartphone size={16} strokeWidth={1.5} />;
      default: return <CheckCircle2 size={16} strokeWidth={1.5} />;
    }
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Syne:wght@500;600;700;800&display=swap');

        :root {
          --pdf-accent: #a8e63d;
          --pdf-dark: #111111;
          --pdf-gray: #444444;
          --pdf-muted: #777777;
          --pdf-border: #e0e0e0;
          --pdf-bg: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Manrope', sans-serif;
          background: #e5e7eb;
          color: var(--pdf-dark);
          -webkit-font-smoothing: antialiased;
          font-size: 9.5pt;
          line-height: 1.5;
        }

        /* Enforce A4 proportions */
        .pdf-wrapper {
          width: 210mm;
          min-height: 297mm;
          margin: 40px auto;
          background: var(--pdf-bg);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        /* ─── Print button bar (hidden on print) ─── */
        .pdf-topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: #fff;
          border-bottom: 1px solid var(--pdf-border);
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 100vw;
        }
        .pdf-topbar-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14pt;
        }
        .pdf-topbar-actions { display: flex; gap: 8px; }
        .pdf-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 10pt;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-decoration: none;
        }
        .pdf-btn-primary { background: var(--pdf-dark); color: #fff; }
        .pdf-btn-primary:hover { background: #000; }
        .pdf-btn-secondary { background: #f0f0f0; color: var(--pdf-dark); }
        .pdf-btn-secondary:hover { background: #e0e0e0; }

        /* ─── Document body ─── */
        .pdf-doc {
          padding: 15mm 15mm 20mm 15mm;
        }

        /* ─── Header ─── */
        .pdf-header {
          display: flex;
          gap: 24px;
          margin-bottom: 30px;
          align-items: center;
          border-bottom: 1px solid var(--pdf-border);
          padding-bottom: 24px;
        }
        .pdf-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--pdf-border);
        }
        .pdf-avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--pdf-muted);
        }
        .pdf-header-info { flex: 1; }
        .pdf-name {
          font-family: 'Syne', sans-serif;
          font-size: 28pt;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .pdf-tagline {
          font-size: 12pt;
          font-weight: 600;
          color: var(--pdf-gray);
          margin-bottom: 8px;
        }
        .pdf-bio {
          font-size: 9pt;
          color: var(--pdf-muted);
          line-height: 1.6;
          max-width: 95%;
        }

        /* ─── Layout Grid ─── */
        .pdf-layout {
          display: grid;
          grid-template-columns: 2.5fr 7fr;
          gap: 30px;
        }

        /* ─── Section Title ─── */
        .pdf-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 11pt;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pdf-dark);
          margin-bottom: 12px;
          border-bottom: 2px solid var(--pdf-dark);
          padding-bottom: 6px;
          display: inline-block;
        }

        /* ─── Sidebar (Left Column) ─── */
        .pdf-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .pdf-contact-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pdf-contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 8.5pt;
          color: var(--pdf-gray);
          text-decoration: none;
        }
        .pdf-contact-item svg {
          color: var(--pdf-dark);
          flex-shrink: 0;
        }

        .pdf-skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pdf-skill-tag {
          font-size: 8pt;
          padding: 3px 8px;
          background: #f4f4f4;
          border-radius: 4px;
          color: var(--pdf-dark);
          font-weight: 600;
          border: 1px solid #eaeaea;
        }

        .pdf-services-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pdf-service-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .pdf-service-icon {
          color: var(--pdf-dark);
          margin-top: 1px;
        }
        .pdf-service-text h4 {
          font-size: 9pt;
          font-weight: 700;
          color: var(--pdf-dark);
          margin-bottom: 2px;
        }
        .pdf-service-text p {
          font-size: 8pt;
          color: var(--pdf-muted);
          line-height: 1.4;
        }

        /* ─── Main Content (Right Column) ─── */
        .pdf-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pdf-experience-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pdf-exp-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pdf-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .pdf-exp-title {
          font-family: 'Syne', sans-serif;
          font-size: 11pt;
          font-weight: 700;
          color: var(--pdf-dark);
        }
        .pdf-exp-date {
          font-size: 8.5pt;
          color: var(--pdf-muted);
          font-weight: 600;
        }
        .pdf-exp-company {
          font-size: 9.5pt;
          font-weight: 700;
          color: var(--pdf-gray);
        }
        .pdf-exp-bullets {
          margin-top: 4px;
          padding-left: 12px;
        }
        .pdf-exp-bullets li {
          font-size: 8.5pt;
          color: var(--pdf-muted);
          margin-bottom: 3px;
          line-height: 1.5;
        }
        .pdf-exp-bullets li::marker {
          color: var(--pdf-dark);
        }

        .pdf-projects-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pdf-project-item {
          display: flex;
          gap: 12px;
        }
        .pdf-project-img {
          width: 100px;
          height: 70px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--pdf-border);
          flex-shrink: 0;
        }
        .pdf-project-info {
          flex: 1;
        }
        .pdf-project-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }
        .pdf-project-title {
          font-family: 'Syne', sans-serif;
          font-size: 10pt;
          font-weight: 700;
          color: var(--pdf-dark);
        }
        .pdf-project-meta {
          font-size: 8pt;
          color: var(--pdf-muted);
          font-weight: 500;
        }
        .pdf-project-desc {
          font-size: 8.5pt;
          color: var(--pdf-gray);
          line-height: 1.4;
          margin-bottom: 6px;
        }
        .pdf-project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pdf-project-tag {
          font-size: 7.5pt;
          padding: 1px 6px;
          background: #f4f4f4;
          border-radius: 4px;
          color: var(--pdf-muted);
          border: 1px solid #eaeaea;
        }

        /* ─── Print Media ─── */
        @media print {
          @page {
            margin: 0; /* Remove default browser margins completely */
            size: A4 portrait;
          }
          body {
            background: #fff;
            margin: 0;
            padding: 0;
          }
          .pdf-wrapper { 
            width: 210mm !important; 
            margin: 0 !important; 
            box-shadow: none !important; 
            max-width: none !important;
          }
          .pdf-topbar { display: none !important; }
          .pdf-doc { padding: 12mm 15mm 15mm 15mm !important; }
          
          /* Enforce Grid proportions exactly for print */
          .pdf-layout {
            display: grid !important;
            grid-template-columns: 2.5fr 7fr !important;
            gap: 30px !important;
          }

          /* Prevent weird page breaks */
          .pdf-exp-item, .pdf-project-item { 
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Better text rendering */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="pdf-topbar">
        <div className="pdf-topbar-logo">CV / Resume</div>
        <div className="pdf-topbar-actions">
          <a href="/" className="pdf-btn pdf-btn-secondary">Back to Site</a>
          <button onClick={handlePrint} className="pdf-btn pdf-btn-primary" disabled={isPrinting}>
            {isPrinting ? "Preparing..." : "Print PDF"}
          </button>
        </div>
      </div>

      {/* ── Document ── */}
      <div className="pdf-wrapper">
        <div className="pdf-doc">
          
          {/* ════ HEADER ════ */}
          <header className="pdf-header">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="pdf-avatar" crossOrigin="anonymous" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="pdf-avatar-placeholder">{profile.name?.charAt(0) || "J"}</div>
            )}
            
            <div className="pdf-header-info">
              <h1 className="pdf-name">{profile.name}</h1>
              <h2 className="pdf-tagline">{profile.tagline}</h2>
              <p className="pdf-bio">{profile.bio}</p>
            </div>
          </header>

          <div className="pdf-layout">
            {/* ════ LEFT COLUMN: SIDEBAR ════ */}
            <aside className="pdf-sidebar">
              
              {/* CONTACT */}
              <section>
                <h3 className="pdf-section-title">Contact</h3>
                <div className="pdf-contact-list">
                  {profile.location && (
                    <div className="pdf-contact-item">
                      <MapPin size={14} strokeWidth={1.5} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="pdf-contact-item">
                      <Mail size={14} strokeWidth={1.5} />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile.whatsapp && (
                    <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} className="pdf-contact-item">
                      <Phone size={14} strokeWidth={1.5} />
                      <span>{profile.whatsapp}</span>
                    </a>
                  )}
                  {socials.linkedin && socials.linkedin !== "#" && (
                    <a href={socials.linkedin} className="pdf-contact-item" target="_blank" rel="noreferrer">
                      <Linkedin size={14} strokeWidth={1.5} />
                      <span>linkedin.com/in/{profile.name.split(' ')[0].toLowerCase()}</span>
                    </a>
                  )}
                  {socials.github && socials.github !== "#" && (
                    <a href={socials.github} className="pdf-contact-item" target="_blank" rel="noreferrer">
                      <Github size={14} strokeWidth={1.5} />
                      <span>github.com/alAmien</span>
                    </a>
                  )}
                  {socials.instagram && socials.instagram !== "#" && (
                    <a href={socials.instagram} className="pdf-contact-item" target="_blank" rel="noreferrer">
                      <Instagram size={14} strokeWidth={1.5} />
                      <span>@j.alamien</span>
                    </a>
                  )}
                </div>
              </section>

              {/* SKILLS */}
              <section>
                <h3 className="pdf-section-title">Skills</h3>
                <div className="pdf-skills-list">
                  {skills && skills.map((skill, i) => (
                    <span key={i} className="pdf-skill-tag">{skill.name}</span>
                  ))}
                </div>
              </section>

              {/* SERVICES */}
              {services && services.length > 0 && (
                <section>
                  <h3 className="pdf-section-title">Services</h3>
                  <div className="pdf-services-list">
                    {services.map((svc) => (
                      <div key={svc.id} className="pdf-service-item">
                        <div className="pdf-service-icon">{getServiceIcon(svc.icon)}</div>
                        <div className="pdf-service-text">
                          <h4>{svc.title}</h4>
                          <p>{svc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* EXTRA INFO */}
              <section>
                <h3 className="pdf-section-title">Details</h3>
                <div className="pdf-contact-list">
                  <div className="pdf-contact-item">
                    <Briefcase size={14} strokeWidth={1.5} />
                    <span>{profile.experience} Experience</span>
                  </div>
                  <div className="pdf-contact-item">
                    <CheckCircle2 size={14} strokeWidth={1.5} />
                    <span>{profile.availability}</span>
                  </div>
                </div>
              </section>

            </aside>

            {/* ════ RIGHT COLUMN: MAIN CONTENT ════ */}
            <main className="pdf-main">
              
              {/* EXPERIENCE */}
              <section>
                <h3 className="pdf-section-title">Experience</h3>
                <div className="pdf-experience-list">
                  {experience && experience.map((exp) => (
                    <div key={exp.id} className="pdf-exp-item">
                      <div className="pdf-exp-header">
                        <h4 className="pdf-exp-title">{exp.role}</h4>
                        <span className="pdf-exp-date">{exp.duration}</span>
                      </div>
                      <div className="pdf-exp-company">{exp.company}</div>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="pdf-exp-bullets">
                          {exp.description.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* DEV PROJECTS */}
              {projects && projects.length > 0 && (
                <section>
                  <h3 className="pdf-section-title">Development Projects</h3>
                  <div className="pdf-projects-list">
                    {projects.slice(0, 3).map((proj) => (
                      <div key={proj.id} className="pdf-project-item">
                        {proj.image && (
                          <img src={proj.image} alt={proj.title} className="pdf-project-img" crossOrigin="anonymous" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                        <div className="pdf-project-info">
                          <div className="pdf-project-header">
                            <h4 className="pdf-project-title">{proj.title}</h4>
                            <span className="pdf-project-meta">{proj.year} | {proj.category}</span>
                          </div>
                          <p className="pdf-project-desc">{proj.description}</p>
                          <div className="pdf-project-tags">
                            {proj.tags?.map((tag, i) => (
                              <span key={i} className="pdf-project-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CREATIVE WORKS */}
              {creativeWorks && creativeWorks.length > 0 && (
                <section>
                  <h3 className="pdf-section-title">Creative Works</h3>
                  <div className="pdf-projects-list">
                    {creativeWorks.slice(0, 3).map((work) => (
                      <div key={work.id} className="pdf-project-item">
                        {work.image && (
                          <img src={work.image} alt={work.client} className="pdf-project-img" crossOrigin="anonymous" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                        <div className="pdf-project-info">
                          <div className="pdf-project-header">
                            <h4 className="pdf-project-title">{work.client || "Design Project"}</h4>
                            <span className="pdf-project-meta">{work.year} | {work.program}</span>
                          </div>
                          <p className="pdf-project-desc" style={{marginBottom: "4px"}}><strong>Role:</strong> {work.role}</p>
                          <p className="pdf-project-desc">{work.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </main>
          </div>

        </div>
      </div>
    </>
  );
}

export default function PDFPage() {
  return (
    <PortfolioProvider>
      <PDFContent />
    </PortfolioProvider>
  );
}
