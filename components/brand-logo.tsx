import { cn } from "@/lib/utils"

type Props = { className?: string }

export function BrandLogo({ className }: Props) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-md bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white font-extrabold",
        className,
      )}
      aria-label="Rain Money logo"
      role="img"
    >
      <span className="select-none tracking-wider" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
        RM
      </span>
    </div>
  )
}
