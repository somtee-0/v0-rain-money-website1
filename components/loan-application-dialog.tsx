"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2 } from "lucide-react"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// Basic client-side validators
const isDigits = (v: string, len?: number) => /^\d+$/.test(v) && (len ? v.length === len : true)
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const phoneOk = (v: string) => /^[\d+]{10,14}$/.test(v)

const relationships = ["Sibling", "Cousin", "Wife", "Husband", "Parent", "Friend", "Other"] as const
const banks = [
  "Access Bank",
  "GTBank",
  "First Bank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "FCMB",
  "Polaris Bank",
  "Union Bank",
  "Sterling Bank",
  "Wema Bank",
  "Keystone Bank",
  "Jaiz Bank",
  "Globus Bank",
  "Providus Bank",
  "Kuda",
  "Opay",
  "Moniepoint",
  "Palmpay",
]

export function LoanApplicationDialog({ open = false, onOpenChange = () => {} }: Props) {
  const [submitting, setSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [appId, setAppId] = React.useState<string | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Main applicant fields
  const [fullName, setFullName] = React.useState("")
  const [bvn, setBvn] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [bankName, setBankName] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")

  // Guarantor 1 (Next of Kin)
  const [g1Relationship, setG1Relationship] = React.useState<string>("")
  const [g1FullName, setG1FullName] = React.useState("")
  const [g1Phone, setG1Phone] = React.useState("")

  // Guarantor 2 (Other Contact)
  const [g2Relationship, setG2Relationship] = React.useState<string>("")
  const [g2FullName, setG2FullName] = React.useState("")
  const [g2Phone, setG2Phone] = React.useState("")

  const resetForm = () => {
    setFullName("")
    setBvn("")
    setPhone("")
    setEmail("")
    setBankName("")
    setAccountNumber("")
    setG1Relationship("")
    setG1FullName("")
    setG1Phone("")
    setG2Relationship("")
    setG2FullName("")
    setG2Phone("")
    setErrors({})
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fullName || fullName.trim().length < 2) e.fullName = "Full name is required"
    if (!bvn || !isDigits(bvn, 11)) e.bvn = "BVN must be 11 digits"
    if (!phone || !phoneOk(phone)) e.phone = "Enter a valid phone number"
    if (!email || !isEmail(email)) e.email = "Enter a valid email address"
    if (!bankName) e.bankName = "Select your bank"
    if (!accountNumber || !isDigits(accountNumber, 10)) e.accountNumber = "Account number must be 10 digits"

    if (!g1Relationship) e.g1Relationship = "Select relationship"
    if (!g1FullName || g1FullName.trim().length < 2) e.g1FullName = "Full name is required"
    if (!g1Phone || !phoneOk(g1Phone)) e.g1Phone = "Enter a valid phone number"

    if (!g2Relationship) e.g2Relationship = "Select relationship"
    if (!g2FullName || g2FullName.trim().length < 2) e.g2FullName = "Full name is required"
    if (!g2Phone || !phoneOk(g2Phone)) e.g2Phone = "Enter a valid phone number"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch("/apply-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant: { fullName, bvn, phone, email, bankName, accountNumber },
          guarantors: [
            { type: "Next of Kin", relationship: g1Relationship, fullName: g1FullName, phone: g1Phone },
            { type: "Other Contact", relationship: g2Relationship, fullName: g2FullName, phone: g2Phone },
          ],
        }),
      })
      if (!res.ok) throw new Error("Failed to submit application")
      const data = await res.json()
      setAppId(data.id || null)
      setShowSuccess(true)
      resetForm()
    } catch (err) {
      setErrors((p) => ({ ...p, submit: "Submission failed. Please try again." }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => onOpenChange?.(v)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loan Application</DialogTitle>
          </DialogHeader>
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ppicture-sNrr66XLPCtL69nYVtJ85MeVwQb9v5.jpeg"
              alt="Sign up visual showing a registration form"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="mb-1">
                <span className="inline-flex items-center justify-center rounded-md bg-white/90 px-2 py-1 text-emerald-700 font-extrabold tracking-wider shadow">
                  RM
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold">Create account</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Applicant Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="bvn">BVN</Label>
                  <Input
                    id="bvn"
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                    placeholder="11-digit BVN"
                    inputMode="numeric"
                  />
                  {errors.bvn && <p className="text-red-600 text-sm mt-1">{errors.bvn}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Select onValueChange={setBankName} value={bankName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankName && <p className="text-red-600 text-sm mt-1">{errors.bankName}</p>}
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit NUBAN"
                    inputMode="numeric"
                  />
                  {errors.accountNumber && <p className="text-red-600 text-sm mt-1">{errors.accountNumber}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Guarantor Information</h3>
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="font-medium">Guarantor 1: Next of Kin</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Relationship</Label>
                    <Select onValueChange={setG1Relationship} value={g1Relationship}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.g1Relationship && <p className="text-red-600 text-sm mt-1">{errors.g1Relationship}</p>}
                  </div>
                  <div>
                    <Label htmlFor="g1FullName">Full Name</Label>
                    <Input
                      id="g1FullName"
                      value={g1FullName}
                      onChange={(e) => setG1FullName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                    />
                    {errors.g1FullName && <p className="text-red-600 text-sm mt-1">{errors.g1FullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="g1Phone">Phone Number</Label>
                    <Input
                      id="g1Phone"
                      value={g1Phone}
                      onChange={(e) => setG1Phone(e.target.value)}
                      placeholder="+234 ..."
                    />
                    {errors.g1Phone && <p className="text-red-600 text-sm mt-1">{errors.g1Phone}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="font-medium">Guarantor 2: Other Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Relationship</Label>
                    <Select onValueChange={setG2Relationship} value={g2Relationship}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.g2Relationship && <p className="text-red-600 text-sm mt-1">{errors.g2Relationship}</p>}
                  </div>
                  <div>
                    <Label htmlFor="g2FullName">Full Name</Label>
                    <Input
                      id="g2FullName"
                      value={g2FullName}
                      onChange={(e) => setG2FullName(e.target.value)}
                      placeholder="e.g. Mark Doe"
                    />
                    {errors.g2FullName && <p className="text-red-600 text-sm mt-1">{errors.g2FullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="g2Phone">Phone Number</Label>
                    <Input
                      id="g2Phone"
                      value={g2Phone}
                      onChange={(e) => setG2Phone(e.target.value)}
                      placeholder="+234 ..."
                    />
                    {errors.g2Phone && <p className="text-red-600 text-sm mt-1">{errors.g2Phone}</p>}
                  </div>
                </div>
              </div>
            </section>

            {errors.submit && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{errors.submit}</div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={submitting}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              Application Submitted
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Thank you. Your loan application has been received. Our team will review and contact you shortly.
            </p>
            {appId && (
              <p className="text-sm">
                Your Application ID: <span className="font-mono font-semibold">{appId}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              You can check status anytime using the Application ID in the "Check Status" section below.
            </p>
          </div>
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowSuccess(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
