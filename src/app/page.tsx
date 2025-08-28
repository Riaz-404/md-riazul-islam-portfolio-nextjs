import { Navigation } from "@/components/shared/navigation";
import { HeroSection } from "@/components/hero-section/hero-section";
import { AboutSection } from "@/components/about-section";
import { ExpertiseSection } from "@/components/expertise-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
    </main>
  );
}
