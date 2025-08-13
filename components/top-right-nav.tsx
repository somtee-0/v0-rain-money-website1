"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

export function TopRightNav() {
  return (
    <div className="fixed top-3 right-3 z-50">
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-full shadow px-2 py-1">
        <Link href="/" aria-label="Home" className="grid place-items-center">
          <BrandLogo className="h-8 w-8" />
        </Link>
        <Link href="/" className="hidden sm:block">
          <Button variant="ghost" className="text-emerald-800 hover:text-emerald-900">
            Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
