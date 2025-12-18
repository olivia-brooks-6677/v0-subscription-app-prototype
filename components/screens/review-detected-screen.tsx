"use client"

import { useState } from "react"
import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ReviewDetectedScreenProps {
  subscriptions: Subscription[]
  onComplete: (selected: Subscription[]) => void
  onReviewLater: () => void
}

export default function ReviewDetectedScreen({ subscriptions, onComplete, onReviewLater }: ReviewDetectedScreenProps) {
  const [items, setItems] = useState(subscriptions)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const selectedItems = items.filter((i) => i.selected)
  const monthlyTotal = selectedItems.reduce((sum, item) => {
    if (item.frequency === "yearly") return sum + item.amount / 12
    if (item.frequency === "weekly") return sum + item.amount * 4
    return sum + item.amount
  }, 0)

  const toggleSelect = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
  }

  const updateItem = (id: string, updates: Partial<Subscription>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const handleComplete = () => {
    onComplete(selectedItems)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border bg-card sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-foreground">Review Detected Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Found {subscriptions.length} subscriptions ·{" "}
          <span className="font-semibold text-foreground">${monthlyTotal.toFixed(2)}</span>/month
        </p>
      </header>

      {/* List */}
      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border transition-colors ${
                item.selected ? "border-border bg-card" : "border-border bg-muted/30 opacity-60"
              }`}
            >
              {/* Main Row */}
              <div className="flex items-center gap-3 p-3">
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={() => toggleSelect(item.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center text-background font-semibold shrink-0">
                  {item.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">${item.amount.toFixed(2)}</span>/
                    {item.frequency === "yearly" ? "yr" : "mo"}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={expandedId === item.id ? "Collapse" : "Expand"}
                >
                  {expandedId === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Inline Edit */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Service Name</label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="h-10 rounded-lg bg-muted border-0"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateItem(item.id, { amount: Number.parseFloat(e.target.value) || 0 })}
                          className="h-10 rounded-lg bg-muted border-0 pl-7"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1.5 block">Frequency</label>
                      <Select
                        value={item.frequency}
                        onValueChange={(v) => updateItem(item.id, { frequency: v as Subscription["frequency"] })}
                      >
                        <SelectTrigger className="h-10 rounded-lg bg-muted border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Next Billing Date</label>
                    <Input
                      value={item.nextBilling}
                      onChange={(e) => updateItem(item.id, { nextBilling: e.target.value })}
                      className="h-10 rounded-lg bg-muted border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-border bg-card">
        <Button
          onClick={handleComplete}
          className="w-full h-12 rounded-xl font-medium mb-2"
          disabled={selectedItems.length === 0}
        >
          Add {selectedItems.length} Subscription{selectedItems.length !== 1 ? "s" : ""}
        </Button>
        <button
          onClick={onReviewLater}
          className="w-full text-sm text-muted-foreground py-2 hover:text-foreground transition-colors"
        >
          Review Later
        </button>
      </footer>
    </div>
  )
}
