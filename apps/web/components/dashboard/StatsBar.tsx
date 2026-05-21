'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Briefcase, AlertCircle, Calendar } from 'lucide-react'

interface DealStats {
  totalPipeline: number
  activeDeals: number
  earnedYTD: number
  lastYearEarned: number
  outstanding: number
  overdueCount: number
  dealsThisMonth: number
  dealsLastMonth: number
}

interface StatsBarProps {
  stats?: DealStats
  isLoading?: boolean
}

export function StatsBar({ stats, isLoading = false }: StatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 bg-surface border-border">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    )
  }

  const defaultStats: DealStats = {
    totalPipeline: 0,
    activeDeals: 0,
    earnedYTD: 0,
    lastYearEarned: 0,
    outstanding: 0,
    overdueCount: 0,
    dealsThisMonth: 0,
    dealsLastMonth: 0,
  }

  const data = stats || defaultStats

  const yoyChange = data.lastYearEarned > 0
    ? ((data.earnedYTD - data.lastYearEarned) / data.lastYearEarned * 100).toFixed(0)
    : null

  const monthChange = data.dealsThisMonth - data.dealsLastMonth

  const statCards = [
    {
      label: 'Total Pipeline',
      value: formatCurrency(data.totalPipeline),
      subtext: `${data.activeDeals} active deals`,
      icon: Briefcase,
      color: 'text-primary',
    },
    {
      label: 'Earned YTD',
      value: formatCurrency(data.earnedYTD),
      subtext: yoyChange
        ? `${Number(yoyChange) >= 0 ? '+' : ''}${yoyChange}% vs last year`
        : 'No data last year',
      icon: Number(yoyChange) >= 0 ? TrendingUp : TrendingDown,
      color: 'text-success',
    },
    {
      label: 'Outstanding',
      value: formatCurrency(data.outstanding),
      subtext: data.overdueCount > 0
        ? `${data.overdueCount} overdue`
        : 'All on track',
      icon: data.overdueCount > 0 ? AlertCircle : DollarSign,
      color: data.overdueCount > 0 ? 'text-warning' : 'text-muted-foreground',
    },
    {
      label: 'Deals This Month',
      value: data.dealsThisMonth.toString(),
      subtext: monthChange !== 0
        ? `${monthChange > 0 ? '+' : ''}${monthChange} from last month`
        : 'Same as last month',
      icon: Calendar,
      color: 'text-primary',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 bg-[#111111] border-[#222222] hover:border-[#333333] transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>
        </Card>
      ))}
    </div>
  )
}
