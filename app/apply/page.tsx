"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { useSearchParams, useRouter } from "next/navigation"

type Account = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isDigits = (v: string, len?: number) => /^\d+$/.test(v) && (len ? v.length === len : true)
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

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2>(1)
  const searchParams = useSearchParams()
  React.useEffect(() => {
    if (searchParams.get("step") === "2") setStep(2)
  }, [searchParams])

  // Step 1: Account
  const [acct, setAcct] = React.useState<Account>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [acctErrors, setAcctErrors] = React.useState<Record<string, string>>({})

  // Step 2: Applicant + Guarantors
  const [fullName, setFullName] = React.useState("")
  const [bvn, setBvn] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [bankName, setBankName] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")

  const [g1Relationship, setG1Relationship] = React.useState<string>("")
  const [g1FullName, setG1FullName] = React.useState("")
  const [g1Phone, setG1Phone] = React.useState("")

  const [g2Relationship, setG2Relationship] = React.useState<string>("")
  const [g2FullName, setG2FullName] = React.useState("")
  const [g2Phone, setG2Phone] = React.useState("")

  const [submitError, setSubmitError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (step === 2) {
      const name = [acct.firstName, acct.lastName].filter(Boolean).join(" ").trim()
      if (name && !fullName) setFullName(name)
      if (acct.email && !email) setEmail(acct.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function validateAccount() {
    const e: Record<string, string> = {}
    if (!acct.firstName.trim()) e.firstName = "First name is required"
    if (!acct.lastName.trim()) e.lastName = "Last name is required"
    if (!acct.email || !emailOk(acct.email)) e.email = "Enter a valid email address"
    if (!acct.password || acct.password.length < 6) e.password = "Password must be at least 6 characters"
    if (acct.confirm !== acct.password) e.confirm = "Passwords do not match"
    setAcctErrors(e)
    return Object.keys(e).length === 0
  }

  function nextFromAccount(e: React.FormEvent) {
    e.preventDefault()
    if (validateAccount()) {
      // Mark user as "signed up"
      try {
        localStorage.setItem(
          "rm_user",
          JSON.stringify({
            email: acct.email,
            firstName: acct.firstName,
            lastName: acct.lastName,
            createdAt: Date.now(),
          }),
        )
      } catch {}
      setStep(2)
    }
  }

  function validateApplication() {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = "Full name is required"
    if (!bvn || !isDigits(bvn, 11)) errs.bvn = "BVN must be 11 digits"
    if (!phone || !phoneOk(phone)) errs.phone = "Enter a valid phone number"
    if (!email || !emailOk(email)) errs.email = "Enter a valid email address"
    if (!bankName) errs.bankName = "Select your bank"
    if (!accountNumber || !isDigits(accountNumber, 10)) errs.accountNumber = "Account number must be 10 digits"

    if (!g1Relationship) errs.g1Relationship = "Select relationship"
    if (!g1FullName.trim()) errs.g1FullName = "Full name is required"
    if (!g1Phone || !phoneOk(g1Phone)) errs.g1Phone = "Enter a valid phone number"

    if (!g2Relationship) errs.g2Relationship = "Select relationship"
    if (!g2FullName.trim()) errs.g2FullName = "Full name is required"
    if (!g2Phone || !phoneOk(g2Phone)) errs.g2Phone = "Enter a valid phone number"

    return errs
  }

  function submitApplication(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const errs = validateApplication()
    if (Object.keys(errs).length > 0) {
      setSubmitError("Please correct the highlighted fields.")
      return
    }
    // Store applicant details locally and move to summary page
    try {
      localStorage.setItem(
        "rm_applicant",
        JSON.stringify({
          applicant: { fullName, bvn, phone, email, bankName, accountNumber },
          guarantors: [
            { type: "Next of Kin", relationship: g1Relationship, fullName: g1FullName, phone: g1Phone },
            { type: "Other Contact", relationship: g2Relationship, fullName: g2FullName, phone: g2Phone },
          ],
        }),
      )
    } catch {}
    router.push("/application-summary")
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {step === 1 ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <BrandLogo className="h-10 w-10" />
                  <h1 className="mt-2 text-lg font-semibold">Sign Up</h1>
                </div>
                <form onSubmit={nextFromAccount} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      value={acct.firstName}
                      onChange={(e) => setAcct((p) => ({ ...p, firstName: e.target.value }))}
                      required
                    />
                    {acctErrors.firstName && <p className="text-red-600 text-sm mt-1">{acctErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      value={acct.lastName}
                      onChange={(e) => setAcct((p) => ({ ...p, lastName: e.target.value }))}
                      required
                    />
                    {acctErrors.lastName && <p className="text-red-600 text-sm mt-1">{acctErrors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={acct.email}
                      onChange={(e) => setAcct((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                    {acctErrors.email && <p className="text-red-600 text-sm mt-1">{acctErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={acct.password}
                      onChange={(e) => setAcct((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                    {acctErrors.password && <p className="text-red-600 text-sm mt-1">{acctErrors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Confirm Password"
                      value={acct.confirm}
                      onChange={(e) => setAcct((p) => ({ ...p, confirm: e.target.value }))}
                      required
                    />
                    {acctErrors.confirm && <p className="text-red-600 text-sm mt-1">{acctErrors.confirm}</p>}
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-end pt-2">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Next
                    </Button>
                  </div>
                </form>
                <p className="mt-4 text-sm text-center text-muted-foreground">
                  {"Already have an account? "}
                  <Link href="/login" className="text-emerald-700 hover:underline">
                    Log In
                  </Link>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Loan Application</h2>
                    <p className="text-sm text-muted-foreground">Step 2 of 2: Applicant & Guarantors</p>
                  </div>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                </div>

                <form onSubmit={submitApplication} className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-base font-semibold">Applicant Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bvn">BVN</Label>
                        <Input
                          id="bvn"
                          value={bvn}
                          onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                          placeholder="11-digit BVN"
                          inputMode="numeric"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+234 801 234 5678"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="aemail">Email</Label>
                        <Input
                          id="aemail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          required
                        />
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
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="10-digit NUBAN"
                          inputMode="numeric"
                          required
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-base font-semibold">Guarantor Information</h3>
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
                        </div>
                        <div>
                          <Label htmlFor="g1FullName">Full Name</Label>
                          <Input
                            id="g1FullName"
                            value={g1FullName}
                            onChange={(e) => setG1FullName(e.target.value)}
                            placeholder="e.g. Jane Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="g1Phone">Phone Number</Label>
                          <Input
                            id="g1Phone"
                            value={g1Phone}
                            onChange={(e) => setG1Phone(e.target.value)}
                            placeholder="+234 ..."
                            required
                          />
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
                        </div>
                        <div>
                          <Label htmlFor="g2FullName">Full Name</Label>
                          <Input
                            id="g2FullName"
                            value={g2FullName}
                            onChange={(e) => setG2FullName(e.target.value)}
                            placeholder="e.g. Mark Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="g2Phone">Phone Number</Label>
                          <Input
                            id="g2Phone"
                            value={g2Phone}
                            onChange={(e) => setG2Phone(e.target.value)}
                            placeholder="+234 ..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {submitError && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
