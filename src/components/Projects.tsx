"use client";

import React from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "E-Commerce Experience",
    description: "A headless storefront built with Next.js, Shopify, and WebGL elements.",
    tags: ["React", "Three.js", "Tailwind"],
  },
  {
    title: "Fintech Dashboard",
    description: "Data-heavy dashboard with real-time websocket integrations and dark mode.",
    tags: ["TypeScript", "Next.js", "Framer Motion"],
  },
  {
    title: "Creative Agency Portfolio",
    description: "Award-winning scrolling experience for a boutique design agency.",
    tags: ["GSAP", "React", "Locomotive Scroll"],
  },
  {
    title: "Web3 NFT Marketplace",
    description: "Decentralized application with smart contract interactions and IPFS.",
    tags: ["Solidity", "Next.js", "Ethers.js"],
  },
];

export default function Projects() {
  return (
    <section className="relative z-20 bg-background text-white py-32 px-6 lg:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mb-16 md:mb-24"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Work</h3>
          <p className="text-zinc-400 max-w-xl text-lg md:text-xl font-light">
            A showcase of recent projects focusing on performance, aesthetics, and meaningful interactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden"
            >
              {/* Subtle hover glow behind the card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              
              <div className="relative h-full bg-[#161616]/80 backdrop-blur-xl rounded-2xl p-8 lg:p-12 flex flex-col justify-between z-10 border border-white/5 shadow-2xl">
                <div>
                  <h4 className="text-2xl md:text-3xl font-semibold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed mb-8">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium tracking-wide uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
