import { AgentsGrid } from "@/components/landing/agents-grid";
import { DepartmentStrip } from "@/components/landing/department-strip";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Nav } from "@/components/landing/nav";
import { Pricing } from "@/components/landing/pricing";
import { SocialProof } from "@/components/landing/social-proof";

export default function LandingPage() {
  return (
    <div data-screen-label="01 AutomatizIA Landing">
      <Nav />
      <main>
        <Hero />
        <DepartmentStrip />
        <HowItWorks />
        <AgentsGrid />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
