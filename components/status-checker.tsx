"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function StatusChecker() {
  const [id, setId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<{ status?: string; error?: string } | null>(null)

  const check = async () => {
    if (!id) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/loan-status/${encodeURIComponent(id)}`)
      if (res.ok) {
        const data = await res.json()
        setResult({ status: data.status })
      } else {
        setResult({ error: "Application not found" })
      }
    } catch {
      setResult({ error: "Could not check status. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold">Check Your Loan Status</h3>
        <p className="mt-1 text-sm text-muted-foreground">Enter your Application ID to view the current status.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Input placeholder="Enter Application ID" value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={check} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Search className="h-4 w-4 mr-2" aria-hidden="true" />
            {loading ? "Checking..." : "Check"}
          </Button>
        </div>
        {result?.status && (
          <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Current Status: <span className="font-semibold">{result.status}</span>
          </div>
        )}
        {result?.error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{result.error}</div>
        )}
      </CardContent>
    </Card>
  )
}
