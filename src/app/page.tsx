import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import SmoothScroller from "@/components/SmoothScroller";
import { PortfolioProvider } from "@/lib/portfolio-context";

import Hero from "@/components/sections/SequenceScroll";
import VelocityScrollSection from "@/components/sections/VelocityScrollSection";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import SkillMarquee from "@/components/sections/Marquee";
import Contact from "@/components/sections/Contact";
import FAB from "@/components/FAB";
import BottomNav from "@/components/BottomNav";
import VinylPlayer from "@/components/VinylPlayer";

export default function Home() {
  return (
    <PortfolioProvider>
      <SmoothScroller>
        <Preloader />
        <Navbar />

        {/* Mesh gradient background (fixed, behind everything) */}
        <div className="mesh-gradient" />

        <main className="w-full relative" style={{ backgroundColor: "var(--bg)" }}>
          <Hero />
          <VelocityScrollSection />
          <About />
          <Services />
          <Projects />
          <Testimonials />
          <SkillMarquee />
          <Contact />
        </main>
        <VinylPlayer />
        <FAB />
        <BottomNav />
      </SmoothScroller>
    </PortfolioProvider>
  );
}
