"use client"

import { useEffect, useState } from "react"
import type { Subscription, ScanMethod } from "@/app/page"
import { Check } from "lucide-react"

interface ScanningProgressScreenProps {
  method: ScanMethod
  onComplete: (subscriptions: Subscription[]) => void
}

const mockSubscriptions: Subscription[] = [
  { id: "1", name: "Netflix", logo: "N", amount: 15.99, frequency: "monthly", nextBilling: "Dec 20", selected: true },
  { id: "2", name: "Spotify", logo: "S", amount: 9.99, frequency: "monthly", nextBilling: "Dec 22", selected: true },
  { id: "3", name: "Adobe CC", logo: "A", amount: 54.99, frequency: "monthly", nextBilling: "Dec 25", selected: true },
  { id: "4", name: "iCloud", logo: "i", amount: 2.99, frequency: "monthly", nextBilling: "Dec 28", selected: true },
  {
    id: "5",
    name: "YouTube Premium",
    logo: "Y",
    amount: 13.99,
    frequency: "monthly",
    nextBilling: "Jan 1",
    selected: true,
  },
  {
    id: "6",
    name: "ChatGPT Plus",
    logo: "C",
    amount: 20.0,
    frequency: "monthly",
    nextBilling: "Jan 3",
    selected: true,
  },
  { id: "7", name: "Figma", logo: "F", amount: 144.0, frequency: "yearly", nextBilling: "Mar 15", selected: true },
  { id: "8", name: "GitHub Pro", logo: "G", amount: 4.0, frequency: "monthly", nextBilling: "Jan 5", selected: true },
]

export default function ScanningProgressScreen({ method, onComplete }: ScanningProgressScreenProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Connecting...")
  const [foundCount, setFoundCount] = useState(0)

  useEffect(() => {
    const duration = method === "bank" ? 3000 : 2000

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2

        if (newProgress < 20) {
          setStatus(method === "bank" ? "Connecting to bank..." : "Scanning messages...")
        } else if (newProgress < 80) {
          setStatus("Analyzing transactions...")
          setFoundCount(Math.floor((newProgress - 20) / 10))
        } else if (newProgress >= 100) {
          setStatus(`Found ${mockSubscriptions.length} subscriptions`)
          setFoundCount(mockSubscriptions.length)
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete(mockSubscriptions)
          }, 800)
          return 100
        }
        return newProgress
      })
    }, duration / 50)

    return () => clearInterval(interval)
  }, [method, onComplete])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs text-center">
        {/* Progress indicator */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {progress < 100 ? (
            <>
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.26} 226`}
                  className="text-primary transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground font-mono">{progress}%</span>
              </div>
            </>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>

        {/* Status */}
        <h2 className="text-lg font-semibold text-foreground mb-2">{status}</h2>

        {foundCount > 0 && progress < 100 && (
          <p className="text-muted-foreground text-sm">Found {foundCount} so far...</p>
        )}
      </div>
    </div>
  )
}
