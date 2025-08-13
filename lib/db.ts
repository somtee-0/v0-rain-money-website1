export type Applicant = {
  fullName: string
  bvn: string
  phone: string
  email: string
  bankName: string
  accountNumber: string
}

export type Guarantor = {
  type: string
  relationship: string
  fullName: string
  phone: string
}

export type LoanApplication = {
  id: string
  applicant: Applicant
  guarantors: Guarantor[]
  status: "received" | "under_review" | "approved" | "rejected" | "disbursed"
  createdAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __RAIN_DB__: { applications: LoanApplication[] } | undefined
}

const store = (globalThis as any).__RAIN_DB__ || { applications: [] as LoanApplication[] }
;(globalThis as any).__RAIN_DB__ = store

export const db = {
  add(app: Omit<LoanApplication, "id" | "status" | "createdAt">): LoanApplication {
    const id = "RM-" + Math.random().toString(36).slice(2, 8).toUpperCase()
    const rec: LoanApplication = { ...app, id, status: "received", createdAt: Date.now() }
    store.applications.push(rec)
    return rec
  },
  get(id: string): LoanApplication | undefined {
    return store.applications.find((a) => a.id === id)
  },
  list(): LoanApplication[] {
    return [...store.applications]
  },
  // for demo: periodically move status forward
  maybeProgress(id: string) {
    const a = this.get(id)
    if (!a) return
    const order: LoanApplication["status"][] = ["received", "under_review", "approved", "disbursed"]
    const idx = order.indexOf(a.status)
    if (idx >= 0 && idx < order.length - 1 && Date.now() - a.createdAt > 30000) {
      a.status = order[idx + 1]
    }
  },
}
