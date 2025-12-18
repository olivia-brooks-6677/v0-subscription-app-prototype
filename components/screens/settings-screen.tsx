"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  User,
  Bell,
  Database,
  Palette,
  Shield,
  CreditCard,
  ChevronRight,
  Building2,
  MessageSquare,
} from "lucide-react"

interface SettingsScreenProps {
  onBack: () => void
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true)
  const [reminderTiming, setReminderTiming] = useState("3")
  const [dayOfReminder, setDayOfReminder] = useState(false)
  const [monthlySummary, setMonthlySummary] = useState(false)
  const [localOnly, setLocalOnly] = useState(true)
  const [theme, setTheme] = useState("system")
  const [currency, setCurrency] = useState("USD")

  const sections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Profile", value: "john@email.com", action: true },
        { label: "Change Password", action: true },
        { label: "Delete Account", action: true, destructive: true },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Enable Notifications", toggle: true, value: notifications, onChange: setNotifications },
        {
          label: "Reminder Timing",
          select: true,
          value: reminderTiming,
          onChange: setReminderTiming,
          options: [
            { value: "1", label: "1 day before" },
            { value: "3", label: "3 days before" },
            { value: "7", label: "7 days before" },
          ],
        },
        { label: "Day-of Reminders", toggle: true, value: dayOfReminder, onChange: setDayOfReminder },
        { label: "Monthly Summary", toggle: true, value: monthlySummary, onChange: setMonthlySummary },
      ],
    },
    {
      title: "Data Sources",
      icon: Database,
      items: [
        { label: "Chase ••••4521", icon: Building2, action: true, subtitle: "Connected" },
        { label: "SMS Scanning", icon: MessageSquare, toggle: true, value: true },
        { label: "Add Another Bank", action: true },
        { label: "Scan Again", action: true },
      ],
    },
    {
      title: "Display",
      icon: Palette,
      items: [
        {
          label: "Currency",
          select: true,
          value: currency,
          onChange: setCurrency,
          options: [
            { value: "USD", label: "USD ($)" },
            { value: "EUR", label: "EUR (€)" },
            { value: "GBP", label: "GBP (£)" },
          ],
        },
        {
          label: "Theme",
          select: true,
          value: theme,
          onChange: setTheme,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ],
        },
      ],
    },
    {
      title: "Privacy & Data",
      icon: Shield,
      items: [
        {
          label: "Store Data Locally Only",
          toggle: true,
          value: localOnly,
          onChange: setLocalOnly,
          subtitle: "Data stays on device",
        },
        { label: "Export Data (CSV)", action: true },
        { label: "Delete All Data", action: true, destructive: true },
        { label: "Privacy Policy", action: true },
      ],
    },
    {
      title: "Premium",
      icon: CreditCard,
      items: [
        { label: "Current Plan", value: "Free", action: true },
        { label: "Upgrade to Premium", action: true, highlight: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card flex items-center h-14 px-4 border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-1 font-medium text-foreground">Settings</span>
      </header>

      <main className="flex-1 overflow-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <section.icon className="w-3.5 h-3.5" />
                {section.title}
              </div>
            </div>
            <div className="bg-card border-y border-border">
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {"icon" in item && item.icon && <item.icon className="w-5 h-5 text-muted-foreground" />}
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          item.destructive ? "text-destructive" : item.highlight ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </p>
                      {"subtitle" in item && item.subtitle && (
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {item.toggle && "onChange" in item && (
                    <Switch checked={item.value as boolean} onCheckedChange={item.onChange as (v: boolean) => void} />
                  )}

                  {item.select && "onChange" in item && "options" in item && (
                    <Select value={item.value as string} onValueChange={item.onChange as (v: string) => void}>
                      <SelectTrigger className="w-auto h-8 border-0 bg-muted text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {item.action && !item.toggle && !item.select && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {"value" in item && item.value && <span className="text-sm">{item.value}</span>}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">SubTracker v1.0.0</p>
        </div>
      </main>
    </div>
  )
}
