import { NextResponse } from "next/server"
import { db, type Applicant, type Guarantor } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const applicant: Applicant = body.applicant
    const guarantors: Guarantor[] = body.guarantors

    // Basic server-side sanity checks
    if (
      !applicant?.fullName ||
      !applicant?.bvn ||
      !applicant?.phone ||
      !applicant?.email ||
      !applicant?.bankName ||
      !applicant?.accountNumber
    ) {
      return NextResponse.json({ error: "Missing applicant fields" }, { status: 400 })
    }
    if (!Array.isArray(guarantors) || guarantors.length < 2) {
      return NextResponse.json({ error: "Two guarantors are required" }, { status: 400 })
    }
    if (guarantors.some((g) => !g.relationship || !g.fullName || !g.phone)) {
      return NextResponse.json({ error: "Incomplete guarantor information" }, { status: 400 })
    }

    const created = db.add({ applicant, guarantors })
    return NextResponse.json({ id: created.id, status: created.status }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
