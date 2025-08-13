import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    // In real app: send email or create ticket
    return NextResponse.json({ ok: true, message: "Message Sent" })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
