import { ProvinceGrid } from "@/components/province-grid"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { NatureGallery } from "@/components/nature-gallery"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Khám phá các tỉnh thành Việt Nam</h2>
        <ProvinceGrid />
      </section>
      <AboutSection />
      <FeaturesSection />
      <NatureGallery />
    </div>
  )
}
