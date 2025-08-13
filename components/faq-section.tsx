"use client"

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"

type FAQ = { question: string; answer: string }

export function FaqSection() {
  const [faqs, setFaqs] = React.useState<FAQ[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/faq", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (active) setFaqs(data.faqs || [])
        }
      } catch {
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-8">
        <Badge className="bg-emerald-600 hover:bg-emerald-700">Your Questions</Badge>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-2 text-muted-foreground">Find answers to common questions.</p>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground">Loading FAQs...</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        <span>Still need help? Reach us via WhatsApp or the contact form below.</span>
      </div>
    </div>
  )
}
