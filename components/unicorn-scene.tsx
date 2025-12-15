"use client"

import { useEffect, useRef } from "react"

interface UnicornSceneProps {
  projectId: string
  className?: string
  width?: number
  height?: number
  lazy?: boolean
  dpi?: number
  production?: boolean
}

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void
      isInitialized?: boolean
    }
  }
}

export function UnicornScene({
  projectId,
  className = "",
  width = 1080,
  height = 1080,
  lazy = true,
  dpi = 1,
  production = false,
}: UnicornSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const loadScript = () => {
      if (!window.UnicornStudio) {
        window.UnicornStudio = { isInitialized: false }
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js"
        script.async = true
        script.onload = () => {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init()
            window.UnicornStudio.isInitialized = true
          }
        }
        ;(document.head || document.body).appendChild(script)
        scriptLoadedRef.current = true
      } else if (window.UnicornStudio && !scriptLoadedRef.current) {
        // Re-initialize on client-side navigation
        window.UnicornStudio.init()
        scriptLoadedRef.current = true
      }
    }

    // Load after page is interactive
    if (document.readyState === "complete") {
      loadScript()
    } else {
      window.addEventListener("load", loadScript)
      return () => window.removeEventListener("load", loadScript)
    }
    
    // Cleanup on unmount
    return () => {
      scriptLoadedRef.current = false
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      data-us-lazy={lazy ? "true" : "false"}
      data-us-dpi={dpi}
      data-us-production={production ? "true" : "false"}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  )
}
