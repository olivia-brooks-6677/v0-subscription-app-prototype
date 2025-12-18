"use client"

import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface NotificationLandingProps {
  subscription: Subscription
  onView: () => void
  onDismiss: () => void
}

export default function NotificationLanding({ subscription, onView, onDismiss }: NotificationLandingProps) {
  return (
    <div className="min-h-screen bg-foreground flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 text-background text-sm">
        <span className="font-medium">9:41</span>
        <div className="flex items-center gap-2 text-xs opacity-80">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Notification */}
      <div className="px-4 py-2 mt-8">
        <div className="bg-card rounded-2xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SubTracker</span>
                <span className="text-xs text-muted-foreground">now</span>
              </div>
              <p className="font-semibold text-foreground mb-0.5">{subscription.name} renews in 3 days</p>
              <p className="text-sm text-muted-foreground">
                ${subscription.amount.toFixed(2)} will be charged on {subscription.nextBilling}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={onView} className="flex-1 h-10 rounded-xl text-sm font-medium">
              View
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              className="flex-1 h-10 rounded-xl text-sm font-medium bg-transparent"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-background/10 flex items-center justify-center mb-4">
          <Bell className="w-7 h-7 text-background" />
        </div>
        <h2 className="text-lg font-semibold text-background mb-2">Notification Demo</h2>
        <p className="text-background/60 text-sm max-w-xs leading-relaxed">
          This simulates a push notification received 3 days before a subscription renews.
        </p>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 rounded-full bg-background/30" />
      </div>
    </div>
  )
}
