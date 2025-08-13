import { NextResponse } from "next/server"

const faqs = [
  {
    question: "What is the interest rate?",
    answer:
      "Our interest rates are competitive and depend on your profile. We’ll present your exact rate before you accept the loan.",
  },
  {
    question: "How long does it take to receive a loan?",
    answer: "Most approved loans are disbursed within minutes to your bank account.",
  },
  {
    question: "What are the requirements?",
    answer: "A valid BVN, Nigerian phone number, active bank account, and two guarantors are required.",
  },
]

export async function GET() {
  return NextResponse.json({ faqs })
}
