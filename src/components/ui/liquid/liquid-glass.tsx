import { useEffect, useState, type RefObject } from "react"

export type LiquidGlassConfig = Record<string, boolean | number | string>
export type LiquidGlassStatus = "loading" | "ready" | "fallback"

type UseLiquidGlassOptions = {
  rootRef: RefObject<HTMLElement | null>
  glassElementRef: RefObject<HTMLElement | null>
  enabled?: boolean
  config?: {
    light: LiquidGlassConfig
    dark?: LiquidGlassConfig
  }
}

export const liquidButtonConfig = {
  light: {
    button: true,
    blurAmount: 0.25,
    cornerRadius: 30,
  },
  dark: {
    brightness: -0.3,
    cornerRadius: 50,
  },
} satisfies {
  light: LiquidGlassConfig
  dark: LiquidGlassConfig
}

export function useLiquidGlass({
  rootRef,
  glassElementRef,
  enabled = true,
  config = liquidButtonConfig,
}: UseLiquidGlassOptions): LiquidGlassStatus {
  const [status, setStatus] = useState<LiquidGlassStatus>("loading")
  const lightConfig = JSON.stringify(config.light)
  const darkConfig = JSON.stringify({ ...config.light, ...config.dark })

  useEffect(() => {
    const root = rootRef.current
    const glassElement = glassElementRef.current

    if (!enabled || !root || !glassElement) {
      setStatus("fallback")
      return
    }

    let cancelled = false
    let destroy: (() => void) | undefined

    const updateGlassConfig = () => {
      glassElement.dataset.config =
        document.documentElement.classList.contains("dark")
          ? darkConfig
          : lightConfig
    }

    updateGlassConfig()

    const themeObserver = new MutationObserver(updateGlassConfig)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    setStatus("loading")

    void import("@ybouane/liquidglass")
      .then(({ LiquidGlass }) =>
        LiquidGlass.init({ root, glassElements: [glassElement] })
      )
      .then((instance) => {
        if (cancelled) {
          instance.destroy()
          return
        }

        destroy = () => instance.destroy()
        setStatus("ready")
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus("fallback")
          console.warn("LiquidGlass could not initialize.", error)
        }
      })

    return () => {
      cancelled = true
      themeObserver.disconnect()
      destroy?.()
    }
  }, [darkConfig, enabled, glassElementRef, lightConfig, rootRef])

  return status
}
