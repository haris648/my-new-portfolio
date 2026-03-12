"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const experiences = [
  {
    role: "Senior Web Developer (with AI expertise)",
    company: "Holiday Factory",
    location: "Dubai",
    date: "Aug 2025 – Present",
    description: [
      "Developed and maintained custom websites using WordPress, JSP, JavaScript, and custom themes built with ACF fields.",
      "Built and integrated smart booking engines for both Holiday Factory and Holiday Factory Premium, integrating APIs for hotel, flight, and Payfort booking systems.",
      "Developed AI-powered solutions to automate backend workflows and enhance customer experience through N8N and Make.com AI Automation.",
      "Built custom WordPress sites from scratch, supporting the marketing/product department in managing and uploading tour deals.",
      "Enhanced website performance through real-time data updates and Web Socket integration, improving user engagement and booking conversions.",
      "Collaborated with senior engineers and product teams to ensure seamless backend integration and high system reliability for travel and booking platforms."
    ]
  },
  {
    role: "Web Developer with SEO",
    company: "Spider Business Network",
    location: "Dubai",
    date: "July 2024 – Aug 2025",
    description: [
      "Built and maintained SEO-friendly, responsive websites using WordPress, and custom HTML/CSS/JavaScript.",
      "Developed user-friendly UI/UX designs to enhance customer experience and reduce bounce rates.",
      "Implemented technical SEO strategies to optimize website speed, indexing, and mobile responsiveness.",
      "Integrated schema markup, managed redirects, and improved site architecture for better search engine performance.",
      "Conducted performance audits and implemented optimizations that increased organic traffic by 25%.",
      "Supported SEO campaigns by optimizing on-page elements and local listings (Google My Business)."
    ]
  },
  {
    role: "Senior Web Developer",
    company: "Cooperative Computing",
    location: "Karachi",
    date: "Nov 2021 – May 2023",
    description: [
      "Directed creation and maintenance of company websites using Laravel and WordPress.",
      "Led client meetings to gather requirements, provide technical consultation, and ensure project delivery.",
      "Enhanced company’s web solutions with customized CMS integrations, improving project delivery by 30%."
    ]
  },
  {
    role: "Team Lead",
    company: "Soft Nation Technologies",
    location: "Karachi",
    date: "Nov 2020 – Nov 2021",
    description: [
      "Led a team of developers to create brand and corporate websites across diverse industries.",
      "Managed project timelines, resource allocation, and client communication, improving team efficiency by 20%.",
      "Played a key role in organizational growth through effective leadership in both technical & managerial domains."
    ]
  },
  {
    role: "CMS Developer/Lead",
    company: "Infusion Creative Agency",
    location: "Karachi",
    date: "Jan 2017 – Sep 2019",
    description: [
      "Started as a WordPress Developer and became Lead after 1 year.",
      "Developed and launched over 40 WordPress, Wix, and Shopify websites for clients.",
      "Oversaw project management from concept to deployment, ensuring high-quality deliverables and client satisfaction."
    ]
  }
];

export default function Experience() {
  const containerRef = useRef(null);

  // We use useScroll to measure how far down we've scrolled inside the Experience section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative z-20 bg-background text-white py-32 px-6 lg:px-12 border-t border-white/10 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Professional Experience</h3>
          <p className="text-zinc-400 max-w-xl text-lg md:text-xl font-light mx-auto md:mx-0">
            Over 8 years of engineering high-performance web experiences and leading technical teams.
          </p>
        </motion.div>

        {/* Desktop Timeline Center Line */}
        <div className="absolute left-1/2 top-48 bottom-0 w-[1px] bg-white/10 hidden md:block -translate-x-1/2" />
        <motion.div
          style={{ scaleY: pathLength, transformOrigin: 'top' }}
          className="absolute left-1/2 top-48 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 to-emerald-400 hidden md:block -translate-x-1/2 z-10"
        />

        <div className="flex flex-col gap-12 md:gap-8 relative z-20">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={index} className={`flex flex-col md:flex-row items-center justify-between w-full`}>

                {/* Desktop Left Side */}
                <div className={`hidden md:flex w-[45%] ${isEven ? 'justify-end' : 'opacity-0'}`}>
                  {isEven && <Card exp={exp} index={index} />}
                </div>

                {/* Timeline Dot (Desktop only) */}
                <div className="hidden md:flex w-10 h-10 absolute left-1/2 -translate-x-1/2 rounded-full bg-[#161616] border-[3px] border-cyan-500 items-center justify-center z-30 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>

                {/* Desktop Right Side */}
                <div className={`hidden md:flex w-[45%] ${!isEven ? 'justify-start' : 'opacity-0'}`}>
                  {!isEven && <Card exp={exp} index={index} />}
                </div>

                {/* Mobile View */}
                <div className="md:hidden relative pl-6 border-l border-white/10 w-full">
                  <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10" />
                  <Card exp={exp} index={index} isMobile />
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

function Card({ exp, index, isMobile = false }: { exp: any; index: number; isMobile?: boolean }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: isMobile ? 0 : (isEven ? -30 : 30) }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden w-full lg:max-w-[100%]"
    >
      {/* Hover subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0" />

      <div className="relative h-full bg-[#161616]/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 flex flex-col z-10 border border-white/5 shadow-2xl text-left">
        <div className="flex flex-col mb-5 gap-1.5 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider font-mono">
              {exp.date}
            </span>
            <span className="w-8 h-[1px] bg-white/20 hidden sm:block"></span>
            <span className="text-emerald-400/90 text-sm font-medium tracking-wide hidden sm:block">
              {exp.company}
            </span>
          </div>

          <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-snug mt-1">
            {exp.role}
          </h4>

          <span className="text-zinc-400 font-medium text-sm md:text-base flex items-center gap-2 sm:hidden">
            {exp.company} <span className="text-white/20">•</span> {exp.location}
          </span>
          <span className="text-zinc-400 font-medium text-sm md:text-base items-center gap-2 hidden sm:flex">
            {exp.location}
          </span>
        </div>

        <ul className="text-zinc-300 text-sm md:text-[15px] font-light leading-relaxed list-none space-y-3 relative">
          {exp.description.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              <span className="text-emerald-500 mr-3 mt-[2px] text-lg leading-none">▹</span>
              <span className="flex-1 opacity-90 group-hover:opacity-100 transition-opacity">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
