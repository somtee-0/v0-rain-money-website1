"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

type Testimonial = {
  quote: string
  name: string
  location: string
}

const data: Testimonial[] = [
  { quote: "I applied and got my loan the same day. Super fast!", name: "Adeola", location: "Lagos" },
  { quote: "Great rates and excellent support. Highly recommend.", name: "Chinedu", location: "Abuja" },
  { quote: "The process was smooth and secure. 5 stars!", name: "Zainab", location: "Kano" },
  { quote: "Rain Money helped me when I needed it most.", name: "Ifeanyi", location: "Enugu" },
]

export function Testimonials() {
  const [index, setIndex] = React.useState(0)
  const next = React.useCallback(() => setIndex((i) => (i + 1) % data.length), [])
  const prev = React.useCallback(() => setIndex((i) => (i - 1 + data.length) % data.length), [])

  React.useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const t = data[index]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What Customers Say</h2>
        <p className="mt-2 text-muted-foreground">Real experiences from Nigerians nationwide.</p>
      </div>
      <Card className="relative">
        <CardContent className="p-8">
          <Quote className="h-8 w-8 text-emerald-600 mb-4" aria-hidden="true" />
          <p className="text-lg sm:text-xl leading-relaxed">
            {"“"}
            {t.quote}
            {"”"}
          </p>
          <p className="mt-4 font-semibold">
            {t.name} • <span className="text-muted-foreground">{t.location}</span>
          </p>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Button variant="ghost" size="icon" aria-label="Previous" onClick={prev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button variant="ghost" size="icon" aria-label="Next" onClick={next}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-center gap-2">
        {data.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-emerald-600" : "bg-emerald-200"}`}
          />
        ))}
      </div>
    </div>
  )
}
