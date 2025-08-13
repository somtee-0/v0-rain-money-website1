"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { SiteHeader } from "@/components/site-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = React.useState(false)

  async function onNext(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("rm_user") : null
      const user = raw ? JSON.parse(raw) : null
      const matched = user?.email && email && String(user.email).toLowerCase() === String(email).toLowerCase()

      if (!matched) {
        setShowSignupPrompt(true)
        setPending(false)
        return
      }

      // Proceed to Loan Calculator for existing users
      router.push("/loan-calculator")
    } catch {
      setShowSignupPrompt(true)
      setPending(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <BrandLogo className="h-10 w-10" />
              </div>

              <form onSubmit={onNext} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-end pt-2">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={pending}>
                    {pending ? "Please wait..." : "Next"}
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-sm text-center text-muted-foreground">
                {"Don't have an account yet? "}
                <Link href="/apply" className="text-emerald-700 hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign up to get started</AlertDialogTitle>
            <AlertDialogDescription>
              It looks like you don&apos;t have an account yet. Please sign up first to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowSignupPrompt(false)
                router.push("/apply")
              }}
            >
              Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
