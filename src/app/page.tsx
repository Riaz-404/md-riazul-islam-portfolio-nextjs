import { Navigation } from "@/components/shared/navigation";
import { HeroSection } from "@/components/hero-section/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
    </main>
  );
}
