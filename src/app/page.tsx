import ScrollyCanvas from "@/components/ScrollyCanvas";
import AboutScrolly from "@/components/AboutScrolly";
import SkillBikeAnimation from "@/components/SkillBikeAnimation";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollyCanvas />
      <AboutScrolly />
      <SkillBikeAnimation />
      <Projects />
      <Experience />
    </main>
  );
}
