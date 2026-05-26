'use client'

import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Deal } from '@/types'

export function ExclusivityAlerts({ deals }: { deals: Deal[] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiring = deals.filter((d) => {
    if (!d.exclusivity_enabled || !d.exclusivity_ends_at) return false
    const expiry = new Date(d.exclusivity_ends_at)
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft >= 0 && daysLeft <= 30
  })

  if (expiring.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <ShieldAlert className="size-4 text-warning" strokeWidth={1.5} />
        <span className="text-sm font-semibold">Exclusivity expiring soon</span>
        <span className="ml-auto inline-flex h-5 items-center rounded-full bg-warning/10 px-2 text-xs font-semibold text-warning">
          {expiring.length}
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        {expiring.map((deal) => {
          const expiry = new Date(deal.exclusivity_ends_at!)
          const daysLeft = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )
          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-muted-foreground"
            >
              <div className="min-w-0">
                <span className="font-semibold truncate block">{deal.brand_name}</span>
                {deal.exclusivity_category && (
                  <span className="text-xs text-muted-foreground truncate block">
                    {deal.exclusivity_category}
                  </span>
                )}
              </div>
              <span
                className={`shrink-0 text-xs font-semibold ${
                  daysLeft <= 7 ? 'text-error' : 'text-warning'
                }`}
              >
                {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
