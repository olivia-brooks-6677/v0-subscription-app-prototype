"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"

interface AccountSelectionScreenProps {
  onComplete: () => void
  onBack: () => void
}

const accounts = [
  { id: "checking", name: "Checking ••••4521", type: "checking", icon: Wallet },
  { id: "savings", name: "Savings ••••8932", type: "savings", icon: Wallet },
  { id: "credit1", name: "Credit Card ••••2847", type: "credit", icon: CreditCard },
  { id: "credit2", name: "Credit Card ••••9163", type: "credit", icon: CreditCard },
]

export default function AccountSelectionScreen({ onComplete, onBack }: AccountSelectionScreenProps) {
  const [selected, setSelected] = useState<string[]>(["checking", "credit1"])

  const toggleAccount = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

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
        <span className="ml-1 font-medium text-foreground">Select Accounts</span>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground mb-1">Which accounts should we scan?</h1>
          <p className="text-sm text-muted-foreground">Select accounts where you pay for subscriptions</p>
        </div>

        <div className="space-y-2 mb-8">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => toggleAccount(account.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                selected.includes(account.id)
                  ? "border-primary bg-accent/50"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <account.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{account.name}</span>
              <Checkbox
                checked={selected.includes(account.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </button>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="px-4 pb-10 pt-4 border-t border-border">
        <Button onClick={onComplete} className="w-full h-12 rounded-xl font-medium" disabled={selected.length === 0}>
          Scan {selected.length} Account{selected.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  )
}
