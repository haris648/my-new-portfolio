"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 129; // 00 to 76

// Helper to format frame string
const getFramePath = (index: number) => {
    const paddedIndex = index.toString().padStart(3, "0");
    return `/about-animation/frame_${paddedIndex}_delay-0.066s.webp`;
};

const textSteps = [
    { type: 'text', content: "Building websites that rank, convert, and run on autopilot — powered by AI." },
    { type: 'text', content: "I'm a results-driven Full-Stack Developer with 8+ years of experience turning ideas into high-performing digital products." },
    { type: 'text', content: "From e-commerce platforms and SaaS systems to hybrid mobile apps and real-time booking engines." },
    { type: 'text', content: "Currently driving innovation at Holiday Factory Dubai building AI-powered travel platforms serving thousands of users." },
    { type: 'pills', content: ["React", "Next.js", "Node.js", "WordPress", "PHP", "Laravel", "React Native", "Firebase", "Tailwind", "N8N", "Make"] },
    {
        type: 'bullets', content: [
            "100+ Websites Delivered",
            "AI Automation Pipelines",
            "SEO & AI Search Optimization",
            "Real-time Booking Engine Architecture",
            "FinTech & WebSocket integrations",
            "Team Leadership & Consulting"
        ]
    },
    { type: 'contact', content: "Whether you're looking to build a product, rank on AI search, or automate your business — let's connect." }
];

export default function AboutScrolly() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const currentFrame = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Preload images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                setImagesLoaded(loadedCount);
            };
            images.push(img);
        }
        imagesRef.current = images;
    }, []);

    // Update canvas on scroll
    useEffect(() => {
        let animationFrameId: number;
        let lastRenderedFrame = -1;

        const render = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx || imagesRef.current.length < TOTAL_FRAMES) return;

            const frameIndex = Math.min(Math.floor(currentFrame.get()), TOTAL_FRAMES - 1);

            if (!canvas) return;
            const { width, height } = canvas.getBoundingClientRect();

            // Optimization: skip draw if frame and size haven't changed
            if (
                frameIndex === lastRenderedFrame &&
                canvas.width === Math.floor(width * window.devicePixelRatio) &&
                canvas.height === Math.floor(height * window.devicePixelRatio)
            ) {
                return;
            }

            const img = imagesRef.current[frameIndex];

            if (img && img.complete) {
                // Ensure correct HiDPI scale
                if (canvas.width !== Math.floor(width * window.devicePixelRatio) ||
                    canvas.height !== Math.floor(height * window.devicePixelRatio)) {
                    canvas.width = Math.floor(width * window.devicePixelRatio);
                    canvas.height = Math.floor(height * window.devicePixelRatio);
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                }

                ctx.clearRect(0, 0, width, height);

                // Calculate aspect ratios for full width "cover"
                const imgRatio = img.width / img.height;
                const canvasRatio = width / height;

                let drawWidth, drawHeight, offsetX, offsetY;
                const isMobile = width < 768;

                if (isMobile) {
                    // Shrink the image so the man isn't huge and cropped on mobile
                    drawHeight = height * 0.65;
                    drawWidth = drawHeight * imgRatio;

                    // Pull the man towards the center right
                    offsetX = width - drawWidth + (drawWidth * 0.15);
                    // Center vertically slightly lower for mobile UI layout
                    offsetY = (height - drawHeight) / 2 + (height * 0.05);

                } else {
                    if (canvasRatio > imgRatio) {
                        // Screen is wider than the image: scale image to fit width, height overflows
                        drawWidth = width;
                        drawHeight = width / imgRatio;

                        // Align flush right
                        offsetX = width - drawWidth;
                        // Align flush top (0) so the head is never cropped off when height overflows
                        offsetY = 0;
                    } else {
                        // Screen is taller than the image: scale image to fit height, width overflows
                        drawHeight = height;
                        drawWidth = height * imgRatio;

                        // Align flush right
                        offsetX = width - drawWidth;
                        // Fills the screen perfectly vertically
                        offsetY = 0;
                    }
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                lastRenderedFrame = frameIndex;
            }
        };

        const requestRender = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
        };

        // 1. Initial draw sequence
        requestRender();

        // 2. Drive the sequence on scroll 
        const unsubscribe = currentFrame.on("change", requestRender);

        // 3. Manage canvas resizing properly
        window.addEventListener("resize", requestRender);

        // 4. Poll checking if images are loaded to draw first frame
        const loadCheckInterval = setInterval(() => {
            if (imagesRef.current.length >= TOTAL_FRAMES && imagesRef.current[0]?.complete) {
                requestRender();
                clearInterval(loadCheckInterval);
            }
        }, 100);

        return () => {
            cancelAnimationFrame(animationFrameId);
            unsubscribe();
            window.removeEventListener("resize", requestRender);
            clearInterval(loadCheckInterval);
        };
    }, [currentFrame]);

    return (
        <section ref={containerRef} className="relative w-full h-[500vh] bg-[#121212]">
            {/* Sticky Canvas Container */}
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden">
                {/* The Animated Canvas Background taking up the full width */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />

                    {/* Dark overlay specifically for mobile to guarantee text is readable over the smaller canvas */}
                    <div className="absolute inset-0 bg-black/60 md:bg-transparent z-10 pointer-events-none" />

                    {/* Shadow overlay from the left so the white/cyan text is readable against the bright background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/70 to-transparent z-10 pointer-events-none" />

                    {/* Heavy Top/Bottom gradients on mobile to blur out the hard image borders from scaling, soft on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212] z-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-transparent to-[#121212] md:hidden z-10 pointer-events-none opacity-90" />
                </div>

                {/* Left Side Content Mask/Scroll Area */}
                {/* We use an absolute overlay to hold the scrolling container inside the section */}
            </div>

            {/* Actually Scrolling Text Content */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full h-full flex flex-col pt-[30vh] pb-[30vh]">

                    <div className="w-full md:w-[500px] pointer-events-auto flex flex-col gap-[25vh] md:gap-[35vh]">
                        {/* Intro Header */}
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, margin: "-10%" }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="text-sm tracking-[0.2em] text-cyan-500 font-semibold mb-3 uppercase"
                            >
                                About Me
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, margin: "-10%" }}
                                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                                className="text-3xl md:text-5xl font-bold leading-tight text-white mb-6"
                            >
                                Full-Stack Web Developer <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI Automation Expert</span> <br />
                                <span className="text-2xl md:text-3xl text-zinc-400 font-light">SEO & AI Search Specialist</span>
                            </motion.h3>
                        </div>

                        {/* Middle Steps */}
                        {textSteps.map((step, index) => (
                            <StepBlock key={index} step={step} index={index} />
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
}

function StepBlock({ step, index }: { step: any, index: number }) {
    if (step.type === 'text') {
        return (
            <div className="overflow-hidden">
                <motion.p
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed border-l-2 border-cyan-500/50 pl-6"
                >
                    {step.content}
                </motion.p>
            </div>
        );
    }

    if (step.type === 'pills') {
        return (
            <div className="flex flex-wrap gap-3">
                {step.content.map((pill: string, i: number) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: false, margin: "-10%" }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-sm"
                    >
                        {pill}
                    </motion.span>
                ))}
            </div>
        );
    }

    if (step.type === 'bullets') {
        return (
            <div className="grid grid-cols-1 gap-4">
                {step.content.map((bullet: string, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-10%" }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-4 cursor-default group"
                    >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <span className="text-white font-medium">{bullet}</span>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (step.type === 'contact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ duration: 0.7 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-white/10 backdrop-blur-xl"
            >
                <p className="text-lg md:text-xl text-zinc-300 font-light mb-6">
                    {step.content}
                </p>
                <div className="flex flex-col gap-2">
                    <a href="mailto:haris.me97@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-2">
                        <span>✉</span> haris.me97@gmail.com
                    </a>
                    <a href="https://haris.howtogulf.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-2">
                        <span>🌍</span> haris.howtogulf.com
                    </a>
                </div>
            </motion.div>
        );
    }

    return null;
}
