'use client'

import Link from 'next/link'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { formatCurrency, getDaysUntil, getBrandLogoUrl, getInitials } from '@/lib/utils'
import { Video, Camera, Music, Mic, Mail, Calendar, Zap } from 'lucide-react'
import type { Deal, Platform, DealStatus } from '@/types'
import { DEAL_STATUS_COLORS } from '@/types'

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  youtube: Video,
  instagram: Camera,
  tiktok: Music,
  podcast: Mic,
  newsletter: Mail,
}

interface DealCardProps {
  deal: Deal
  isDragging?: boolean
}

export function DealCard({ deal, isDragging }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const PlatformIcon = platformIcons[deal.platform]
  const daysUntil = deal.deadline ? getDaysUntil(deal.deadline) : null
  const statusColor = DEAL_STATUS_COLORS[deal.status]

  // Progress dots based on status
  const statusOrder: DealStatus[] = ['negotiating', 'contracted', 'in_production', 'live', 'invoiced', 'paid']
  const currentIndex = statusOrder.indexOf(deal.status)
  const progressDots = statusOrder.slice(0, 5).map((_, i) => i <= currentIndex)

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-background border-border cursor-grab active:cursor-grabbing hover:border-border-strong transition-all ${
        isDragging ? 'opacity-50 shadow-lg scale-105' : ''
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="h-8 w-8 rounded bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
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
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{deal.brand_name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <PlatformIcon className="h-3 w-3" />
            <span className="truncate">{deal.title || deal.deal_type}</span>
          </div>
        </div>
        <div className="text-sm font-semibold">
          {deal.amount ? formatCurrency(deal.amount) : '—'}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {daysUntil !== null && (
            <>
              <Calendar className="h-3 w-3" />
              <span className={daysUntil < 0 ? 'text-error' : daysUntil <= 3 ? 'text-warning' : ''}>
                {daysUntil < 0
                  ? `${Math.abs(daysUntil)}d overdue`
                  : daysUntil === 0
                    ? 'Today'
                    : `${daysUntil}d`}
              </span>
              {daysUntil <= 3 && daysUntil >= 0 && (
                <Zap className="h-3 w-3 text-warning" />
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {progressDots.map((filled, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: filled ? statusColor : '#333333' }}
            />
          ))}
        </div>
      </div>

      <Link
        href={`/deals/${deal.id}`}
        className="absolute inset-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="sr-only">View deal</span>
      </Link>
    </Card>
  )
}
