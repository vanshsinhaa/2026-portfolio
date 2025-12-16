"use client";

import { useEffect, useRef } from "react";

interface UnicornSceneProps {
  projectId: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  dpi?: number;
  production?: boolean;
}

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      isInitialized?: boolean;
    };
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadScript = () => {
      if (!window.UnicornStudio) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          // Wait for script to fully load and UnicornStudio to be available
          requestAnimationFrame(() => {
            if (
              window.UnicornStudio &&
              typeof window.UnicornStudio.init === "function"
            ) {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
              scriptLoadedRef.current = true;
            }
          });
        };
        (document.head || document.body).appendChild(script);
      } else if (
        window.UnicornStudio &&
        typeof window.UnicornStudio.init === "function" &&
        !scriptLoadedRef.current
      ) {
        // Re-initialize on client-side navigation
        requestAnimationFrame(() => {
          if (
            window.UnicornStudio &&
            typeof window.UnicornStudio.init === "function"
          ) {
            window.UnicornStudio.init();
          }
        });
        scriptLoadedRef.current = true;
      }
    };

    // Load immediately, but init is deferred
    loadScript();

    // Cleanup on unmount
    return () => {
      scriptLoadedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      data-us-lazy={lazy ? "true" : "false"}
      data-us-dpi={dpi}
      data-us-production={production ? "true" : "false"}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    />
  );
}
