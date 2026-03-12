"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    // Section 1: 0% to 15% (Fade out earlier to give room)
    const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

    // Section 2: "I build digital experiences" (15% to 55%)
    // Starts fading in earlier and lasts longer
    const opacity2 = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.15, 0.60], [50, -50]);

    // Section 3: "Bridging design and engineering" (55% to 95%) 
    // Starts fading in earlier and lasts longer
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 0.95], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.60, 0.98], [50, -50]);

    // Section 4 (Bonus, fading into next section): 95% to 100%
    const opacity4 = useTransform(scrollYProgress, [0.95, 0.98, 1], [0, 1, 1]);
    const y4 = useTransform(scrollYProgress, [0.95, 1], [50, 0]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative w-full h-full max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section 1 */}
                <motion.div
                    style={{ opacity: opacity1, y: y1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center mb-24"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                        Syed Haris
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide uppercase">
                        Creative Developer
                    </p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                    style={{ opacity: opacity2, y: y2 }}
                    className="absolute inset-0 flex flex-col items-start justify-center max-w-2xl"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-xl">
                        I build <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">digital experiences.</span>
                    </h2>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                    style={{ opacity: opacity3, y: y3 }}
                    className="absolute inset-0 flex flex-col items-end justify-center text-right"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-xl">
                            Bridging <br />
                            <span className="text-neutral-400 font-light italic">design</span> and <span className="text-white">engineering.</span>
                        </h2>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
