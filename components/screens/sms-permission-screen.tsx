"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, Lock, Loader2 } from "lucide-react"

interface SmsPermissionScreenProps {
  onComplete: () => void
  onBack: () => void
}

export default function SmsPermissionScreen({ onComplete, onBack }: SmsPermissionScreenProps) {
  const [showSystemDialog, setShowSystemDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestPermission = () => {
    setShowSystemDialog(true)
  }

  const handleAllow = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowSystemDialog(false)
      onComplete()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Header */}
      <header className="flex items-center h-14 px-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-1 font-medium text-foreground">Message Access</span>
      </header>

      <main className="flex-1 px-4 py-8 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">Allow message scanning?</h1>
          <p className="text-muted-foreground max-w-xs leading-relaxed">
            We'll scan your messages for subscription confirmations to automatically find your subscriptions.
          </p>
        </div>

        <div className="bg-muted rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Your privacy is protected</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Data stays on your device. We scan confirmation texts for subscription details only. Nothing is sent to
                our servers.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleRequestPermission} className="w-full h-12 rounded-xl font-medium">
          Continue
        </Button>
      </main>

      {/* System Permission Dialog Simulation */}
      {showSystemDialog && (
        <div className="absolute inset-0 bg-foreground/50 flex items-end justify-center pb-8 px-4">
          <div className="bg-card rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">"SubTracker" Would Like to Access Your Messages</h3>
              <p className="text-sm text-muted-foreground">
                This allows the app to scan for subscription confirmation messages.
              </p>
            </div>
            <div className="border-t border-border flex">
              <button
                onClick={() => setShowSystemDialog(false)}
                className="flex-1 py-3.5 font-medium text-muted-foreground border-r border-border hover:bg-muted transition-colors"
              >
                Don't Allow
              </button>
              <button
                onClick={handleAllow}
                className="flex-1 py-3.5 font-medium text-primary hover:bg-accent transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Allow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
