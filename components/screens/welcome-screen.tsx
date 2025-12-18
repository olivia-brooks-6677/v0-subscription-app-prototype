"use client"

import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onContinue: () => void
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Spacer for vertical centering */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-xs">
          {/* Clean logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-foreground tracking-tight text-balance mb-3">
            Never miss another subscription charge
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Track all your subscriptions in one place and get reminders before you're charged.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4">
        <Button onClick={onContinue} className="w-full h-12 text-base font-medium rounded-xl" size="lg">
          Get Started
        </Button>
      </div>
    </div>
  )
}
