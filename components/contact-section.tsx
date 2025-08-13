"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, PhoneCall, MessageCircle } from "lucide-react"

const whatsappLink = "https://wa.me/2348185471803"

export function ContactSection() {
  const [sending, setSending] = React.useState(false)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/contact-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSuccess("Message Sent")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setError("Could not send your message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Get in Touch</h3>
            <p className="mt-1 text-sm text-muted-foreground">We typically respond within a few hours.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="c-name">Name</Label>
                <Input
                  id="c-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  required
                  rows={5}
                />
              </div>
              {success && (
                <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 text-sm">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{error}</div>
              )}
              <div className="flex justify-end">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <a href="mailto:rainmoneyyng@gmail.com" className="hover:underline">
                  rainmoneyyng@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <PhoneCall className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <a href="tel:+2348185471803" className="hover:underline">
                  +234 818 547 1803
                </a>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    window.location.href = whatsappLink
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat with us on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Follow Us card removed as requested */}
        </div>
      </div>
    </div>
  )
}
