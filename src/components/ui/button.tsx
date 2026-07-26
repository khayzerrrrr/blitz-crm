import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700",
        outline: "border border-surface-300 bg-white text-surface-700 shadow-xs hover:bg-surface-50 hover:text-surface-900 active:bg-surface-100",
        secondary: "bg-surface-100 text-surface-700 hover:bg-surface-200 hover:text-surface-900 active:bg-surface-300",
        ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200",
        destructive: "bg-danger-500 text-white shadow-sm hover:bg-danger-600 active:bg-danger-700",
        link: "text-brand-500 underline-offset-4 hover:underline",
        navy: "bg-navy-800 text-white shadow-sm hover:bg-navy-900 active:bg-black",
        accent: "bg-accent-500 text-white shadow-sm hover:bg-accent-600 active:bg-accent-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs",
        sm: "h-8 gap-1 rounded-lg px-3 text-xs",
        lg: "h-11 gap-2 rounded-xl px-6 text-sm",
        xl: "h-12 gap-2 rounded-xl px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className, variant = "default", size = "default", asChild = false, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
