"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 120; // 0 through 119 makes 120 frames total

// Helper to format frame string (e.g., frame_000_delay-0.066s.webp)
const getFramePath = (index: number) => {
    const paddedIndex = index.toString().padStart(3, "0");
    return `/bike-sequence/frame_${paddedIndex}_delay-0.066s.webp`;
};

// Skill Data Configuration
const skillCheckpoints = [
    {
        title: "Frontend Development",
        frameRange: [22, 32], // STOP 1
        color: "cyan",
        skills: [
            { name: "HTML / CSS", years: "8 Years", proficiency: 95 },
            { name: "JavaScript (ES6+)", years: "8 Years", proficiency: 90 },
            { name: "React JS", years: "5 Years", proficiency: 85 },
            { name: "Next JS", years: "3 Years", proficiency: 80 },
            { name: "Bootstrap", years: "8 Years", proficiency: 90 },
            { name: "Tailwind", years: "4 Years", proficiency: 95 },
            { name: "Git Version Control", years: "7 Years", proficiency: 85 },
        ]
    },
    {
        title: "Backend Core",
        frameRange: [48, 58], // STOP 2
        color: "emerald",
        skills: [
            { name: "PHP", years: "8 Years", proficiency: 90 },
            { name: "Node JS", years: "3 Years", proficiency: 75 },
            { name: "Laravel", years: "4 Years", proficiency: 80 },
            { name: "WebSockets (basic)", years: "2 Years", proficiency: 65 },
        ]
    },
    {
        title: "Databases",
        frameRange: [76, 86], // STOP 3
        color: "purple",
        skills: [
            { name: "SQL", years: "8 Years", proficiency: 90 },
            { name: "NoSQL", years: "3 Years", proficiency: 80 },
            { name: "Firebase", years: "4 Years", proficiency: 85 },
            { name: "PhpMyAdmin", years: "8 Years", proficiency: 95 },
        ]
    },
    {
        title: "AI / Automation",
        frameRange: [104, 114], // STOP 4
        color: "orange",
        skills: [
            { name: "N8N", years: "2 Years", proficiency: 85 },
            { name: "Make", years: "2 Years", proficiency: 85 },
            { name: "AI Agents", years: "1 Year", proficiency: 75 },
            { name: "Automation Workflows", years: "2 Years", proficiency: 90 },
        ]
    }
];

export default function SkillBikeAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Track the current frame purely as a number for internal canvas rendering
    const currentFrame = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);
    const [activeFrame, setActiveFrame] = useState(0);

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
            setActiveFrame(frameIndex);

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

                // Calculate aspect ratio / object-fit: cover logic
                const imgRatio = img.width / img.height;
                const canvasRatio = width / height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imgRatio) {
                    drawWidth = width;
                    drawHeight = width / imgRatio;
                    offsetX = 0;
                    offsetY = (height - drawHeight) / 2;
                } else {
                    drawHeight = height;
                    drawWidth = height * imgRatio;
                    offsetX = (width - drawWidth) / 2;
                    offsetY = 0;
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

    // Determine which checkpoint panel should be active
    const activeCheckpoint = skillCheckpoints.find(
        (cp) => activeFrame >= cp.frameRange[0] && activeFrame <= cp.frameRange[1]
    );

    return (
        <section ref={containerRef} className="relative w-full h-[700vh] bg-[#121212]">
            {/* Loading Overlay */}
            {imagesLoaded < TOTAL_FRAMES && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212] text-white">
                    <p className="text-sm font-medium tracking-widest uppercase">
                        Loading Animation {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
                    </p>
                </div>
            )}

            {/* Sticky Container for Canvas and UI */}
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden flex items-center justify-center">

                {/* The Animated Canvas Background */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Shadow overlays to blend canvas with the dark background */}
                <div className="absolute bg-gradient-to-b from-[#121212] via-transparent to-[#121212] z-10 pointer-events-none" />
                <div className="absolute bg-black/40 z-10 pointer-events-none" />

                {/* UI Container */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-end">
                    <AnimatePresence mode="wait">
                        {activeCheckpoint && (
                            <motion.div
                                key={activeCheckpoint.title}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full md:w-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 lg:p-10 mr-0 md:mr-10 xl:mr-20"
                            >
                                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">
                                    {activeCheckpoint.title}
                                </h3>

                                <div className="space-y-4">
                                    {activeCheckpoint.skills.map((skill, idx) => (
                                        <HoverableSkill key={idx} skill={skill} color={activeCheckpoint.color} index={idx} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-50">
                    <span className="text-xs uppercase tracking-widest text-white/50 mb-2">Scroll to ride</span>
                    <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1/2 bg-white"
                            animate={{ y: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function HoverableSkill({ skill, color, index }: { skill: any, color: string, index: number }) {
    // Determine gradient color based on the section color mapped to explicit classes 
    // to prevent Tailwind JIT from purging them
    const colorMap: Record<string, { gradient: string, textHover: string }> = {
        cyan: { gradient: "from-cyan-400 to-blue-500", textHover: "group-hover:text-cyan-400" },
        emerald: { gradient: "from-emerald-400 to-teal-500", textHover: "group-hover:text-emerald-400" },
        purple: { gradient: "from-purple-400 to-pink-500", textHover: "group-hover:text-purple-400" },
        orange: { gradient: "from-orange-400 to-red-500", textHover: "group-hover:text-orange-400" }
    };

    const gradientClass = colorMap[color]?.gradient || "from-white to-gray-400";
    const textHoverClass = colorMap[color]?.textHover || "group-hover:text-white";

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
            className="group relative"
        >
            {/* Main List Item */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 cursor-pointer">
                <span className={`text-zinc-300 font-medium transition-colors duration-300 ${textHoverClass}`}>
                    {skill.name}
                </span>
                <span className="text-white/30 text-xs">▹</span>
            </div>

            {/* Floating Hover Card */}
            <div className="absolute left-[-20px] top-full mt-2 w-[calc(100%+40px)] z-30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
                <div className="bg-[#1a1a1a]/95 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Subtle background glow on hover card */}
                    <div className={`absolute -inset-10 opacity-20 bg-gradient-to-r ${gradientClass} blur-xl`} />

                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Experience</p>
                                <span className="text-white font-bold">{skill.years}</span>
                            </div>
                            <span className="text-white/60 text-sm font-mono">{skill.proficiency}%</span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
