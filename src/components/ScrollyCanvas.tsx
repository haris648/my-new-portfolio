"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 120; // 0 to 119

const getFramePath = (index: number) => {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/frame_${paddedIndex}_delay-0.066s.webp`;
};

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map 0 -> 1 progress to 0 -> 119 frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    // Preload all frames
    const preloadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === FRAME_COUNT) {
                setLoaded(true);
            }
        };
        // For cached images, onload might fire synchronously or might not be needed if we check complete,
        // but it's okay to just push.
        preloadedImages.push(img);
    }
    
    setImages(preloadedImages);
  }, []);

  const renderFrame = (index: number) => {
    if (!canvasRef.current || !images[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];

    // Responsive Canvas dimensions matching actual viewing area
    const cw = canvas.width;
    const ch = canvas.height;
    
    // Calculate aspect ratio for object-fit: cover
    const scale = Math.max(cw / img.width, ch / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (loaded) {
        renderFrame(Math.floor(latest));
    }
  });

  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;
    
    const handleResize = () => {
        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;
        renderFrame(Math.floor(frameIndex.get()));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial render

    return () => window.removeEventListener("resize", handleResize);
  }, [loaded, images]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
