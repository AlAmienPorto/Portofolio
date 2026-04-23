import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import SmoothScroller from "@/components/SmoothScroller";

import SequenceScroll from "@/components/sections/SequenceScroll";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Marquee from "@/components/sections/Marquee";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroller>
      <Preloader />
      <CustomCursor />
      <Navbar />
      
      <main className="w-full bg-black text-white relative">
        <SequenceScroll />
        <About />
        <Services />
        <Projects />
        <Testimonials />
        <Marquee />
        <Contact />
      </main>
    </SmoothScroller>
  );
}
