"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { User, Briefcase, Code2, MessageSquare, Settings, LogOut, Plus, Trash2, Save, Eye, Upload, X, GripVertical, Menu, Palette, Link2, Images, Loader2, Music, Award, FileText } from "lucide-react";
import { parseVideo, PLATFORM_LABEL } from "@/lib/media";
import { upload as blobUpload } from "@vercel/blob/client";


// ─── Types ───────────────────────────────────────────────
type Tab = "profile" | "experience" | "certificates" | "projects" | "creative" | "music" | "skills" | "services" | "testimonials";

// ─── Main Admin Page ─────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Restore an existing session (httpOnly cookie) on mount
  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        setAuthenticated(!!res.authenticated);
        if (res.configured === false) setError("Admin login is not configured on the server (set ADMIN_PASSWORD).");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  // Load data once logged in
  useEffect(() => {
    if (authenticated) {
      fetch("/api/portfolio")
        .then((r) => r.json())
        .then((res) => { if (res.success) setData(res.data); });
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setAuthenticated(true);
        setPassword("");
      } else {
        setError(result.error || "Login failed.");
      }
    } catch {
      setError("Network error.");
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    setAuthenticated(false);
    setData(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.status === 401) {
        setSaveMsg("✗ Session expired — please log in again.");
        setAuthenticated(false);
      } else {
        setSaveMsg(result.success ? "✓ Saved successfully!" : "✗ Save failed.");
      }
    } catch {
      setSaveMsg("✗ Network error.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  if (checking) return <LoadingScreen />;
  if (!authenticated) return <LoginScreen password={password} setPassword={setPassword} onLogin={handleLogin} error={error} loading={loggingIn} />;
  if (!data) return <LoadingScreen />;

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "experience" as Tab, label: "Experience", icon: Briefcase },
    { id: "certificates" as Tab, label: "Certificates", icon: Award },
    { id: "projects" as Tab, label: "Projects", icon: Code2 },
    { id: "creative" as Tab, label: "Creative", icon: Palette },
    { id: "music" as Tab, label: "Music", icon: Music },
    { id: "skills" as Tab, label: "Skills", icon: Settings },
    { id: "services" as Tab, label: "Services", icon: Settings },
    { id: "testimonials" as Tab, label: "Testimonials", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-manrope, sans-serif)" }}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b z-40 sticky top-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--sidebar)" }}>
        <div style={{ background: "var(--primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Admin CPanel
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 flex-shrink-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ backgroundColor: "var(--sidebar)", borderRight: "1px solid var(--border)" }}>
        {/* Logo */}
        <div className="hidden md:block px-6 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div style={{ background: "var(--primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Admin CPanel
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Portfolio Manager</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                color: activeTab === tab.id ? "var(--accent-foreground)" : "var(--muted-foreground)",
                border: activeTab === tab.id ? "1px solid var(--border)" : "1px solid transparent",
                fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", opacity: saving ? 0.7 : 1 }}
          >
            <Save size={14} /> {saving ? "Saving..." : "Save All"}
          </button>
          {saveMsg && <p style={{ color: saveMsg.startsWith("✓") ? "var(--primary)" : "var(--destructive)", fontSize: "0.75rem", fontWeight: 700, textAlign: "center" }}>{saveMsg}</p>}
          <a
            href="/"
            target="_blank"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: "transparent", color: "var(--muted-foreground)", borderRadius: "10px", border: "1px solid var(--border)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none" }}
          >
            <Eye size={14} /> Preview Site
          </a>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: "transparent", color: "var(--muted-foreground)", borderRadius: "10px", border: "1px solid var(--border)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 w-full" style={{ maxHeight: "100vh", backgroundColor: "var(--background)" }}>
        {/* Header Breadcrumbs */}
        <div className="hidden md:flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "24px", color: "var(--muted-foreground)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <div>DASHBOARD <span style={{ margin: "0 8px", color: "#333" }}>&gt;</span> <span style={{ color: "var(--foreground)" }}>{activeTab}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--primary)" }}></div>
            Draft auto-saved
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            {activeTab === "profile" && <ProfileTab data={data} setData={setData} />}
            {activeTab === "experience" && <ExperienceTab data={data} setData={setData} />}
            {activeTab === "projects" && <ProjectsTab data={data} setData={setData} />}
            {activeTab === "creative" && <CreativeWorksTab data={data} setData={setData} />}
            {activeTab === "skills" && <SkillsTab data={data} setData={setData} />}
            {activeTab === "services" && <ServicesTab data={data} setData={setData} />}
            {activeTab === "testimonials" && <TestimonialsTab data={data} setData={setData} />}
            {activeTab === "music" && <MusicTab data={data} setData={setData} />}
            {activeTab === "certificates" && <CertificatesTab data={data} setData={setData} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────
function LoginScreen({ password, setPassword, onLogin, error, loading }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-[400px] p-4 sm:p-6">
        <div className="p-6 sm:p-10" style={{ background: "var(--card)", backdropFilter: "blur(16px)", border: "1px solid var(--border)", borderRadius: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ background: "var(--primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900, fontSize: "1.5rem", letterSpacing: "0.1em", marginBottom: "8px" }}>
              ADMIN PANEL
            </div>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", fontWeight: 600 }}>Enter password to continue</p>
          </div>
          <form onSubmit={onLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              autoComplete="current-password"
              aria-label="Admin password"
              required
            />
            {error && <p style={{ color: "var(--destructive)", fontSize: "0.8rem", fontWeight: 600 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, padding: "12px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              {loading ? "Checking…" : "Login →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--background)", color: "var(--primary)", fontWeight: 700 }}>
      Loading data...
    </div>
  );
}

// ─── Shared field styles ──────────────────────────────────
const labelStyle: React.CSSProperties = { display: "block", color: "var(--muted-foreground)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "6px" };
const sectionTitle: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "24px", background: "var(--primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
const smallBtn: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" };
const cardStyle: React.CSSProperties = { backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };

const InputField = ({ label, value, onChange, placeholder = "", type = "text" }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isActive = isFocused || hasValue;
  
  return (
    <div className={`admin-field-wrapper ${isActive ? "active" : ""} ${type === "textarea" ? "is-textarea" : ""}`}>
      <span className="admin-field-label">{label}</span>
      {type === "textarea" ? (
        <textarea 
          className="admin-input-inset" 
          value={value || ""} 
          onChange={onChange} 
          placeholder={placeholder} 
          rows={4} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input 
          className="admin-input-inset" 
          type={type} 
          value={value || ""} 
          onChange={onChange} 
          placeholder={placeholder} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
    </div>
  );
};

const SectionHeader = ({ num, title }: { num?: string, title: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
    {num && (
      <div style={{ background: "rgba(245,158,11,0.1)", color: "var(--primary)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
        {num}
      </div>
    )}
    <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e5e5e5", margin: 0 }}>
      {title}
    </h3>
  </div>
);

// ─── Profile Tab ──────────────────────────────────────────
function ProfileTab({ data, setData }: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: string, val: string) =>
    setData((d: any) => ({ ...d, profile: { ...d.profile, [key]: val } }));

  const updateSocial = (key: string, val: string) =>
    setData((d: any) => ({ ...d, socials: { ...d.socials, [key]: val } }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      update("photo", url);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* 0. Top Profile Card */}
      <div className="admin-card" style={{ padding: "32px" }}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div style={{ position: "relative" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "16px", border: "1px solid #333", backgroundColor: "#171717", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {data.profile.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.profile.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={32} color="#525252" />
                )}
              </div>
              <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: "-8px", right: "-8px", background: "var(--primary)", color: "#000", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                <Upload size={14} strokeWidth={3} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </div>
            
            <div className="text-center md:text-left mt-2 md:mt-0">
              <div style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>Editing Profile</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", margin: "0 0 4px 0", fontFamily: "var(--font-syne)" }}>{data.profile.name || "Your Name"}</h2>
              <p style={{ color: "#a3a3a3", fontSize: "0.85rem", margin: 0 }}>{data.profile.tagline || "Your Tagline"}</p>
            </div>
          </div>

          <div className="flex gap-8 md:gap-12 mt-4 md:mt-0 text-center md:text-left">
            <div>
              <div style={{ color: "#737373", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Experience</div>
              <div style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: 600 }}>{data.profile.experience || "N/A"}</div>
            </div>
            <div>
              <div style={{ color: "#737373", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Location</div>
              <div style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: 600 }}>{data.profile.location || "N/A"}</div>
            </div>
            <div>
              <div style={{ color: "#737373", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Status</div>
              <div style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: 600 }}>{data.profile.availability || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for 01, 02, 03 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 01 IDENTITY */}
        <div className="admin-card flex flex-col">
          <SectionHeader num="01" title="Identity" />
          <div className="flex flex-col gap-4 flex-1">
            <InputField label="Full Name" value={data.profile.name} onChange={(e: any) => update("name", e.target.value)} />
            <InputField label="Tagline" value={data.profile.tagline} onChange={(e: any) => update("tagline", e.target.value)} />
            <InputField label="Location" value={data.profile.location} onChange={(e: any) => update("location", e.target.value)} />
          </div>
        </div>

        {/* 02 CAREER */}
        <div className="admin-card flex flex-col">
          <SectionHeader num="02" title="Career" />
          <div className="flex flex-col gap-4 flex-1">
            <InputField label="Experience" value={data.profile.experience} onChange={(e: any) => update("experience", e.target.value)} />
            <InputField label="Availability" value={data.profile.availability} onChange={(e: any) => update("availability", e.target.value)} />
            <InputField label="Image URL" value={data.profile.photo} onChange={(e: any) => update("photo", e.target.value)} />
          </div>
        </div>

        {/* 03 CONTACT */}
        <div className="admin-card flex flex-col">
          <SectionHeader num="03" title="Contact" />
          <div className="flex flex-col gap-4 flex-1">
            <InputField label="Email" value={data.profile.email} onChange={(e: any) => update("email", e.target.value)} />
            <InputField label="WhatsApp" value={data.profile.whatsapp} onChange={(e: any) => update("whatsapp", e.target.value)} />
          </div>
        </div>

      </div>

      {/* 04 ABOUT */}
      <div className="admin-card">
        <SectionHeader num="04" title="About" />
        <InputField type="textarea" label="Bio" value={data.profile.bio} onChange={(e: any) => update("bio", e.target.value)} />
      </div>

      {/* 05 SOCIAL LINKS */}
      <div className="admin-card">
        <SectionHeader num="05" title="Social Links" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="WhatsApp" value={data.socials?.whatsapp} onChange={(e: any) => updateSocial("whatsapp", e.target.value)} />
          <InputField label="LinkedIn" value={data.socials?.linkedin} onChange={(e: any) => updateSocial("linkedin", e.target.value)} />
          <InputField label="Instagram" value={data.socials?.instagram} onChange={(e: any) => updateSocial("instagram", e.target.value)} />
          <InputField label="GitHub" value={data.socials?.github} onChange={(e: any) => updateSocial("github", e.target.value)} />
          <InputField label="Email" value={data.socials?.email} onChange={(e: any) => updateSocial("email", e.target.value)} />
        </div>
      </div>
      
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────
function ProjectsTab({ data, setData }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  const addProject = () => {
    const newP = { id: Date.now(), title: "New Project", category: "Category", year: "2026", description: "", image: "", link: "#", tags: [] };
    setData((d: any) => ({ ...d, projects: [...d.projects, newP] }));
  };

  const updateProject = (id: number, key: string, val: any) =>
    setData((d: any) => ({ ...d, projects: d.projects.map((p: any) => p.id === id ? { ...p, [key]: val } : p) }));

  const deleteProject = (id: number) =>
    setData((d: any) => ({ ...d, projects: d.projects.filter((p: any) => p.id !== id) }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeProjectId === null) return;
    
    const form = new FormData();
    form.append("file", file);
    
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      updateProject(activeProjectId, "image", url);
    }
    setActiveProjectId(null);
  };

  const triggerUpload = (id: number) => {
    setActiveProjectId(id);
    fileRef.current?.click();
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Projects</h1>
        <button onClick={addProject} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Project
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {data.projects.map((project: any, i: number) => (
          <div key={project.id} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
              <div className="flex items-center gap-3">
                <div style={{ background: "rgba(245,158,11,0.1)", color: "var(--primary)", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{project.title}</span>
              </div>
              <button onClick={() => deleteProject(project.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start">
              {/* Project Thumbnail Preview/Upload */}
              <div>
                <label style={labelStyle}>Thumbnail</label>
                <div 
                  style={{ 
                    width: "100%", 
                    aspectRatio: "16/9", 
                    backgroundColor: "rgba(5,5,16,0.5)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "10px", 
                    overflow: "hidden", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: "8px"
                  }}
                >
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image} alt="Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Briefcase size={24} style={{ color: "var(--muted)" }} />
                  )}
                </div>
                <button 
                  onClick={() => triggerUpload(project.id)}
                  style={{ width: "100%", padding: "8px", background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Upload size={12} /> Upload Image
                </button>
              </div>

              {/* Project Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Title" value={project.title} onChange={(e: any) => updateProject(project.id, "title", e.target.value)} />
                <InputField label="Category" value={project.category} onChange={(e: any) => updateProject(project.id, "category", e.target.value)} />
                <InputField label="Year" value={project.year} onChange={(e: any) => updateProject(project.id, "year", e.target.value)} />
                <InputField label="Link URL" value={project.link} onChange={(e: any) => updateProject(project.id, "link", e.target.value)} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField label="Image URL (Manual)" value={project.image} onChange={(e: any) => updateProject(project.id, "image", e.target.value)} placeholder="/projects/1.png" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField type="textarea" label="Description" value={project.description} onChange={(e: any) => updateProject(project.id, "description", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField label="Tags (comma separated)" value={(project.tags || []).join(", ")} onChange={(e: any) => updateProject(project.id, "tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} placeholder="React, Next.js, GSAP" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Skills Tab ───────────────────────────────────────────
function SkillsTab({ data, setData }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeSkillIdx, setActiveSkillIdx] = useState<number | null>(null);

  const addSkill = () => setData((d: any) => ({ ...d, skills: [...d.skills, { name: "New Skill", icon: "⭐" }] }));
  
  const updateSkill = (i: number, key: string, val: string) =>
    setData((d: any) => { const s = [...d.skills]; s[i] = { ...s[i], [key]: val }; return { ...d, skills: s }; });
  
  const deleteSkill = (i: number) =>
    setData((d: any) => ({ ...d, skills: d.skills.filter((_: any, idx: number) => idx !== i) }));

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSkillIdx === null) return;
    
    const form = new FormData();
    form.append("file", file);
    
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      updateSkill(activeSkillIdx, "icon", url);
    }
    setActiveSkillIdx(null);
  };

  const triggerUpload = (i: number) => {
    setActiveSkillIdx(i);
    fileRef.current?.click();
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleIconUpload} style={{ display: "none" }} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Skills / Tech Stack</h1>
        <button onClick={addSkill} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Skill
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.skills.map((skill: any, i: number) => {
          const isUrl = skill.icon?.startsWith("http") || skill.icon?.startsWith("/");
          return (
            <div key={i} className="admin-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                <div 
                  onClick={() => triggerUpload(i)}
                  style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    backgroundColor: "rgba(5,5,16,0.5)", 
                    border: "1px solid var(--border)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden"
                  }}
                >
                  {isUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={skill.icon} alt={skill.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "1.2rem" }}>{skill.icon || "⭐"}</span>
                  )}
                </div>
                <button onClick={() => deleteSkill(i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px" }}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <InputField label="Skill Name" value={skill.name} onChange={(e: any) => updateSkill(i, "name", e.target.value)} />
                <InputField label="Icon (Slug or Emoji)" value={skill.icon} onChange={(e: any) => updateSkill(i, "icon", e.target.value)} placeholder="react, nextdotjs, or 🚀" />
                <button 
                  onClick={() => triggerUpload(i)}
                  style={{ width: "100%", padding: "8px", background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Upload PNG Logo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── Services Tab ─────────────────────────────────────────
function ServicesTab({ data, setData }: any) {
  const updateService = (id: number, key: string, val: string) =>
    setData((d: any) => ({ ...d, services: d.services.map((s: any) => s.id === id ? { ...s, [key]: val } : s) }));

  return (
    <div>
      <h1 style={sectionTitle}>Services</h1>
      <div className="flex flex-col gap-4">
        {data.services.map((service: any) => (
          <div key={service.id} className="admin-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Service Title" value={service.title} onChange={(e: any) => updateService(service.id, "title", e.target.value)} />
              <InputField label="Icon Name (lucide)" value={service.icon} onChange={(e: any) => updateService(service.id, "icon", e.target.value)} placeholder="Code2, Layout, PenTool..." />
              <div style={{ gridColumn: "1 / -1" }}>
                <InputField type="textarea" label="Description" value={service.description} onChange={(e: any) => updateService(service.id, "description", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────
function TestimonialsTab({ data, setData }: any) {
  const addTestimonial = () => {
    const newT = { id: Date.now(), quote: "New testimonial quote.", author: "Name", role: "Role", initials: "NA" };
    setData((d: any) => ({ ...d, testimonials: [...d.testimonials, newT] }));
  };
  const updateTestimonial = (id: number, key: string, val: string) =>
    setData((d: any) => ({ ...d, testimonials: d.testimonials.map((t: any) => t.id === id ? { ...t, [key]: val } : t) }));
  const deleteTestimonial = (id: number) =>
    setData((d: any) => ({ ...d, testimonials: d.testimonials.filter((t: any) => t.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Testimonials</h1>
        <button onClick={addTestimonial} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {data.testimonials.map((t: any) => (
          <div key={t.id} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontWeight: 800, color: "#f0eeff" }}>{t.author}</span>
              <button onClick={() => deleteTestimonial(t.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px] gap-4">
              <InputField label="Author Name" value={t.author} onChange={(e: any) => updateTestimonial(t.id, "author", e.target.value)} />
              <InputField label="Role" value={t.role} onChange={(e: any) => updateTestimonial(t.id, "role", e.target.value)} />
              <InputField label="Initials" value={t.initials} onChange={(e: any) => updateTestimonial(t.id, "initials", e.target.value)} />
              <div style={{ gridColumn: "1 / -1" }}>
                <InputField type="textarea" label="Quote" value={t.quote} onChange={(e: any) => updateTestimonial(t.id, "quote", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────
function ExperienceTab({ data, setData }: any) {
  const addExp = () => {
    const newExp = { id: Date.now(), company: "New Company", role: "Role", duration: "2026 - Present", description: [] };
    setData((d: any) => ({ ...d, experience: [newExp, ...(d.experience || [])] }));
  };

  const updateExp = (id: number, key: string, val: any) =>
    setData((d: any) => ({ ...d, experience: d.experience.map((e: any) => e.id === id ? { ...e, [key]: val } : e) }));

  const deleteExp = (id: number) =>
    setData((d: any) => ({ ...d, experience: d.experience.filter((e: any) => e.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Work Experience</h1>
        <button onClick={addExp} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Experience
        </button>
      </div>
      <Reorder.Group axis="y" values={data.experience || []} onReorder={(newList) => setData((d: any) => ({ ...d, experience: newList }))} className="flex flex-col gap-4">
        {(data.experience || []).map((exp: any) => (
          <Reorder.Item key={exp.id} value={exp} style={{ listStyle: "none" }}>
            <div className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ cursor: "grab", color: "var(--muted)" }}><GripVertical size={18} /></div>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{exp.company}</span>
                </div>
                <button onClick={() => deleteExp(exp.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Company" value={exp.company} onChange={(e: any) => updateExp(exp.id, "company", e.target.value)} />
                <InputField label="Role" value={exp.role} onChange={(e: any) => updateExp(exp.id, "role", e.target.value)} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField label="Duration" value={exp.duration} onChange={(e: any) => updateExp(exp.id, "duration", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField type="textarea" label="Achievements (one per line)" value={(exp.description || []).join("\n")} onChange={(e: any) => updateExp(exp.id, "description", e.target.value.split("\n"))} placeholder="Bullet points..." />
                </div>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

/** Reorder item that only drags from its handle, so inputs inside stay usable. */
function HandleReorderItem({
  value,
  renderHandle,
  children,
}: {
  value: any;
  renderHandle: (start: (e: React.PointerEvent) => void) => React.ReactNode;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={value} dragListener={false} dragControls={controls} className="admin-card" style={{ listStyle: "none" }}>
      {renderHandle((e) => controls.start(e))}
      {children}
    </Reorder.Item>
  );
}
// ─── Creative Works Tab ───────────────────────────────────────
function CreativeWorksTab({ data, setData }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [activeWorkId, setActiveWorkId] = useState<number | null>(null);
  const [galleryWorkId, setGalleryWorkId] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [videoWorkId, setVideoWorkId] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState<{ id: number; pct: number } | null>(null);
  const [videoError, setVideoError] = useState<{ id: number; msg: string } | null>(null);

  // Large video files go straight from the browser to Vercel Blob.
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = videoWorkId;
    e.target.value = "";
    if (!file || id === null) return;
    setVideoError(null);
    setVideoProgress({ id, pct: 0 });
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await blobUpload(`videos/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/blob",
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setVideoProgress({ id, pct: Math.round(percentage) }),
      });
      listUpdate(id, "videos", (l) => [...l, blob.url]);
    } catch (err) {
      setVideoError({ id, msg: err instanceof Error ? err.message : "Upload failed" });
    }
    setVideoProgress(null);
    setVideoWorkId(null);
  };

  const addWork = () => {
    const newWork = { id: Date.now(), client: "Client Name", role: "UI/UX", program: "Figma", year: "2026", description: "", image: "", gallery: [], videos: [] };
    setData((d: any) => ({ ...d, creativeWorks: [...(d.creativeWorks || []), newWork] }));
  };

  const updateWork = (id: number, key: string, val: any) =>
    setData((d: any) => ({ ...d, creativeWorks: d.creativeWorks.map((w: any) => w.id === id ? { ...w, [key]: val } : w) }));

  const deleteWork = (id: number) =>
    setData((d: any) => ({ ...d, creativeWorks: d.creativeWorks.filter((w: any) => w.id !== id) }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeWorkId === null) return;
    
    const form = new FormData();
    form.append("file", file);
    
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      updateWork(activeWorkId, "image", url);
    }
    setActiveWorkId(null);
  };

  const triggerUpload = (id: number) => {
    setActiveWorkId(id);
    fileRef.current?.click();
  };

  // Gallery: several images at once, appended to the carousel
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const id = galleryWorkId;
    e.target.value = "";
    if (!files.length || id === null) return;
    setUploadingGallery(id);
    const urls: string[] = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        const { url } = await res.json();
        if (url) urls.push(url);
      }
    }
    setData((d: any) => ({
      ...d,
      creativeWorks: d.creativeWorks.map((w: any) => (w.id === id ? { ...w, gallery: [...(w.gallery || []), ...urls] } : w)),
    }));
    setUploadingGallery(null);
    setGalleryWorkId(null);
  };

  const listUpdate = (id: number, key: "gallery" | "videos", fn: (list: string[]) => string[]) =>
    setData((d: any) => ({
      ...d,
      creativeWorks: d.creativeWorks.map((w: any) => (w.id === id ? { ...w, [key]: fn(w[key] || []) } : w)),
    }));

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} />
      <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} style={{ display: "none" }} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Creative Works</h1>
        <button onClick={addWork} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Work
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {(data.creativeWorks || []).map((work: any, i: number) => (
          <div key={work.id} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
              <div className="flex items-center gap-3">
                <div style={{ background: "rgba(245,158,11,0.1)", color: "var(--primary)", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{work.client}</span>
              </div>
              <button onClick={() => deleteWork(work.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start">
              {/* Thumbnail Preview/Upload */}
              <div>
                <label style={labelStyle}>Thumbnail</label>
                <div 
                  style={{ 
                    width: "100%", 
                    aspectRatio: "16/9", 
                    backgroundColor: "rgba(5,5,16,0.5)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "10px", 
                    overflow: "hidden", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: "8px"
                  }}
                >
                  {work.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={work.image} alt="Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Palette size={24} style={{ color: "var(--muted)" }} />
                  )}
                </div>
                <button 
                  onClick={() => triggerUpload(work.id)}
                  style={{ width: "100%", padding: "8px", background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Upload size={12} /> Upload Image
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Client Name" value={work.client} onChange={(e: any) => updateWork(work.id, "client", e.target.value)} />
                <InputField label="Role (e.g. UI/UX)" value={work.role} onChange={(e: any) => updateWork(work.id, "role", e.target.value)} />
                <InputField label="Program (e.g. Figma)" value={work.program} onChange={(e: any) => updateWork(work.id, "program", e.target.value)} />
                <InputField label="Year" value={work.year} onChange={(e: any) => updateWork(work.id, "year", e.target.value)} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField type="textarea" label="Description (Shown when expanded)" value={work.description} onChange={(e: any) => updateWork(work.id, "description", e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Gallery (carousel images) ── */}
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #262626" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ ...labelStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Images size={12} /> Carousel images ({(work.gallery || []).length})
                </label>
                <button
                  onClick={() => { setGalleryWorkId(work.id); galleryRef.current?.click(); }}
                  disabled={uploadingGallery === work.id}
                  style={smallBtn}
                >
                  {uploadingGallery === work.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {uploadingGallery === work.id ? "Uploading…" : "Add images"}
                </button>
              </div>
              {(work.gallery || []).length === 0 ? (
                <p style={{ fontSize: "0.75rem", color: "#737373" }}>No extra images yet. The thumbnail is always the first slide.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "8px" }}>
                  {(work.gallery || []).map((src: string, gi: number) => (
                    <div key={src + gi} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        aria-label="Remove image"
                        onClick={() => listUpdate(work.id, "gallery", (l) => l.filter((_, j) => j !== gi))}
                        style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.75)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Video links ── */}
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #262626" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ ...labelStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Link2 size={12} /> Videos — upload MP4 or paste YouTube / TikTok / Instagram link
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => { setVideoWorkId(work.id); videoRef.current?.click(); }}
                    disabled={!!videoProgress}
                    style={{ ...smallBtn, opacity: videoProgress ? 0.6 : 1 }}
                  >
                    {videoProgress?.id === work.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {videoProgress?.id === work.id ? `Uploading ${videoProgress?.pct ?? 0}%` : "Upload video"}
                  </button>
                  <button onClick={() => listUpdate(work.id, "videos", (l) => [...l, ""])} style={smallBtn}>
                    <Plus size={12} /> Add link
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {(work.videos || []).map((link: string, vi: number) => {
                  const info = parseVideo(link);
                  const ok = info && (info.embed || info.platform === "file");
                  return (
                    <div key={vi} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span
                        style={{
                          minWidth: 84, textAlign: "center", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                          padding: "6px 8px", borderRadius: 6,
                          background: !link ? "#262626" : ok ? "rgba(132,204,22,0.15)" : "rgba(245,158,11,0.15)",
                          color: !link ? "#737373" : ok ? "#a3e635" : "#f59e0b",
                        }}
                        title={info && !ok ? "Can't embed this link — it will show as an 'Open' button. For TikTok use the full link with /video/…" : undefined}
                      >
                        {!link ? "Empty" : info ? PLATFORM_LABEL[info.platform] : "Invalid"}
                      </span>
                      <input
                        className="admin-input"
                        value={link}
                        placeholder="https://www.youtube.com/watch?v=…  ·  https://www.instagram.com/reel/…  ·  https://www.tiktok.com/@user/video/…"
                        onChange={(e) => listUpdate(work.id, "videos", (l) => l.map((x, j) => (j === vi ? e.target.value : x)))}
                      />
                      <button
                        aria-label="Remove link"
                        onClick={() => listUpdate(work.id, "videos", (l) => l.filter((_, j) => j !== vi))}
                        style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
                {videoError?.id === work.id && (
                  <p style={{ fontSize: "0.75rem", color: "#f87171" }}>Video upload failed: {videoError?.msg}</p>
                )}
                {(work.videos || []).length === 0 && (
                  <p style={{ fontSize: "0.75rem", color: "#737373" }}>Paste a link to show the video inside the carousel.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Music Tab (vinyl background player) ──────────────────
function MusicTab({ data, setData }: any) {
  const audioInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [busy, setBusy] = useState<{ id: number; label: string } | null>(null);
  const [err, setErr] = useState<{ id: number; msg: string } | null>(null);
  const tracks: any[] = data.music || [];

  const update = (id: number, key: string, val: string) =>
    setData((d: any) => ({ ...d, music: (d.music || []).map((t: any) => (t.id === id ? { ...t, [key]: val } : t)) }));
  const add = () =>
    setData((d: any) => ({ ...d, music: [...(d.music || []), { id: Date.now(), title: "Track title", artist: "", src: "", cover: "" }] }));
  const remove = (id: number) => setData((d: any) => ({ ...d, music: (d.music || []).filter((t: any) => t.id !== id) }));

  const onAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = targetId;
    e.target.value = "";
    if (!file || id === null) return;
    setErr(null);
    setBusy({ id, label: "Uploading 0%" });
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await blobUpload(`music/${safe}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/blob",
        onUploadProgress: ({ percentage }) => setBusy({ id, label: `Uploading ${Math.round(percentage)}%` }),
      });
      update(id, "src", blob.url);
    } catch (error) {
      setErr({ id, msg: error instanceof Error ? error.message : "Upload failed" });
    }
    setBusy(null);
  };

  const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = targetId;
    e.target.value = "";
    if (!file || id === null) return;
    setBusy({ id, label: "Uploading cover…" });
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.url) update(id, "cover", json.url);
    else setErr({ id, msg: json.error || "Cover upload failed" });
    setBusy(null);
  };

  return (
    <div>
      <input ref={audioInput} type="file" accept="audio/*" onChange={onAudio} style={{ display: "none" }} />
      <input ref={coverInput} type="file" accept="image/*" onChange={onCover} style={{ display: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Background Music</h1>
        <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Track
        </button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#a3a3a3", marginBottom: "24px" }}>
        Plays in the small vinyl player at the bottom-left. Visitors start it themselves (browsers block autoplay with sound).
        Only use music you have the rights to.
      </p>

      {tracks.length === 0 && (
        <div className="admin-card" style={{ textAlign: "center", color: "#737373", fontSize: "0.85rem" }}>
          No tracks yet — the vinyl player stays hidden until you add one.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {tracks.map((t: any, i: number) => (
          <div key={t.id} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div className="flex items-center gap-3">
                <div style={{ background: "rgba(245,158,11,0.1)", color: "var(--primary)", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{t.title || "Untitled"}</span>
              </div>
              <button onClick={() => remove(t.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 items-start">
              <div>
                <label style={labelStyle}>Cover</label>
                <div style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", border: "1px solid #333", background: "repeating-radial-gradient(circle, #0d0d0e 0 2px, #1d1d20 2px 4px)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                  <div style={{ width: "40%", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", background: "#bef264" }}>
                    {t.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                </div>
                <button onClick={() => { setTargetId(t.id); coverInput.current?.click(); }} style={{ ...smallBtn, width: "100%", justifyContent: "center" }}>
                  <Upload size={12} /> Cover
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Title" value={t.title} onChange={(e: any) => update(t.id, "title", e.target.value)} />
                  <InputField label="Artist" value={t.artist} onChange={(e: any) => update(t.id, "artist", e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    className="admin-input"
                    value={t.src || ""}
                    placeholder="Audio URL (.mp3 / .m4a) — or upload a file"
                    onChange={(e) => update(t.id, "src", e.target.value)}
                  />
                  <button
                    onClick={() => { setTargetId(t.id); audioInput.current?.click(); }}
                    disabled={!!busy}
                    style={{ ...smallBtn, flexShrink: 0, opacity: busy ? 0.6 : 1 }}
                  >
                    {busy?.id === t.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {busy?.id === t.id ? busy?.label : "Upload audio"}
                  </button>
                </div>
                {t.src && <audio src={t.src} controls preload="none" style={{ width: "100%", height: 36 }} />}
                {err?.id === t.id && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>{err?.msg}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Certificates Tab (e-certificates under Experience) ───
function CertificatesTab({ data, setData }: any) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<{ id: number; msg: string } | null>(null);
  const certs: any[] = data.certificates || [];

  const update = (id: number, key: string, val: string) =>
    setData((d: any) => ({ ...d, certificates: (d.certificates || []).map((c: any) => (c.id === id ? { ...c, [key]: val } : c)) }));
  const add = () =>
    setData((d: any) => ({
      ...d,
      certificates: [{ id: Date.now(), title: "Certificate title", issuer: "", date: String(new Date().getFullYear()), file: "", credentialId: "", url: "" }, ...(d.certificates || [])],
    }));
  const remove = (id: number) => setData((d: any) => ({ ...d, certificates: (d.certificates || []).filter((c: any) => c.id !== id) }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = targetId;
    e.target.value = "";
    if (!file || id === null) return;
    setErr(null);
    if (file.size > 4 * 1024 * 1024) {
      setErr({ id, msg: "File is larger than 4 MB — please compress it (Vercel limits uploads through the server)." });
      return;
    }
    setBusyId(id);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.url) update(id, "file", json.url);
    else setErr({ id, msg: json.error || "Upload failed" });
    setBusyId(null);
  };

  const isPdf = (f: string) => /\.pdf($|\?)/i.test(f || "");

  return (
    <div>
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={onFile} style={{ display: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>E-Certificates</h1>
        <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Certificate
        </button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#a3a3a3", marginBottom: "24px" }}>
        Shown under Professional Experience. Upload the certificate as an image (JPG/PNG/WebP) or PDF, max 4 MB. Drag cards to reorder.
      </p>

      {certs.length === 0 && (
        <div className="admin-card" style={{ textAlign: "center", color: "#737373", fontSize: "0.85rem" }}>
          No certificates yet — the section stays hidden until you add one.
        </div>
      )}

      <Reorder.Group axis="y" values={certs} onReorder={(list) => setData((d: any) => ({ ...d, certificates: list }))} className="flex flex-col gap-4">
        {certs.map((c: any, i: number) => (
          <HandleReorderItem key={c.id} value={c} renderHandle={(start) => (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div className="flex items-center gap-3">
                <span onPointerDown={start} aria-label="Drag to reorder" style={{ cursor: "grab", touchAction: "none", display: "flex" }}>
                  <GripVertical size={16} style={{ color: "#737373" }} />
                </span>
                <div style={{ background: "rgba(245,158,11,0.1)", color: "var(--primary)", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{c.title || "Untitled"}</span>
              </div>
              <button onClick={() => remove(c.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
              <div>
                <label style={labelStyle}>Certificate file</label>
                <div style={{ width: "100%", aspectRatio: "1.414", borderRadius: "10px", overflow: "hidden", border: "1px solid #333", background: "#171717", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                  {c.file && !isPdf(c.file) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.file} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : c.file ? (
                    <a href={c.file} target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#a3e635", fontSize: "0.7rem", fontWeight: 700 }}>
                      <FileText size={26} /> PDF — open
                    </a>
                  ) : (
                    <Award size={26} style={{ color: "#525252" }} />
                  )}
                </div>
                <button
                  onClick={() => { setTargetId(c.id); fileInput.current?.click(); }}
                  disabled={busyId !== null}
                  style={{ ...smallBtn, width: "100%", justifyContent: "center", opacity: busyId !== null ? 0.6 : 1 }}
                >
                  {busyId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {busyId === c.id ? "Uploading…" : c.file ? "Replace file" : "Upload image / PDF"}
                </button>
                {err?.id === c.id && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 6 }}>{err?.msg}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField label="Certificate title" value={c.title} onChange={(e: any) => update(c.id, "title", e.target.value)} />
                </div>
                <InputField label="Issuer (e.g. Google, Dicoding)" value={c.issuer} onChange={(e: any) => update(c.id, "issuer", e.target.value)} />
                <InputField label="Issued (e.g. Mar 2025)" value={c.date} onChange={(e: any) => update(c.id, "date", e.target.value)} />
                <InputField label="Credential ID (optional)" value={c.credentialId} onChange={(e: any) => update(c.id, "credentialId", e.target.value)} />
                <InputField label="Verify URL (optional)" value={c.url} onChange={(e: any) => update(c.id, "url", e.target.value)} />
              </div>
            </div>
          </HandleReorderItem>
        ))}
      </Reorder.Group>
    </div>
  );
}
