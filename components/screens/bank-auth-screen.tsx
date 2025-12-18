"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Loader2, Lock } from "lucide-react"

interface BankAuthScreenProps {
  onComplete: () => void
  onBack: () => void
}

const banks = [
  { id: "chase", name: "Chase", logo: "C" },
  { id: "bofa", name: "Bank of America", logo: "B" },
  { id: "wells", name: "Wells Fargo", logo: "W" },
  { id: "citi", name: "Citibank", logo: "C" },
  { id: "capital", name: "Capital One", logo: "C" },
  { id: "usbank", name: "US Bank", logo: "U" },
]

export default function BankAuthScreen({ onComplete, onBack }: BankAuthScreenProps) {
  const [step, setStep] = useState<"search" | "credentials" | "2fa">("search")
  const [selectedBank, setSelectedBank] = useState<(typeof banks)[0] | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const filteredBanks = banks.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))

  const handleBankSelect = (bank: (typeof banks)[0]) => {
    setSelectedBank(bank)
    setStep("credentials")
  }

  const handleCredentialsSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("2fa")
    }, 1500)
  }

  const handle2faSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center h-14 px-4 border-b border-border">
        <button
          onClick={() => {
            if (step === "search") onBack()
            else if (step === "credentials") setStep("search")
            else setStep("credentials")
          }}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-1 font-medium text-foreground">
          {step === "search" ? "Select Bank" : step === "credentials" ? "Sign In" : "Verify"}
        </span>
      </header>

      <main className="flex-1 px-4 py-6">
        {step === "search" && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for your bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center text-background font-semibold">
                    {bank.logo}
                  </div>
                  <span className="font-medium text-foreground">{bank.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "credentials" && selectedBank && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
              <div className="w-12 h-12 rounded-lg bg-foreground flex items-center justify-center text-background font-semibold text-lg">
                {selectedBank.logo}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedBank.name}</p>
                <p className="text-sm text-muted-foreground">Enter your credentials</p>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Username"
                className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Input
                placeholder="Password"
                type="password"
                className="h-12 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <Button onClick={handleCredentialsSubmit} className="w-full h-12 rounded-xl font-medium" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Your credentials are encrypted and never stored</span>
            </div>
          </div>
        )}

        {step === "2fa" && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-semibold text-foreground mb-1">Verification Required</h2>
              <p className="text-sm text-muted-foreground">Enter the code sent to your phone</p>
            </div>

            <Input
              placeholder="6-digit code"
              className="h-12 rounded-xl bg-muted border-0 text-center text-lg tracking-[0.3em] font-mono focus-visible:ring-1 focus-visible:ring-ring"
              maxLength={6}
            />

            <Button onClick={handle2faSubmit} className="w-full h-12 rounded-xl font-medium" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
