"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Calc = {
  amount: number
  months: 1 | 2 | 3
  interestPercent: number
  totalRepay: number
  monthlyRepay: number
}

type Applicant = {
  fullName: string
  bvn: string
  phone: string
  email: string
  bankName: string
  accountNumber: string
}

type Guarantor = {
  type: string
  relationship: string
  fullName: string
  phone: string
}

type AppStore = {
  applicant: Applicant
  guarantors: Guarantor[]
}

export default function ApplicationSummaryPage() {
  const [calc, setCalc] = React.useState<Calc | null>(null)
  const [info, setInfo] = React.useState<AppStore | null>(null)
  const [processingOpen, setProcessingOpen] = React.useState(false)
  const [stage, setStage] = React.useState<"processing" | "done">("processing")
  const [submitting, setSubmitting] = React.useState(false)
  const [successId, setSuccessId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const c = localStorage.getItem("rm_calc")
      const a = localStorage.getItem("rm_applicant")
      setCalc(c ? JSON.parse(c) : null)
      setInfo(a ? JSON.parse(a) : null)
    } catch {
      // ignore
    }
  }, [])

  // Start the 3s processing, then reveal Done
  function proceed() {
    if (!info?.applicant) {
      setError("Missing applicant information. Please complete the application form.")
      return
    }
    setProcessingOpen(true)
    setStage("processing")
    setTimeout(() => setStage("done"), 3000)
  }

  async function finalize() {
    if (!info?.applicant || !info?.guarantors) return
    setSubmitting(true)
    setError(null)
    try {
      // 1) Create the application and receive a fresh ID
      const applyRes = await fetch("/apply-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant: info.applicant,
          guarantors: info.guarantors,
          loan: calc
            ? {
                amount: calc.amount,
                months: calc.months,
                totalRepay: calc.totalRepay,
                monthly: calc.monthlyRepay,
                interestPercent: calc.interestPercent,
              }
            : undefined,
        }),
      })
      if (!applyRes.ok) throw new Error("Application failed")
      const data = await applyRes.json()
      const newId = data.id as string

      // 2) Send confirmation email to the applicant
      const emailText =
        "Thank you for choosing Rain Money.\n\nWe have received your loan application and appreciate your trust in us. Your request is now being processed, and you will be notified once it has been approved."
      await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: info.applicant.email,
          subject: "Rain Money: Application received",
          text: emailText,
        }),
      })

      // 3) Show success screen
      setSuccessId(newId)
      setProcessingOpen(false)
    } catch {
      setError("Could not complete your application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (successId) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <h1 className="text-xl font-semibold">Application Submitted</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {"Thank you. Your loan application has been received. We'll reach out shortly."}
              </p>
              <p className="text-sm">
                Your Application ID: <span className="font-mono font-semibold">{successId}</span>
              </p>
              <div className="pt-2 flex gap-3">
                <Link href="/#status">
                  <Button variant="outline">Check Status</Button>
                </Link>
                <Link href="/">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Applicant Details</h2>
              {info?.applicant ? (
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Full Name</span>
                    <span>{info.applicant.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">BVN</span>
                    <span>{info.applicant.bvn}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{info.applicant.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Email</span>
                    <span>{info.applicant.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Bank</span>
                    <span>{info.applicant.bankName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Account Number</span>
                    <span>{info.applicant.accountNumber}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-600">Applicant information not found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Your Loan Summary</h2>
              {calc ? (
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Amount</span>
                    <span>₦{calc.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Duration</span>
                    <span>
                      {calc.months} {calc.months === 1 ? "month" : "months"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Interest</span>
                    <span>{Math.round(calc.interestPercent * 100)}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span>₦{calc.monthlyRepay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold">
                    <span>Total Repayable</span>
                    <span>₦{calc.totalRepay.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-red-600">No loan selection found.</p>
                  <p className="mt-2">
                    Please choose your preferred loan on the{" "}
                    <a href="/loan-calculator" className="text-emerald-700 hover:underline">
                      Loan Calculator
                    </a>{" "}
                    page.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-6 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-6 flex items-center justify-end">
          <Button onClick={proceed} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Proceed
          </Button>
        </div>
      </div>

      {/* Processing / Done dialog */}
      <Dialog open={processingOpen} onOpenChange={setProcessingOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{stage === "processing" ? "Processing…" : "Done"}</DialogTitle>
          </DialogHeader>
          {stage === "processing" ? (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Please wait about 3 seconds…</span>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button
                onClick={finalize}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Finishing…
                  </span>
                ) : (
                  "Done"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
