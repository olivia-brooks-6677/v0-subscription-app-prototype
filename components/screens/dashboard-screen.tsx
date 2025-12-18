"use client"

import { useState } from "react"
import type { Subscription } from "@/app/page"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Settings,
  Bell,
  BarChart3,
  List,
  TrendingUp,
  Tv,
  Zap,
  Grid3X3,
  Calendar,
  Check,
  ChevronDown,
} from "lucide-react"

interface DashboardScreenProps {
  subscriptions: Subscription[]
  view: "list" | "calendar" | "insights"
  onViewChange: (view: "list" | "calendar" | "insights") => void
  onAddClick: () => void
  onSubscriptionClick: (sub: Subscription) => void
  onDeleteSubscription: (id: string) => void
  onSettings: () => void
  onNotificationDemo: () => void
}

const serviceColors: Record<string, { bg: string; text: string }> = {
  N: { bg: "bg-neutral-900", text: "text-red-600" },
  S: { bg: "bg-emerald-500", text: "text-white" },
  A: { bg: "bg-red-500", text: "text-white" },
  D: { bg: "bg-sky-100", text: "text-sky-600" },
  Y: { bg: "bg-red-600", text: "text-white" },
  H: { bg: "bg-violet-600", text: "text-white" },
  G: { bg: "bg-slate-800", text: "text-white" },
  P: { bg: "bg-violet-600", text: "text-white" },
  E: { bg: "bg-slate-700", text: "text-white" },
}

function getUrgencyStatus(nextBilling: string): { label: string; isPaid: boolean } {
  const lower = nextBilling.toLowerCase()
  if (lower.includes("tomorrow") || lower.includes("1 day")) {
    return { label: "Due Tomorrow", isPaid: false }
  }
  if (lower.includes("2 day") || lower.includes("3 day")) {
    return { label: nextBilling, isPaid: false }
  }
  if (lower.includes("paid") || lower.includes("oct") || lower.includes("nov")) {
    return { label: nextBilling, isPaid: true }
  }
  return { label: nextBilling, isPaid: false }
}

export default function DashboardScreen({
  subscriptions,
  view,
  onViewChange,
  onAddClick,
  onSubscriptionClick,
  onDeleteSubscription,
  onSettings,
  onNotificationDemo,
}: DashboardScreenProps) {
  const [sortBy, setSortBy] = useState<"date" | "cost" | "name">("date")
  const [deletedId, setDeletedId] = useState<string | null>(null)
  const [showUndo, setShowUndo] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<"all" | "entertainment" | "utilities">("all")
  const [showCalendar, setShowCalendar] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active")
  const [activeTab, setActiveTab] = useState<"dashboard" | "subs" | "insights" | "settings">("subs")

  const monthlyTotal = subscriptions.reduce((sum, item) => {
    if (item.frequency === "yearly") return sum + item.amount / 12
    if (item.frequency === "weekly") return sum + item.amount * 4
    return sum + item.amount
  }, 0)

  const lastMonthTotal = monthlyTotal - 12
  const monthlyChange = monthlyTotal - lastMonthTotal

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (sortBy === "cost") return b.amount - a.amount
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  const filteredSubscriptions = sortedSubscriptions.filter((sub) => {
    if (categoryFilter === "all") return true
    return sub.category === categoryFilter
  })

  const activeSubscriptions = filteredSubscriptions.filter((sub) => !sub.nextBilling.toLowerCase().includes("ended"))
  const inactiveSubscriptions = filteredSubscriptions.filter((sub) => sub.nextBilling.toLowerCase().includes("ended"))

  const handleDelete = (id: string) => {
    setDeletedId(id)
    setShowUndo(true)
    setTimeout(() => {
      if (deletedId === id) {
        onDeleteSubscription(id)
        setShowUndo(false)
        setDeletedId(null)
      }
    }, 5000)
  }

  const handleUndo = () => {
    setDeletedId(null)
    setShowUndo(false)
  }

  const displayedSubscriptions = filteredSubscriptions.filter((s) => s.id !== deletedId)
  const displayedActive = activeSubscriptions.filter((s) => s.id !== deletedId)
  const displayedInactive = inactiveSubscriptions.filter((s) => s.id !== deletedId)

  const handleTabChange = (tab: "dashboard" | "subs" | "insights" | "settings") => {
    setActiveTab(tab)
    setShowCalendar(false) // Always close calendar when switching tabs
    if (tab === "dashboard") onViewChange("list")
    else if (tab === "subs") onViewChange("list")
    else if (tab === "insights") onViewChange("insights")
  }

  const toggleCalendarMode = () => {
    setShowCalendar(!showCalendar)
  }

  // Empty State
  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/friendly-avatar-illustration-simple.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="font-semibold text-foreground">Alex</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCalendarMode}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                  showCalendar
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Toggle calendar view"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={onNotificationDemo}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No subscriptions yet</h2>
          <p className="text-muted-foreground mb-6">Add your first subscription to start tracking</p>
          <Button
            onClick={onAddClick}
            className="h-12 rounded-full font-medium px-8 bg-primary text-primary-foreground"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </Button>
        </main>

        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} onSettings={onSettings} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {activeTab === "subs" ? (
        // Subscriptions tab header - "All Subscriptions" with plus button
        <header className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">All Subscriptions</h1>
            <button
              onClick={onAddClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label="Add subscription"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>
      ) : (
        // Dashboard/Home header - Avatar with welcome message
        <header className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/friendly-avatar-illustration-simple.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="font-semibold text-foreground">Alex</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCalendarMode}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                  showCalendar
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Toggle calendar view"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={onNotificationDemo}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>
      )}

      {activeTab === "subs" && !showCalendar && (
        <div className="px-4 mb-5">
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <p className="text-4xl font-bold text-foreground tracking-tight text-center mb-1">
              ${monthlyTotal.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-3">Total Monthly Spending</p>
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((monthlyTotal / 200) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard tab - original summary card */}
      {activeTab === "dashboard" && !showCalendar && (
        <div className="px-4 mb-5">
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Monthly Spend</p>
            <p className="text-4xl font-bold text-foreground tracking-tight mb-2">${monthlyTotal.toFixed(2)}</p>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">+${monthlyChange.toFixed(2)}</span>
              <span className="text-sm text-emerald-500">vs last month</span>
            </div>
          </div>
        </div>
      )}

      {!showCalendar && (
        <div className="px-4 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activeTab === "subs" ? (
              // Subs tab filters: Sort, Active, Category
              <>
                <button
                  onClick={() => setSortBy(sortBy === "date" ? "cost" : "date")}
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground flex items-center gap-1.5 whitespace-nowrap"
                >
                  Sort: {sortBy === "date" ? "Date" : sortBy === "cost" ? "Cost" : "Name"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    statusFilter === "active"
                      ? "bg-card text-foreground shadow-sm"
                      : "bg-card text-muted-foreground shadow-sm"
                  }`}
                >
                  Active
                  {statusFilter === "active" && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter === "all"
                        ? "entertainment"
                        : categoryFilter === "entertainment"
                          ? "utilities"
                          : "all",
                    )
                  }
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-card text-muted-foreground shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  Category
                  <ChevronDown className="w-4 h-4" />
                </button>
              </>
            ) : (
              // Dashboard tab filters: All, Entertainment, Utilities
              <>
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    categoryFilter === "all"
                      ? "bg-slate-800 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategoryFilter("entertainment")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    categoryFilter === "entertainment"
                      ? "bg-slate-800 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  Entertainment
                </button>
                <button
                  onClick={() => setCategoryFilter("utilities")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    categoryFilter === "utilities"
                      ? "bg-slate-800 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Utilities
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-auto px-4">
        {showCalendar ? (
          <CalendarView subscriptions={displayedSubscriptions} onSubscriptionClick={onSubscriptionClick} />
        ) : activeTab === "subs" ? (
          <div>
            <section className="mb-6">
              <h2 className="text-base font-semibold text-foreground mb-3">Your Subscriptions</h2>
              <div className="space-y-3">
                {displayedActive.map((sub) => {
                  const colors = serviceColors[sub.logo] || { bg: "bg-neutral-100", text: "text-foreground" }
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSubscriptionClick(sub)}
                      className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl hover:shadow-md transition-all shadow-sm"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} text-lg font-bold`}
                      >
                        {sub.logo}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">Next bill: {sub.nextBilling}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">${sub.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          /{sub.frequency === "monthly" ? "mo" : sub.frequency === "yearly" ? "yr" : "wk"}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {displayedInactive.length > 0 && statusFilter === "all" && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Inactive</h2>
                <div className="space-y-3">
                  {displayedInactive.map((sub) => {
                    const colors = serviceColors[sub.logo] || { bg: "bg-neutral-100", text: "text-foreground" }
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSubscriptionClick(sub)}
                        className="w-full flex items-center gap-3 p-4 bg-muted/50 rounded-2xl hover:shadow-md transition-all opacity-60"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} text-lg font-bold opacity-60`}
                        >
                          {sub.logo}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-muted-foreground">{sub.name}</p>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              CANCELLED
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{sub.nextBilling}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-muted-foreground">${sub.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            /{sub.frequency === "monthly" ? "mo" : sub.frequency === "yearly" ? "yr" : "wk"}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        ) : activeTab === "dashboard" ? (
          // Dashboard/Home view - Upcoming Bills
          <div>
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Upcoming Bills</h2>
                <button className="text-sm font-medium text-primary" onClick={() => handleTabChange("subs")}>
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {displayedActive.slice(0, 4).map((sub) => {
                  const colors = serviceColors[sub.logo] || { bg: "bg-neutral-100", text: "text-foreground" }
                  const isPaid = sub.nextBilling.toLowerCase().includes("paid")
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSubscriptionClick(sub)}
                      className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl hover:shadow-md transition-all shadow-sm"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} text-lg font-bold`}
                      >
                        {sub.logo}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">{sub.name}</p>
                        <div className="flex items-center gap-1.5">
                          {isPaid ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <p className="text-sm text-emerald-500">{sub.nextBilling}</p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">{sub.nextBilling}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">-${sub.amount.toFixed(2)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "insights" ? (
          <InsightsView subscriptions={displayedSubscriptions} />
        ) : null}
      </main>

      {/* FAB - only show when not in calendar mode or on subs tab (since subs has header button) */}
      {!showCalendar && activeTab !== "subs" && (
        <button
          onClick={onAddClick}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
          aria-label="Add subscription"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* FAB for calendar mode */}
      {showCalendar && (
        <button
          onClick={onAddClick}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
          aria-label="Add subscription"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} onSettings={onSettings} />

      {/* Undo Toast */}
      {showUndo && (
        <div className="fixed bottom-36 left-4 right-4 bg-card text-foreground p-4 rounded-2xl flex items-center justify-between shadow-lg border border-border">
          <span className="text-sm">Subscription removed</span>
          <button onClick={handleUndo} className="font-semibold text-sm text-primary">
            Undo
          </button>
        </div>
      )}
    </div>
  )
}

function BottomNavigation({
  activeTab,
  onTabChange,
  onSettings,
}: {
  activeTab: "dashboard" | "subs" | "insights" | "settings"
  onTabChange: (tab: "dashboard" | "subs" | "insights" | "settings") => void
  onSettings: () => void
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onTabChange("dashboard")}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${
            activeTab === "dashboard" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => onTabChange("subs")}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${
            activeTab === "subs" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <List className="w-5 h-5" />
          <span className="text-xs font-medium">Subs</span>
        </button>
        <button
          onClick={() => onTabChange("insights")}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${
            activeTab === "insights" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Insights</span>
        </button>
        <button
          onClick={() => {
            onTabChange("settings")
            onSettings()
          }}
          className={`flex flex-col items-center gap-1 py-2 px-4 ${
            activeTab === "settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  )
}

function CalendarView({
  subscriptions,
  onSubscriptionClick,
}: { subscriptions: Subscription[]; onSubscriptionClick: (sub: Subscription) => void }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysInMonth = 31
  const startDay = 0
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startDay }, (_, i) => i)

  const subsByDay: Record<number, Subscription[]> = {}
  subscriptions.forEach((sub, i) => {
    const day = ((i * 7) % 28) + 1
    if (!subsByDay[day]) subsByDay[day] = []
    subsByDay[day].push(sub)
  })

  const selectedDaySubs = selectedDay ? subsByDay[selectedDay] || [] : []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="sr-only">Previous month</span>←
        </button>
        <h3 className="font-semibold text-foreground">December 2024</h3>
        <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="sr-only">Next month</span>→
        </button>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground py-2 font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const hasSubs = subsByDay[day]?.length > 0
            const isToday = day === 17
            const isSelected = day === selectedDay

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-muted text-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                }`}
              >
                {day}
                {hasSubs && !isSelected && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {subsByDay[day].slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <h4 className="font-medium text-foreground mb-3">December {selectedDay}</h4>
          {selectedDaySubs.length > 0 ? (
            <div className="space-y-2">
              {selectedDaySubs.map((sub) => {
                const colors = serviceColors[sub.logo] || { bg: "bg-muted", text: "text-foreground" }
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSubscriptionClick(sub)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} text-sm font-bold`}
                    >
                      {sub.logo}
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-foreground">{sub.name}</span>
                    <span className="text-sm font-bold text-foreground">-${sub.amount.toFixed(2)}</span>
                  </button>
                )
              })}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-bold text-foreground">
                    -${selectedDaySubs.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No subscriptions due this day</p>
          )}
        </div>
      )}
    </div>
  )
}

function InsightsView({ subscriptions }: { subscriptions: Subscription[] }) {
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    if (item.frequency === "yearly") return sum + item.amount / 12
    if (item.frequency === "weekly") return sum + item.amount * 4
    return sum + item.amount
  }, 0)

  const topSubscriptions = [...subscriptions].sort((a, b) => b.amount - a.amount).slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Monthly Trend */}
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Monthly Trend</h3>
        <div className="flex items-end justify-between h-28 gap-2">
          {[85, 90, 88, 95, 110, monthlyTotal].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg transition-all ${i === 5 ? "bg-primary" : "bg-muted"}`}
                style={{ height: `${(val / 150) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Subscriptions */}
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Largest Subscriptions</h3>
        <div className="space-y-3">
          {topSubscriptions.map((sub, i) => {
            const colors = serviceColors[sub.logo] || { bg: "bg-muted", text: "text-foreground" }
            return (
              <div key={sub.id} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4 font-medium">{i + 1}</span>
                <div
                  className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} text-sm font-bold`}
                >
                  {sub.logo}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{sub.name}</span>
                <span className="text-sm font-bold text-foreground">-${sub.amount.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Savings Tip */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Savings Opportunity</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You have both Spotify and YouTube Premium. Consider keeping just one to save ~$10/month.
            </p>
            <button className="text-sm font-semibold text-primary">Review duplicates</button>
          </div>
        </div>
      </div>
    </div>
  )
}
