import CTASection from "../components/landing/features/cta-section";
import GridSection from "../components/landing/features/features-grid";
import HeroSection from "../components/landing/features/hero-section";

export default function FeaturesPage() {

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <GridSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
