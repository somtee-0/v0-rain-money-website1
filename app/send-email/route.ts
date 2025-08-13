import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json()
    if (!to || !subject || !text) {
      return NextResponse.json({ error: "Missing email fields" }, { status: 400 })
    }

    const from = "rainmoneyyng@gmail.com"

    // If SMTP is configured, send a real email; otherwise, mock-send
    const host = process.env.SMTP_HOST
    if (host) {
      const port = Number(process.env.SMTP_PORT) || 587
      const secure = process.env.SMTP_SECURE === "true" || port === 465
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
      })

      await transporter.sendMail({ from, to, subject, text })
      return NextResponse.json({ ok: true, sent: true })
    }

    // Mocked email (for preview environments without SMTP)
    console.log("Mock email sent:", { from, to, subject, text })
    return NextResponse.json({ ok: true, sent: false, mocked: true })
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
