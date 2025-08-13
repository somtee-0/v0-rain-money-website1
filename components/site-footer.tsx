import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">Copyright ©️ 2025 Rain Money</p>
        </div>
      </div>
    </footer>
  )
}
