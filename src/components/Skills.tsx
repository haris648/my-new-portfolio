"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: "🎨",
    skills: ["HTML/CSS", "JavaScript (ES6+)", "React JS", "Next JS", "Bootstrap", "Tailwind", "GIT Version Control"],
    color: "from-cyan-500/20 to-blue-500/20",
    border: "group-hover:border-cyan-500/50"
  },
  {
    title: "Backend Core",
    icon: "⚙️",
    skills: ["PHP", "Node JS", "Web Sockets (basic)"],
    color: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/50"
  },
  {
    title: "Databases",
    icon: "🗄️",
    skills: ["SQL", "NoSQL", "Firebase", "PhpMyAdmin"],
    color: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50"
  },
  {
    title: "CMS & Frameworks",
    icon: "📦",
    skills: ["WordPress", "Woo Commerce", "Wix", "Shopify", "Magento 2", "Laravel"],
    color: "from-orange-500/20 to-red-500/20",
    border: "group-hover:border-orange-500/50"
  },
  {
    title: "AI Automations & Agents",
    icon: "🤖",
    skills: ["N8N", "Make"],
    color: "from-indigo-500/20 to-violet-500/20",
    border: "group-hover:border-indigo-500/50"
  },
  {
    title: "Other Expertise",
    icon: "🚀",
    skills: ["React Native", "SEO/AISEO", "SMM/SEM Ads", "Graphic Designing", "Google AdSense", "Leadership", "Communication"],
    color: "from-yellow-500/20 to-amber-500/20",
    border: "group-hover:border-yellow-500/50"
  }
];

export default function Skills() {
  const containerRef = useRef(null);
  
  // Parallax effect for the background elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Framer motion variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const pillVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      show: { opacity: 1, scale: 1 }
  };

  return (
    <section ref={containerRef} className="relative z-20 bg-background text-white py-32 px-6 lg:px-12 border-t border-white/10 overflow-hidden">
      {/* Animated parallax background blobs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-[10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mb-16 md:mb-24 text-center"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Technical Arsenal</h3>
          <p className="text-zinc-400 max-w-2xl text-lg md:text-xl font-light mx-auto">
            A comprehensive toolkit scaling across frontend finesse, robust backends, and cutting-edge AI automation.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, index) => (
            <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden ${
                    index === 0 || index === 5 ? 'md:col-span-2 lg:col-span-1' : '' // Make some cards wider on tablet for a varied bento look
                }`}
            >
              {/* Dynamic hover glow based on category color */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0`} />
              
              <div className={`relative h-full bg-[#121212]/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col z-10 border border-white/5 transition-colors duration-500 ${category.border}`}>
                 <div className="flex items-center gap-4 mb-8">
                     <span className="text-3xl bg-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
                         {category.icon}
                     </span>
                     <h4 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
                         {category.title}
                     </h4>
                 </div>

                 <motion.div 
                    variants={{
                        show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
                    }}
                    className="flex flex-wrap gap-2.5 mt-auto"
                 >
                     {category.skills.map((skill, sIndex) => (
                         <motion.div 
                            key={sIndex}
                            variants={pillVariants}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 font-medium tracking-wide shadow-sm backdrop-blur-md cursor-default transition-colors duration-200"
                         >
                             {skill}
                         </motion.div>
                     ))}
                 </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
