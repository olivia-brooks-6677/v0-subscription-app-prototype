"use client"

import { ArrowLeft, Building2, MessageSquare, PenLine, Lock } from "lucide-react"
import type { ScanMethod } from "@/app/page"

interface DataSourceSelectionProps {
  onSelect: (method: ScanMethod) => void
  onBack: () => void
}

export default function DataSourceSelection({ onSelect, onBack }: DataSourceSelectionProps) {
  const options = [
    {
      id: "bank" as ScanMethod,
      icon: Building2,
      title: "Link Bank Account",
      badge: "Most comprehensive",
      description: "Scan your transactions for subscriptions",
      privacy: "Read-only access, encrypted",
    },
    {
      id: "sms" as ScanMethod,
      icon: MessageSquare,
      title: "Scan Messages",
      badge: "Fastest setup",
      description: "Find subscriptions from confirmation texts",
      privacy: "Data stays on device",
    },
    {
      id: "manual" as ScanMethod,
      icon: PenLine,
      title: "Add Manually",
      badge: "Full privacy",
      description: "Enter your subscriptions yourself",
      privacy: "No data shared",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center h-14 px-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-1 font-medium text-foreground">Choose Setup Method</span>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground mb-1">How would you like to find your subscriptions?</h1>
          <p className="text-sm text-muted-foreground">Choose the method that works best for you</p>
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="w-full p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <option.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-foreground">{option.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      {option.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <Lock className="w-3 h-3" />
                    <span>{option.privacy}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
