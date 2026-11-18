import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { useRef, type CSSProperties } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import {
  liquidButtonConfig,
  useLiquidGlass,
} from "@/components/ui/liquid/liquid-glass"

const liquidGlassVariants = [
  "glass-primary",
  "glass-secondary",
  "glass-destructive",
] as const

type LiquidGlassVariant = (typeof liquidGlassVariants)[number]

function isLiquidGlassVariant(
  variant: string | null | undefined
): variant is LiquidGlassVariant {
  return liquidGlassVariants.some((glassVariant) => glassVariant === variant)
}

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-[var(--button-emphasis-bg)] text-primary-foreground ring-1 ring-[var(--button-emphasis-ring)] shadow-[0_1px_2px_rgba(0,0,0,0.16)] focus-visible:ring-[var(--button-emphasis-ring)] active:ring-[var(--button-emphasis-ring)]",
        outline:
          "border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "relative overflow-hidden bg-[var(--button-emphasis-bg)] text-destructive-foreground ring-1 ring-[var(--button-emphasis-ring)] shadow-[0_1px_2px_rgba(0,0,0,0.16)] focus-visible:ring-[var(--button-emphasis-ring)] active:ring-[var(--button-emphasis-ring)]",
        "secondary-destructive":
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        "glass-primary":
          "relative isolate overflow-hidden rounded-full border border-white/60 bg-white/25 text-foreground shadow-lg backdrop-blur-md hover:bg-white/35 focus-visible:ring-offset-2 data-[glass-status=loading]:pointer-events-none dark:border-white/30 dark:bg-white/10 dark:text-foreground dark:hover:bg-white/20",
        "glass-secondary":
          "relative isolate overflow-hidden rounded-full border border-white/60 bg-white/25 text-foreground shadow-lg backdrop-blur-md hover:bg-white/35 focus-visible:ring-offset-2 data-[glass-status=loading]:pointer-events-none dark:border-white/30 dark:bg-white/10 dark:text-foreground dark:hover:bg-white/20",
        "glass-destructive":
          "relative isolate overflow-hidden rounded-full border border-red-300/60 bg-red-500/15 text-red-700 shadow-lg backdrop-blur-md hover:bg-red-500/25 focus-visible:ring-offset-2 data-[glass-status=loading]:pointer-events-none dark:border-red-300/30 dark:bg-red-400/10 dark:text-red-200 dark:hover:bg-red-400/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function getEmphasisStyle(variant: string | null | undefined) {
  const token =
    variant === "default"
      ? "var(--primary)"
      : variant === "destructive"
        ? "var(--destructive)"
        : undefined

  if (!token) return undefined

  return {
    "--button-emphasis-ring": `color-mix(in oklch, ${token}, black 10%)`,
    "--button-emphasis-bg": `color-mix(in oklch, ${token}, white 30%)`,
    "--button-emphasis-gradient-start": `color-mix(in oklch, ${token}, white 15%)`,
    "--button-emphasis-gradient-end": token,
  } as CSSProperties & Record<`--${string}`, string>
}

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  style,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const glassElementRef = useRef<HTMLButtonElement>(null)
  const isGlassVariant = isLiquidGlassVariant(variant)
  const glassStatus = useLiquidGlass({
    rootRef,
    glassElementRef,
    enabled: isGlassVariant,
    config: liquidButtonConfig,
  })

  const hasEmphasisGradient = variant === "default" || variant === "destructive"
  const emphasisStyle = getEmphasisStyle(variant)

  const glassStyle =
    variant === "glass-primary"
      ? ({ "--glass-accent": "var(--primary)" } as CSSProperties)
      : variant === "glass-destructive"
        ? ({ "--glass-accent": "var(--destructive)" } as CSSProperties)
        : undefined

  const button = (
    <ButtonPrimitive
      ref={glassElementRef}
      data-slot="button"
      data-glass-status={isGlassVariant ? glassStatus : undefined}
      className={cn(
        buttonVariants({ variant, size, className }),
        isGlassVariant &&
          glassStatus === "loading" &&
          "border-white/40 bg-white/20 text-transparent dark:border-white/20 dark:bg-white/10",
        isGlassVariant &&
          glassStatus === "fallback" &&
          "bg-background/80 text-foreground supports-[backdrop-filter]:backdrop-blur-md"
      )}
      style={{
        ...(emphasisStyle ?? {}),
        ...(glassStyle ?? {}),
        ...style,
      }}
      {...props}
    >
      {isGlassVariant ? (
        <>
          <span className={cn(glassStatus === "loading" && "invisible")}>
            {children}
          </span>
          {glassStatus === "loading" && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit]"
            >
              <span className="h-3 w-24 max-w-[65%] animate-pulse rounded-full bg-white/60 dark:bg-white/35" />
            </span>
          )}
        </>
      ) : hasEmphasisGradient ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-[var(--button-emphasis-gradient-start)] to-[var(--button-emphasis-gradient-end)] shadow-[inset_0_1px_0_0_var(--button-emphasis-bg)] transition-colors group-hover/button:from-[var(--button-emphasis-bg)]"
          />
          <span className="relative z-10 inline-flex items-center gap-1.5">
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )

  if (!isGlassVariant) {
    return button
  }

  return (
    <span ref={rootRef} className="relative inline-flex">
      {button}
    </span>
  )
}

export { Button, buttonVariants }
