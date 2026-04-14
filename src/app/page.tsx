import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/hero-section/hero-section";
import { AboutSection } from "@/components/about-section";
import { ExpertiseSection } from "@/components/expertise-section";
import { ProjectsSection } from "@/components/projects-section";
import { BlogSection } from "@/components/blog-section";
import { PublicationsSection } from "@/components/publications-section";
import { ContactSection } from "@/components/contact-section";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <ProjectsSection featured={true} limit={6} />
      <BlogSection />
      <PublicationsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
