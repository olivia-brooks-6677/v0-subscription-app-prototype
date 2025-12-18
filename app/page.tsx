"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/screens/welcome-screen"
import DataSourceSelection from "@/components/screens/data-source-selection"
import BankAuthScreen from "@/components/screens/bank-auth-screen"
import AccountSelectionScreen from "@/components/screens/account-selection-screen"
import ScanningProgressScreen from "@/components/screens/scanning-progress-screen"
import ReviewDetectedScreen from "@/components/screens/review-detected-screen"
import SuccessTransitionScreen from "@/components/screens/success-transition-screen"
import DashboardScreen from "@/components/screens/dashboard-screen"
import AddSubscriptionSheet from "@/components/screens/add-subscription-sheet"
import SubscriptionDetailScreen from "@/components/screens/subscription-detail-screen"
import CancellationScreen from "@/components/screens/cancellation-screen"
import SettingsScreen from "@/components/screens/settings-screen"
import NotificationLanding from "@/components/screens/notification-landing"
import SmsPermissionScreen from "@/components/screens/sms-permission-screen"

export type Screen =
  | "welcome"
  | "data-source"
  | "bank-auth"
  | "account-selection"
  | "sms-permission"
  | "scanning"
  | "review"
  | "success"
  | "dashboard"
  | "add-subscription"
  | "subscription-detail"
  | "cancellation"
  | "settings"
  | "notification-landing"

export type ScanMethod = "bank" | "sms" | "manual"

export interface Subscription {
  id: string
  name: string
  logo: string
  amount: number
  frequency: "monthly" | "yearly" | "weekly"
  nextBilling: string
  selected: boolean
  category?: string
}

export default function PrototypePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [scanMethod, setScanMethod] = useState<ScanMethod | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [dashboardView, setDashboardView] = useState<"list" | "calendar" | "insights">("list")

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleDataSourceSelect = (method: ScanMethod) => {
    setScanMethod(method)
    if (method === "bank") {
      navigateTo("bank-auth")
    } else if (method === "sms") {
      navigateTo("sms-permission")
    } else {
      // Manual - go straight to dashboard with empty state
      setSubscriptions([])
      navigateTo("dashboard")
    }
  }

  const handleScanComplete = (detected: Subscription[]) => {
    setSubscriptions(detected)
    navigateTo("review")
  }

  const handleReviewComplete = (selected: Subscription[]) => {
    setSubscriptions(selected)
    navigateTo("success")
  }

  const handleAddSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => [...prev, sub])
    navigateTo("dashboard")
  }

  const handleEditSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === sub.id ? sub : s)))
    navigateTo("dashboard")
  }

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    navigateTo("dashboard")
  }

  const handleViewDetail = (sub: Subscription) => {
    setSelectedSubscription(sub)
    navigateTo("subscription-detail")
  }

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "welcome" && <WelcomeScreen onContinue={() => navigateTo("data-source")} />}

      {currentScreen === "data-source" && (
        <DataSourceSelection onSelect={handleDataSourceSelect} onBack={() => navigateTo("welcome")} />
      )}

      {currentScreen === "bank-auth" && (
        <BankAuthScreen onComplete={() => navigateTo("account-selection")} onBack={() => navigateTo("data-source")} />
      )}

      {currentScreen === "account-selection" && (
        <AccountSelectionScreen onComplete={() => navigateTo("scanning")} onBack={() => navigateTo("bank-auth")} />
      )}

      {currentScreen === "sms-permission" && (
        <SmsPermissionScreen onComplete={() => navigateTo("scanning")} onBack={() => navigateTo("data-source")} />
      )}

      {currentScreen === "scanning" && (
        <ScanningProgressScreen method={scanMethod || "bank"} onComplete={handleScanComplete} />
      )}

      {currentScreen === "review" && (
        <ReviewDetectedScreen
          subscriptions={subscriptions}
          onComplete={handleReviewComplete}
          onReviewLater={() => navigateTo("dashboard")}
        />
      )}

      {currentScreen === "success" && (
        <SuccessTransitionScreen subscriptions={subscriptions} onContinue={() => navigateTo("dashboard")} />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen
          subscriptions={subscriptions}
          view={dashboardView}
          onViewChange={setDashboardView}
          onAddClick={() => navigateTo("add-subscription")}
          onSubscriptionClick={handleViewDetail}
          onDeleteSubscription={handleDeleteSubscription}
          onSettings={() => navigateTo("settings")}
          onNotificationDemo={() => navigateTo("notification-landing")}
        />
      )}

      {currentScreen === "add-subscription" && (
        <AddSubscriptionSheet onAdd={handleAddSubscription} onClose={() => navigateTo("dashboard")} />
      )}

      {currentScreen === "subscription-detail" && selectedSubscription && (
        <SubscriptionDetailScreen
          subscription={selectedSubscription}
          onSave={handleEditSubscription}
          onDelete={handleDeleteSubscription}
          onCancel={() => navigateTo("cancellation")}
          onBack={() => navigateTo("dashboard")}
        />
      )}

      {currentScreen === "cancellation" && selectedSubscription && (
        <CancellationScreen
          subscription={selectedSubscription}
          onBack={() => navigateTo("subscription-detail")}
          onConfirmCanceled={() => {
            handleDeleteSubscription(selectedSubscription.id)
            navigateTo("dashboard")
          }}
        />
      )}

      {currentScreen === "settings" && <SettingsScreen onBack={() => navigateTo("dashboard")} />}

      {currentScreen === "notification-landing" && (
        <NotificationLanding
          subscription={
            subscriptions[0] || {
              id: "demo",
              name: "Netflix",
              logo: "N",
              amount: 15.99,
              frequency: "monthly",
              nextBilling: "Dec 20",
              selected: true,
            }
          }
          onView={() => {
            if (subscriptions[0]) {
              setSelectedSubscription(subscriptions[0])
              navigateTo("subscription-detail")
            }
          }}
          onDismiss={() => navigateTo("dashboard")}
        />
      )}
    </div>
  )
}
