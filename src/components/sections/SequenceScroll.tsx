"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const FRAME_COUNT = 240;

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Load images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Files are named ezgif-frame-001.jpg etc.
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          setImagesLoaded(true);
        }
      };

      loadedImages.push(img);
    }
  }, []);

  // Update Canvas on Scroll
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to window size to fill screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(0); // initial render
    };

    // Draw the image onto canvas using cover logic
    const renderFrame = (frameIndex: number) => {
      if (!images[frameIndex]) return;
      const img = images[frameIndex];

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const unsubscribe = scrollYProgress.onChange((latest) => {
      const currentFrame = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );
      renderFrame(currentFrame);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      unsubscribe();
    };
  }, [imagesLoaded, scrollYProgress, images]);

  // Opacity transforms for each text section based on scrollYProgress
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 0.95, 1], [0, 1, 1, 0]);

  const y1 = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [50, 0, 0, -50]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [50, 0, 0, -50]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [50, 0, 0, -50]);
  const y4 = useTransform(scrollYProgress, [0.8, 0.9, 0.95, 1], [50, 0, 0, -50]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-black">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Sequence Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        />

        {/* Gradient overlays to ensure text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />

        {/* Text Section 1 (5%) - Center */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center"
        >
          <h2 className="text-xl md:text-3xl uppercase tracking-widest text-zinc-400 mb-4">
            Hello,
          </h2>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
            My Name is Jawad Al Amien.<br />Creative Designer
          </h1>
        </motion.div>

        {/* Text Section 2 (30%) - Left Aligned */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 flex flex-col items-start justify-center pointer-events-none p-8 md:p-24"
        >
          <p className="text-3xl md:text-6xl font-bold uppercase leading-tight max-w-4xl text-left">
            Crafting Digital Experiences That Leave A Lasting Impression Through Motion And Code.
          </p>
        </motion.div>

        {/* Text Section 3 (60%) - Right Aligned */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 flex flex-col items-end justify-center pointer-events-none p-8 md:p-24"
        >
          <p className="text-3xl md:text-6xl font-bold uppercase leading-tight max-w-4xl text-right">
            Where Creativity Meets Scalable Architecture. Building The Future Of Web.
          </p>
        </motion.div>

        {/* Text Section 4 (90%) - Center with CTA */}
        <motion.div
          style={{ opacity: opacity4, y: y4 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center"
        >
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8">
            Let's build something<br />exceptional together.
          </h2>
          <a
            href="#contact"
            className="hover-target pointer-events-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
          >
            Start A Project
          </a>
        </motion.div>

      </div>
    </section>
  );
}
