"use client"

import { useEffect } from "react"
import type { Subscription } from "@/app/page"
import { Check } from "lucide-react"

interface SuccessTransitionScreenProps {
  subscriptions: Subscription[]
  onContinue: () => void
}

export default function SuccessTransitionScreen({ subscriptions, onContinue }: SuccessTransitionScreenProps) {
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    if (item.frequency === "yearly") return sum + item.amount / 12
    if (item.frequency === "weekly") return sum + item.amount * 4
    return sum + item.amount
  }, 0)

  useEffect(() => {
    const timer = setTimeout(onContinue, 3000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">Added {subscriptions.length} subscriptions</h1>

        <p className="text-muted-foreground mb-8">
          You're spending <span className="font-semibold text-foreground">${monthlyTotal.toFixed(2)}/month</span> on
          subscriptions
        </p>

        <div className="flex justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
          <div
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  )
}
