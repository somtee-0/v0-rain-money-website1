"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LoanCalculatorPage() {
  const router = useRouter()
  const [amount, setAmount] = React.useState<number>(5000)
  const [months, setMonths] = React.useState<1 | 2 | 3>(1)
  const [showInvalidAmount, setShowInvalidAmount] = React.useState(false)
  const [invalidMessage, setInvalidMessage] = React.useState("")

  const pct = months === 1 ? 0.4 : months === 2 ? 0.5 : 0.6
  const total = Math.round(amount + amount * pct)
  const monthly = Math.round(total / months)

  const validateAmount = (value: number) => {
    if (value < 5000) {
      setInvalidMessage("The minimum loan amount is ₦5,000. Please enter a valid amount.")
      setShowInvalidAmount(true)
      return false
    }
    if (value > 500000) {
      setInvalidMessage("The maximum loan amount is ₦500,000. Please enter a valid amount.")
      setShowInvalidAmount(true)
      return false
    }
    return true
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") {
      setAmount(0)
      return
    }

    const parsed = Number.parseFloat(raw)
    if (Number.isFinite(parsed) && parsed >= 0) {
      setAmount(parsed)
    }
  }

  const handleAmountBlur = () => {
    if (amount > 0 && amount < 5000) {
      validateAmount(amount)
    } else if (amount > 500000) {
      validateAmount(amount)
    }
  }

  function proceed() {
    if (!validateAmount(amount)) {
      return
    }

    try {
      localStorage.setItem(
        "rm_calc",
        JSON.stringify({
          amount,
          months,
          interestPercent: pct,
          totalRepay: total,
          monthlyRepay: monthly,
          computedAt: Date.now(),
        }),
      )
    } catch {}
    router.push("/application-summary")
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h1 className="text-xl font-semibold">Loan Calculator</h1>

              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  max={500000}
                  value={amount || ""}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  placeholder="Enter amount (₦5,000 - ₦500,000)"
                />
                <p className="text-xs text-muted-foreground">Enter any amount between ₦5,000 and ₦500,000.</p>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={String(months)} onValueChange={(v) => setMonths(Number.parseInt(v, 10) as 1 | 2 | 3)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month (40% interest)</SelectItem>
                    <SelectItem value="2">2 months (50% interest)</SelectItem>
                    <SelectItem value="3">3 months (60% interest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {amount >= 5000 && amount <= 500000 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Interest</p>
                    <p className="text-lg font-semibold">{Math.round(pct * 100)}%</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Total Repayable</p>
                    <p className="text-lg font-semibold">
                      {"₦"}
                      {total.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Monthly Payment</p>
                    <p className="text-lg font-semibold">
                      {"₦"}
                      {monthly.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={proceed}
                  disabled={amount < 5000 || amount > 500000}
                >
                  Proceed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={showInvalidAmount} onOpenChange={setShowInvalidAmount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invalid Figure</AlertDialogTitle>
            <AlertDialogDescription>{invalidMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowInvalidAmount(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
