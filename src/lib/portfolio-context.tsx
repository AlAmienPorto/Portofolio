"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────
export interface PortfolioProfile {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  experience: string;
  availability: string;
  photo: string;
  email: string;
  whatsapp: string;
}

export interface PortfolioSocials {
  whatsapp: string;
  linkedin: string;
  instagram: string;
  github: string;
  email: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  color?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  logo: string;
  description: string[];
}

export interface CreativeWork {
  id: number;
  client: string;
  role: string;
  program: string;
  description: string;
  image: string;
  year: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  socials: PortfolioSocials;
  skills: Skill[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  experience: Experience[];
  creativeWorks: CreativeWork[];
}

// ─── Default fallback data ────────────────────────────────
const defaultData: PortfolioData = {
  profile: {
    name: "Jawad Al Amien",
    tagline: "Creative Developer & UI/UX Designer",
    bio: "Creative developer building immersive digital experiences.",
    location: "Indonesia",
    experience: "5+ Years",
    availability: "Open to Projects",
    photo: "/uploads/profile.png",
    email: "alamienjawad@gmail.com",
    whatsapp: "+6285950831387",
  },
  socials: {
    whatsapp: "https://wa.me/6285950831387",
    linkedin: "#",
    instagram: "#",
    github: "#",
    email: "mailto:alamienjawad@gmail.com",
  },
  skills: [
    { name: "Next.js", icon: "⚡" }, { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "🔷" }, { name: "Framer Motion", icon: "🎞️" },
    { name: "GSAP", icon: "🌀" }, { name: "Three.js", icon: "🌐" },
  ],
  services: [
    { id: 1, title: "Creative Development", description: "Building immersive web experiences.", icon: "Code2" },
    { id: 2, title: "Front-End Engineering", description: "Scalable React/Next.js applications.", icon: "Layout" },
    { id: 3, title: "Motion Design", description: "Fluid micro-interactions and animations.", icon: "PenTool" },
    { id: 4, title: "Responsive UX/UI", description: "Pixel-perfect, cross-device layouts.", icon: "MonitorSmartphone" },
  ],
  projects: [],
  testimonials: [],
  experience: [],
  creativeWorks: [],
};


// ─── Context ──────────────────────────────────────────────
const PortfolioContext = createContext<PortfolioData>(defaultData);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(() => {
        // Fallback to default data silently
      });
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
