"use client"

import { useEffect, useState } from "react"

export function NowRow() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider font-medium">Local time</span>
        <span className="font-mono text-white/90">{time || "—"}</span>
      </div>
      <span className="text-white/30">•</span>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider font-medium">Focus</span>
        <span className="text-white/90">Data pipelines at scale</span>
      </div>
      <span className="text-white/30">•</span>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-medium">Location</span>
            <span className="text-white/90">Tempe, AZ</span>
          </div>
    </div>
  )
}
