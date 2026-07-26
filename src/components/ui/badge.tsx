import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-500 text-white",
        secondary: "border-transparent bg-surface-100 text-surface-600",
        outline: "text-surface-700 border-surface-300",
        success: "border-transparent bg-success-50 text-success-600",
        warning: "border-transparent bg-warning-50 text-warning-600",
        danger: "border-transparent bg-danger-50 text-danger-600",
        info: "border-transparent bg-info-50 text-info-600",
        navy: "border-transparent bg-navy-800 text-white",
        brand: "border-transparent bg-brand-500 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant = "default", ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
