import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, ShieldCheck, Wallet } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "Apply Online",
      desc: "Fill out a short application form in minutes.",
      icon: ClipboardList,
    },
    {
      title: "Get Verified",
      desc: "We quickly verify your details securely.",
      icon: ShieldCheck,
    },
    {
      title: "Receive Money Instantly",
      desc: "Funds disbursed to your bank account fast.",
      icon: Wallet,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-10">
        <Badge className="bg-teal-600 hover:bg-teal-700">Simple Process</Badge>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="mt-2 text-muted-foreground">Get the cash you need in three easy steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <Card key={s.title} className="border-emerald-100">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                <s.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                {"Step "}
                {i + 1}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
