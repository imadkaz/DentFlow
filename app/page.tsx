import { FeaturesSection } from "./components/landing/features-section";
import { Footer } from "./components/landing/footer-section";
import { Header } from "./components/landing/header";
import { HeroSection } from "./components/landing/hero-section";
import { PricingSection } from "./components/landing/pricing-section";
export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}
