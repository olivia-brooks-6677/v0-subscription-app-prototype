"use client"

import { useState } from "react"
import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Search } from "lucide-react"

interface AddSubscriptionSheetProps {
  onAdd: (subscription: Subscription) => void
  onClose: () => void
}

const popularServices = [
  { name: "Netflix", logo: "N", price: 15.99 },
  { name: "Spotify", logo: "S", price: 9.99 },
  { name: "Disney+", logo: "D", price: 13.99 },
  { name: "HBO Max", logo: "H", price: 15.99 },
  { name: "Apple Music", logo: "A", price: 10.99 },
  { name: "Amazon Prime", logo: "P", price: 14.99 },
  { name: "YouTube Premium", logo: "Y", price: 13.99 },
  { name: "Hulu", logo: "H", price: 17.99 },
  { name: "Adobe CC", logo: "A", price: 54.99 },
  { name: "Microsoft 365", logo: "M", price: 9.99 },
  { name: "ChatGPT Plus", logo: "C", price: 20.0 },
  { name: "Notion", logo: "N", price: 8.0 },
]

export default function AddSubscriptionSheet({ onAdd, onClose }: AddSubscriptionSheetProps) {
  const [tab, setTab] = useState<"popular" | "custom">("popular")
  const [search, setSearch] = useState("")
  const [selectedService, setSelectedService] = useState<(typeof popularServices)[0] | null>(null)

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState<"monthly" | "yearly" | "weekly">("monthly")
  const [nextBilling, setNextBilling] = useState("Jan 1, 2025")
  const [reminder, setReminder] = useState(true)

  const filteredServices = popularServices.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  const handleServiceSelect = (service: (typeof popularServices)[0]) => {
    setSelectedService(service)
    setName(service.name)
    setAmount(service.price.toString())
  }

  const handleSubmit = () => {
    const subscription: Subscription = {
      id: Date.now().toString(),
      name: name || "Custom Service",
      logo: name.charAt(0).toUpperCase(),
      amount: Number.parseFloat(amount) || 0,
      frequency,
      nextBilling,
      selected: true,
    }
    onAdd(subscription)
  }

  const isFormValid = name && amount && frequency
  const showForm = selectedService || tab === "custom"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Add Subscription</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 -mr-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {!showForm ? (
        <>
          {/* Tab Toggle */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setTab("popular")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === "popular" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Popular Services
              </button>
              <button
                onClick={() => setTab("custom")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === "custom" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Custom Entry
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
                autoFocus
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1 overflow-auto px-4 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {filteredServices.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleServiceSelect(service)}
                  className="flex flex-col items-center p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center text-background font-semibold text-lg mb-2">
                    {service.logo}
                  </div>
                  <span className="text-sm font-medium text-foreground text-center leading-tight">{service.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">${service.price}/mo</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-auto px-4 py-4">
          {selectedService && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted mb-6">
              <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center text-background font-semibold text-lg">
                {selectedService.logo}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{selectedService.name}</p>
                <p className="text-sm text-muted-foreground">Suggested: ${selectedService.price}/mo</p>
              </div>
              <button
                onClick={() => {
                  setSelectedService(null)
                  setName("")
                  setAmount("")
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Change
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Service Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix"
                className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-12 rounded-xl bg-muted border-0 pl-7 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Billing Frequency</label>
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

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Next Billing Date</label>
              <Input
                value={nextBilling}
                onChange={(e) => setNextBilling(e.target.value)}
                className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Remind me 3 days before</p>
                <p className="text-sm text-muted-foreground">Get notified before renewal</p>
              </div>
              <Switch checked={reminder} onCheckedChange={setReminder} />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {showForm && (
        <footer className="px-4 py-4 border-t border-border">
          <Button onClick={handleSubmit} className="w-full h-12 rounded-xl font-medium" disabled={!isFormValid}>
            Add {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Subscription
          </Button>
        </footer>
      )}
    </div>
  )
}
