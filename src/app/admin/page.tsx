"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { User, Briefcase, Code2, MessageSquare, Settings, LogOut, Plus, Trash2, Save, Eye, Upload, X, GripVertical, Menu, Palette } from "lucide-react";

const ADMIN_PASSWORD = "jawad2026";

// ─── Types ───────────────────────────────────────────────
type Tab = "profile" | "experience" | "projects" | "creative" | "skills" | "services" | "testimonials";

// ─── Main Admin Page ─────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (authenticated) {
      fetch("/api/portfolio")
        .then((r) => r.json())
        .then((res) => { if (res.success) setData(res.data); });
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _auth: ADMIN_PASSWORD }),
      });
      const result = await res.json();
      setSaveMsg(result.success ? "✓ Saved successfully!" : "✗ Save failed.");
    } catch {
      setSaveMsg("✗ Network error.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  if (!authenticated) return <LoginScreen password={password} setPassword={setPassword} onLogin={handleLogin} error={error} />;
  if (!data) return <LoadingScreen />;

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "experience" as Tab, label: "Experience", icon: Briefcase },
    { id: "projects" as Tab, label: "Projects", icon: Code2 },
    { id: "creative" as Tab, label: "Creative", icon: Palette },
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
            onClick={() => setAuthenticated(false)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: "transparent", color: "var(--muted-foreground)", borderRadius: "10px", border: "1px solid var(--border)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 w-full" style={{ maxHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            {activeTab === "profile" && <ProfileTab data={data} setData={setData} />}
            {activeTab === "experience" && <ExperienceTab data={data} setData={setData} />}
            {activeTab === "projects" && <ProjectsTab data={data} setData={setData} />}
            {activeTab === "creative" && <CreativeWorksTab data={data} setData={setData} />}
            {activeTab === "skills" && <SkillsTab data={data} setData={setData} />}
            {activeTab === "services" && <ServicesTab data={data} setData={setData} />}
            {activeTab === "testimonials" && <TestimonialsTab data={data} setData={setData} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────
function LoginScreen({ password, setPassword, onLogin, error }: any) {
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
            />
            {error && <p style={{ color: "var(--destructive)", fontSize: "0.8rem", fontWeight: 600 }}>{error}</p>}
            <button type="submit" style={{ padding: "12px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              Login →
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
const cardStyle: React.CSSProperties = { backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };

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
    <div>
      <h1 style={sectionTitle}>Profile</h1>

      <div style={cardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
          {/* Photo */}
          <div>
            <label style={labelStyle}>Profile Photo</label>
            {/* Preview */}
            <div
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "rgba(5,5,16,0.5)",
                border: "1px solid var(--border)",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data.profile.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.profile.photo}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#4a4870" }}>
                  <Upload size={32} style={{ marginBottom: "8px", color: "var(--accent)" }} />
                  <p style={{ fontSize: "0.75rem", fontWeight: 600 }}>No photo set</p>
                </div>
              )}
            </div>
            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", marginBottom: "8px", width: "100%" }}
            >
              <Upload size={13} /> Upload Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            <p style={{ color: "#4a4870", fontSize: "0.7rem", marginBottom: "4px" }}>Or enter image URL:</p>
            <input className="admin-input" value={data.profile.photo || ""} onChange={(e) => update("photo", e.target.value)} placeholder="/uploads/profile.png" />
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", placeholder: "Jawad Al Amien" },
              { key: "tagline", label: "Tagline", placeholder: "Creative Developer" },
              { key: "location", label: "Location", placeholder: "Indonesia" },
              { key: "experience", label: "Experience", placeholder: "5+ Years" },
              { key: "availability", label: "Availability", placeholder: "Open to Projects" },
              { key: "email", label: "Email (Gmail)", placeholder: "you@gmail.com" },
              { key: "whatsapp", label: "WhatsApp Number", placeholder: "+62..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={key === "bio" ? { gridColumn: "1 / -1" } : {}}>
                <label style={labelStyle}>{label}</label>
                <input className="admin-input" value={data.profile[key] || ""} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Bio</label>
              <textarea className="admin-input" rows={4} value={data.profile.bio || ""} onChange={(e) => update("bio", e.target.value)} placeholder="About yourself..." />
            </div>
          </div>
        </div>
      </div>

      {/* Socials */}
      <div style={cardStyle}>
        <h2 style={{ ...sectionTitle, fontSize: "1rem", marginBottom: "16px" }}>Social Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["whatsapp", "linkedin", "instagram", "github", "email"].map((s) => (
            <div key={s}>
              <label style={labelStyle}>{s}</label>
              <input className="admin-input" value={data.socials?.[s] || ""} onChange={(e) => updateSocial(s, e.target.value)} placeholder={`https://...`} />
            </div>
          ))}
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
      {data.projects.map((project: any) => (
        <div key={project.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{project.title}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "title", label: "Title" }, { key: "category", label: "Category" },
                { key: "year", label: "Year" }, { key: "link", label: "Link URL" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input className="admin-input" value={project[key] || ""} onChange={(e) => updateProject(project.id, key, e.target.value)} />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Image URL (Manual)</label>
                <input className="admin-input" value={project.image || ""} onChange={(e) => updateProject(project.id, "image", e.target.value)} placeholder="/projects/1.png" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Description</label>
                <textarea className="admin-input" rows={2} value={project.description || ""} onChange={(e) => updateProject(project.id, "description", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input className="admin-input" value={(project.tags || []).join(", ")} onChange={(e) => updateProject(project.id, "tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} placeholder="React, Next.js, GSAP" />
              </div>
            </div>
          </div>
        </div>
      ))}
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
            <div key={i} style={{ ...cardStyle, marginBottom: 0, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
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
                    <img src={skill.icon} alt={skill.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "1.2rem" }}>{skill.icon || "⭐"}</span>
                  )}
                </div>
                <button onClick={() => deleteSkill(i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px" }}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Skill Name</label>
                  <input className="admin-input" value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Icon (Slug or Emoji)</label>
                  <input className="admin-input" value={skill.icon} onChange={(e) => updateSkill(i, "icon", e.target.value)} placeholder="react, nextdotjs, or 🚀" />
                </div>
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
      {data.services.map((service: any) => (
        <div key={service.id} style={cardStyle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Service Title</label>
              <input className="admin-input" value={service.title} onChange={(e) => updateService(service.id, "title", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Icon Name (lucide)</label>
              <input className="admin-input" value={service.icon} onChange={(e) => updateService(service.id, "icon", e.target.value)} placeholder="Code2, Layout, PenTool..." />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea className="admin-input" rows={3} value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
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
      {data.testimonials.map((t: any) => (
        <div key={t.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: 800, color: "#f0eeff" }}>{t.author}</span>
            <button onClick={() => deleteTestimonial(t.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px] gap-3">
            <div>
              <label style={labelStyle}>Author Name</label>
              <input className="admin-input" value={t.author} onChange={(e) => updateTestimonial(t.id, "author", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <input className="admin-input" value={t.role} onChange={(e) => updateTestimonial(t.id, "role", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Initials</label>
              <input className="admin-input text-center" maxLength={2} value={t.initials} onChange={(e) => updateTestimonial(t.id, "initials", e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Quote</label>
              <textarea className="admin-input" rows={3} value={t.quote} onChange={(e) => updateTestimonial(t.id, "quote", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
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
      <Reorder.Group axis="y" values={data.experience || []} onReorder={(newList) => setData((d: any) => ({ ...d, experience: newList }))}>
        {(data.experience || []).map((exp: any) => (
          <Reorder.Item key={exp.id} value={exp} style={{ listStyle: "none", marginBottom: "16px" }}>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ cursor: "grab", color: "var(--muted)" }}><GripVertical size={18} /></div>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{exp.company}</span>
                </div>
                <button onClick={() => deleteExp(exp.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "company", label: "Company" }, { key: "role", label: "Role" },
                  { key: "duration", label: "Duration" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input className="admin-input" value={exp[key] || ""} onChange={(e) => updateExp(exp.id, key, e.target.value)} />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Achievements (one per line)</label>
                  <textarea 
                    className="admin-input" 
                    rows={4} 
                    value={(exp.description || []).join("\n")} 
                    onChange={(e) => updateExp(exp.id, "description", e.target.value.split("\n"))} 
                    placeholder="Bullet points..."
                  />
                </div>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
// ─── Creative Works Tab ───────────────────────────────────────
function CreativeWorksTab({ data, setData }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeWorkId, setActiveWorkId] = useState<number | null>(null);

  const addWork = () => {
    const newWork = { id: Date.now(), client: "Client Name", role: "UI/UX", program: "Figma", year: "2026", description: "", image: "" };
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

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ ...sectionTitle, marginBottom: 0 }}>Creative Works</h1>
        <button onClick={addWork} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
          <Plus size={14} /> Add Work
        </button>
      </div>
      {(data.creativeWorks || []).map((work: any) => (
        <div key={work.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0eeff" }}>{work.client}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "client", label: "Client Name" }, 
                { key: "role", label: "Role (e.g. UI/UX)" },
                { key: "program", label: "Program (e.g. Figma)" },
                { key: "year", label: "Year" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input className="admin-input" value={work[key] || ""} onChange={(e) => updateWork(work.id, key, e.target.value)} />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Description (Shown when expanded)</label>
                <textarea className="admin-input" rows={2} value={work.description || ""} onChange={(e) => updateWork(work.id, "description", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
