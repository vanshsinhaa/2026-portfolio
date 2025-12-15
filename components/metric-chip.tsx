import { cn } from "@/lib/utils"

interface MetricChipProps {
  label: string
  value: string
  variant?: "default" | "accent"
}

export function MetricChip({ label, value, variant = "default" }: MetricChipProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-1 rounded-lg border px-3 py-2",
        variant === "accent" ? "border-accent-foreground/20 bg-accent/50" : "border-border bg-muted/30",
      )}
    >
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  )
}
