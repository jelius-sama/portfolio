import AboutSection from "@/components/layout/about-section";
import ContactsSection from "@/components/layout/contacts-section";
import ExploreSection from "@/components/layout/explore-section";
import HeroSection from "@/components/layout/hero-section";
import ProjectsSection from "@/components/layout/projects-section";

export default function HomePage() {
  return (
    <section id="home-root" className="w-full">
      <HeroSection />
      <AboutSection />
      <ExploreSection />
      <ProjectsSection />
      <ContactsSection />
    </section>
  );
}

