'use client'

import { useState } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Deal } from '@/types'

interface ExclusivitySectionProps {
  deal: Deal
  onUpdate: (fields: Partial<Deal>) => Promise<void>
}

export function ExclusivitySection({ deal, onUpdate }: ExclusivitySectionProps) {
  const [saving, setSaving] = useState(false)
  const [enabled, setEnabled] = useState(deal.exclusivity_enabled ?? false)
  const [category, setCategory] = useState(deal.exclusivity_category ?? '')
  const [endsAt, setEndsAt] = useState(deal.exclusivity_ends_at ?? '')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiryDate = endsAt ? new Date(endsAt) : null
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 14
  const isActive = enabled && expiryDate !== null && !isExpired

  async function handleSave() {
    setSaving(true)
    try {
      await onUpdate({
        exclusivity_enabled: enabled,
        exclusivity_category: category || null,
        exclusivity_ends_at: endsAt || null,
      })
    } finally {
      setSaving(false)
    }
  }

  function handleToggle(checked: boolean) {
    setEnabled(checked)
    if (!checked) {
      onUpdate({
        exclusivity_enabled: false,
        exclusivity_category: deal.exclusivity_category,
        exclusivity_ends_at: deal.exclusivity_ends_at,
      })
    }
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isActive && isExpiringSoon ? (
            <ShieldAlert className="size-4 text-warning" strokeWidth={1.5} />
          ) : isActive ? (
            <ShieldAlert className="size-4 text-error" strokeWidth={1.5} />
          ) : (
            <ShieldCheck className="size-4 text-muted-foreground" strokeWidth={1.5} />
          )}
          <span className="text-sm font-semibold">Exclusivity clause</span>
          {isActive && !isExpired && (
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold ${
                isExpiringSoon
                  ? 'bg-warning/10 text-warning'
                  : 'bg-error/10 text-error'
              }`}
            >
              {isExpiringSoon && daysUntilExpiry === 0
                ? 'Expires today'
                : isExpiringSoon
                ? `${daysUntilExpiry}d left`
                : `Active until ${formatDate(endsAt)}`}
            </span>
          )}
          {isExpired && (
            <span className="inline-flex h-5 items-center rounded-full bg-surface px-2 text-xs font-semibold text-muted-foreground">
              Expired
            </span>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => handleToggle(!enabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            enabled ? 'bg-brand' : 'bg-muted'
          }`}
        >
          <span
            className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="excl-category" className="text-xs text-muted-foreground">
              Category covered
            </Label>
            <Input
              id="excl-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. fitness brands, productivity apps"
              className="h-9 text-sm"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="excl-ends-at" className="text-xs text-muted-foreground">
              Exclusivity ends
            </Label>
            <Input
              id="excl-ends-at"
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 text-xs"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
