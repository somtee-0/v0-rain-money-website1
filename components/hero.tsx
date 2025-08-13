"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap } from "lucide-react"
import { BrandLogo } from "./brand-logo"

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder-0hu2w.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/70 via-emerald-900/60 to-emerald-900/80" />

      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white" aria-label="Home">
          <BrandLogo className="h-8 w-8" />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/90">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <a href="#why-choose" className="hover:text-white">
            Why choose us
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
          <Link href="/apply">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">Apply Now</Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Link href="/apply">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
              Apply
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-40 text-white">
        {/* Headline and subtext removed per request; keeping subtle feature chips */}
        <div className="max-w-3xl">
          <div className="mt-8 flex items-center gap-6 text-emerald-100/90">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              <span>{"Bank-grade security"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              <span>{"Fast disbursement"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
