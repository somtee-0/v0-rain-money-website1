import { Card, CardContent } from "@/components/ui/card"
import { Clock3, LockKeyhole, PiggyBank, Headphones } from "lucide-react"

export function WhyChoose() {
  const items = [
    { title: "Fast disbursement", desc: "Get funds swiftly after approval.", icon: Clock3 },
    { title: "Data security", desc: "Your information is protected with bank-grade security.", icon: LockKeyhole },
    { title: "Low interest rates", desc: "Competitive rates starting from ₦.", icon: PiggyBank },
    { title: "24/7 support", desc: "We are here to help anytime.", icon: Headphones },
  ]
  return (
    <div className="mx-auto max-w-6xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Why Choose Rain Money</h2>
        <p className="mt-2 text-muted-foreground">Trusted features that put you first.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <Card key={item.title} className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-teal-600/10 text-teal-700 flex items-center justify-center">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
