import { HowItWorks } from "@/components/how-it-works"
import { WhyChoose } from "@/components/why-choose"
import { Testimonials } from "@/components/testimonials"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import { StatusChecker } from "@/components/status-checker"
import { ImageCarousel } from "@/components/image-carousel"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <main className="min-h-screen relative">
      <SiteHeader />
      <section id="stories" className="relative">
        <ImageCarousel />
      </section>
      <section id="how-it-works" className="container mx-auto px-4 py-16 sm:py-24">
        <HowItWorks />
      </section>
      <section id="why-choose" className="bg-emerald-50/60">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <WhyChoose />
        </div>
      </section>
      <section id="status" className="container mx-auto px-4 py-12 sm:py-16">
        <StatusChecker />
      </section>
      <section id="testimonials" className="container mx-auto px-4 py-16 sm:py-24">
        <Testimonials />
      </section>
      <section id="faq" className="bg-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <FaqSection />
        </div>
      </section>
      <section id="contact" className="bg-gradient-to-b from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <ContactSection />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
