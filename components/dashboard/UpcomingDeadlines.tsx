'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, getDaysUntil, getBrandLogoUrl, getInitials } from '@/lib/utils'
import { AlertTriangle, Video, Camera, Music, Mic, Mail } from 'lucide-react'
import type { Deal, Platform } from '@/types'

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  youtube: Video,
  instagram: Camera,
  tiktok: Music,
  podcast: Mic,
  newsletter: Mail,
}

interface UpcomingDeadlinesProps {
  deals?: Deal[]
  isLoading?: boolean
}

export function UpcomingDeadlines({ deals = [], isLoading = false }: UpcomingDeadlinesProps) {
  if (isLoading) {
    return (
      <Card className="p-4 bg-[#111111] border-[#222222]">
        <h3 className="text-sm font-semibold mb-4">Upcoming Deadlines</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  // Get deals with upcoming deadlines, sorted by urgency
  const dealsWithDeadlines = deals
    .filter((deal) => deal.deadline || deal.payment_due_date)
    .map((deal) => {
      const deadlineDate = deal.deadline || deal.payment_due_date
      const daysUntil = deadlineDate ? getDaysUntil(deadlineDate) : null
      const isPayment = !deal.deadline && !!deal.payment_due_date
      return { ...deal, daysUntil, isPayment, deadlineDate }
    })
    .filter((deal) => deal.daysUntil !== null)
    .sort((a, b) => (a.daysUntil ?? 0) - (b.daysUntil ?? 0))
    .slice(0, 5)

  return (
    <Card className="p-4 bg-[#111111] border-[#222222]">
      <h3 className="text-sm font-semibold mb-4">Upcoming Deadlines</h3>
      {dealsWithDeadlines.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No upcoming deadlines
        </p>
      ) : (
        <div className="space-y-3">
          {dealsWithDeadlines.map((deal) => {
            const PlatformIcon = platformIcons[deal.platform]
            const isOverdue = (deal.daysUntil ?? 0) < 0
            const isUrgent = (deal.daysUntil ?? 0) <= 3 && !isOverdue

            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <div className="h-8 w-8 rounded bg-[#222222] flex items-center justify-center overflow-hidden">
                    <img
                      src={getBrandLogoUrl(deal.brand_name)}
                      alt=""
                      className="h-5 w-5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <span className="hidden text-xs font-medium text-muted-foreground">
                      {getInitials(deal.brand_name)}
                    </span>
                  </div>
                  <PlatformIcon className="absolute -bottom-1 -right-1 h-3 w-3 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {isOverdue && (
                      <AlertTriangle className="h-3 w-3 text-error flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium truncate">
                      {deal.brand_name}
                    </span>
                  </div>
                  <div className={`text-xs ${isOverdue ? 'text-error' : isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>
                    {deal.isPayment ? '💰 Payment' : '📅 Deliverable'}{' '}
                    {isOverdue
                      ? `overdue ${Math.abs(deal.daysUntil ?? 0)}d`
                      : deal.daysUntil === 0
                        ? 'due today'
                        : `due in ${deal.daysUntil}d`}
                  </div>
                </div>

                <div className={`text-sm font-medium ${isOverdue ? 'text-error' : ''}`}>
                  {deal.amount ? formatCurrency(deal.amount) : '—'}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}
