"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __behaviorScriptsLoaded?: boolean;
  }
}

// The site's vanilla JS (public/scripts) drives every behavior:
// filters, gallery view, modals, carousel, theme, clock/weather, sounds,
// column drag. It mutates the DOM, so it must only load after hydration.
export function BehaviorScripts() {
  useEffect(() => {
    if (window.__behaviorScriptsLoaded) return;
    window.__behaviorScriptsLoaded = true;
    for (const src of ["/scripts/base.js", "/scripts/index.js"]) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      document.body.appendChild(s);
    }
  }, []);
  return null;
}
