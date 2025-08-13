"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    src: "/images/carousel-1.png",
    alt: "Woman in her early 50s wearing Nigerian native attire, smiling and holding a mobile phone",
  },
  {
    src: "/images/carousel-2.png",
    alt: "Young man in his mid-20s wearing a matriculation gown, celebrating admission to school",
  },
  {
    src: "/images/carousel-3.png",
    alt: "Man in his late 30s in office attire, seated at a desk and smiling at his laptop",
  },
]

export function ImageCarousel() {
  const [index, setIndex] = React.useState(0)
  const next = React.useCallback(() => setIndex((i) => (i + 1) % slides.length), [])
  const prev = React.useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [])

  React.useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative">
      <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image src={s.src || "/placeholder.svg"} alt={s.alt} fill className="object-cover" priority={i === index} />
          </div>
        ))}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
          aria-hidden="true"
        />

        <div
          key={index}
          className="absolute inset-x-0 bottom-10 sm:bottom-12 mx-auto max-w-4xl px-4 text-center text-white transition-all duration-700"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight drop-shadow">
            Get Quick Loans Instantly with Rain Money
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-white/90">
            Fast, secure, and reliable loans at your fingertips
          </p>
        </div>

        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Button variant="ghost" size="icon" aria-label="Previous slide" onClick={prev} className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button variant="ghost" size="icon" aria-label="Next slide" onClick={next} className="text-white">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-emerald-500" : "bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  )
}
