import { NextResponse } from "next/server"
import { db } from "@/lib/db"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const id = decodeURIComponent(params.id)
  const rec = db.get(id)
  if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 })
  db.maybeProgress(id)
  return NextResponse.json({ id: rec.id, status: db.get(id)?.status || rec.status })
}
