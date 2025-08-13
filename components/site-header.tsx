"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Home" className="grid place-items-center">
            <BrandLogo className="h-8 w-8" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
            aria-label="Home"
          >
            Home
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#why-choose" className="text-muted-foreground hover:text-foreground">
            Why choose us
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground">
            FAQ
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </a>
          <Link href="/apply">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Apply Now</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
