"use client"

import { useState } from "react"
import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2, ChevronRight } from "lucide-react"

interface SubscriptionDetailScreenProps {
  subscription: Subscription
  onSave: (subscription: Subscription) => void
  onDelete: (id: string) => void
  onCancel: () => void
  onBack: () => void
}

export default function SubscriptionDetailScreen({
  subscription,
  onSave,
  onDelete,
  onCancel,
  onBack,
}: SubscriptionDetailScreenProps) {
  const [name, setName] = useState(subscription.name)
  const [amount, setAmount] = useState(subscription.amount.toString())
  const [frequency, setFrequency] = useState(subscription.frequency)
  const [nextBilling, setNextBilling] = useState(subscription.nextBilling)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const hasChanges =
    name !== subscription.name ||
    amount !== subscription.amount.toString() ||
    frequency !== subscription.frequency ||
    nextBilling !== subscription.nextBilling

  const handleSave = () => {
    onSave({
      ...subscription,
      name,
      amount: Number.parseFloat(amount) || 0,
      frequency,
      nextBilling,
    })
  }

  const handleDelete = () => {
    onDelete(subscription.id)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-foreground">Edit Subscription</h2>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-10 h-10 -mr-2 flex items-center justify-center text-destructive hover:text-destructive/80 transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-auto px-4 py-6">
        {/* Service Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center text-background font-semibold text-xl">
            {subscription.logo}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{subscription.name}</p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">${subscription.amount.toFixed(2)}</span>/
              {subscription.frequency === "yearly" ? "yr" : "mo"}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Service Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-xl bg-muted border-0 pl-7 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Frequency</label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                <SelectTrigger className="h-12 rounded-xl bg-muted border-0">
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
            <label className="text-sm font-medium text-foreground mb-1.5 block">Next Billing Date</label>
            <Input
              value={nextBilling}
              onChange={(e) => setNextBilling(e.target.value)}
              className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Cancel Link */}
        <button
          onClick={onCancel}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-foreground">How to Cancel</p>
            <p className="text-sm text-muted-foreground">View cancellation instructions</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </main>

      {/* Save Button */}
      <footer className="px-4 py-4 border-t border-border">
        <Button onClick={handleSave} className="w-full h-12 rounded-xl font-medium" disabled={!hasChanges}>
          Save Changes
        </Button>
      </footer>

      {/* Delete Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center px-6 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Remove {subscription.name}?</h3>
            <p className="text-muted-foreground mb-6">This can't be undone.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl bg-transparent"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 h-11 rounded-xl" onClick={handleDelete}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
