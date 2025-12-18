"use client"

import { useState } from "react"
import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, Phone, ExternalLink, Check } from "lucide-react"

interface CancellationScreenProps {
  subscription: Subscription
  onBack: () => void
  onConfirmCanceled: () => void
}

const cancellationData: Record<
  string,
  { method: string; difficulty: "easy" | "medium" | "hard"; steps: string[]; link?: string; phone?: string }
> = {
  Netflix: {
    method: "Website",
    difficulty: "easy",
    steps: [
      "Go to netflix.com and sign in",
      "Click your profile icon → Account",
      "Click 'Cancel Membership'",
      "Confirm cancellation",
    ],
    link: "https://netflix.com/account",
  },
  Spotify: {
    method: "Website",
    difficulty: "easy",
    steps: [
      "Go to spotify.com/account",
      "Click 'Change plan'",
      "Scroll down and click 'Cancel Premium'",
      "Confirm cancellation",
    ],
    link: "https://spotify.com/account",
  },
  "Adobe CC": {
    method: "Phone",
    difficulty: "hard",
    steps: [
      "Call Adobe customer support",
      "Navigate through phone menu to cancellation",
      "Speak with retention specialist",
      "Confirm cancellation (may require early termination fee)",
    ],
    phone: "1-800-833-6687",
  },
  Default: {
    method: "Website",
    difficulty: "medium",
    steps: [
      "Log in to your account on the service website",
      "Navigate to Account or Subscription settings",
      "Look for Cancel or Cancel Subscription option",
      "Follow the cancellation flow",
    ],
  },
}

export default function CancellationScreen({ subscription, onBack, onConfirmCanceled }: CancellationScreenProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const data = cancellationData[subscription.name] || cancellationData.Default

  const difficultyStyles = {
    easy: "text-primary bg-primary/10",
    medium: "text-orange-600 bg-orange-50",
    hard: "text-destructive bg-destructive/10",
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
        <span className="ml-1 font-medium text-foreground">Cancel {subscription.name}</span>
      </header>

      <main className="flex-1 overflow-auto px-4 py-6">
        {/* Method & Difficulty */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground">
            {data.method === "Phone" ? <Phone className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
            {data.method}
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${difficultyStyles[data.difficulty]}`}>
            {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}
          </div>
        </div>

        {/* Steps */}
        <section className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">Cancellation Steps</h3>
          <div className="space-y-3">
            {data.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                  {i + 1}
                </div>
                <p className="text-foreground pt-0.5 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Direct Actions */}
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-foreground text-background mb-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Open {subscription.name} Account</span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-60" />
          </a>
        )}

        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="flex items-center justify-between p-4 rounded-xl bg-foreground text-background mb-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Call {data.phone}</span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-60" />
          </a>
        )}

        {/* Free Notice */}
        <div className="bg-primary/10 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Always Free</p>
              <p className="text-xs text-muted-foreground">
                Cancellation instructions are always free. No paywall, no premium required.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Upsell */}
        <div className="bg-muted rounded-xl p-4 border border-border">
          <p className="font-medium text-foreground text-sm mb-1">Want us to cancel for you?</p>
          <p className="text-xs text-muted-foreground mb-3">Upgrade to Premium for Concierge Cancellation service.</p>
          <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
            Learn More
          </Button>
        </div>
      </main>

      {/* Bottom Action */}
      <footer className="px-4 py-4 border-t border-border">
        <Button
          onClick={() => setShowConfirmDialog(true)}
          variant="outline"
          className="w-full h-12 rounded-xl font-medium"
        >
          I've Canceled This Subscription
        </Button>
      </footer>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center px-6 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Did you cancel?</h3>
            <p className="text-muted-foreground mb-6">
              This will archive {subscription.name} from your active subscriptions.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl bg-transparent"
                onClick={() => setShowConfirmDialog(false)}
              >
                Not Yet
              </Button>
              <Button className="flex-1 h-11 rounded-xl" onClick={onConfirmCanceled}>
                Yes, Canceled
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
