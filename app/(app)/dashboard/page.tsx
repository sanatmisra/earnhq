'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { DealKanban } from '@/components/deals/DealKanban'
import { DealTable } from '@/components/deals/DealTable'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { NewDealModal } from '@/components/deals/NewDealModal'
import { GmailConnectButton } from '@/components/integrations/GmailConnectButton'
import { Button } from '@/components/ui/button'
import type { Deal } from '@/types'
import { toast } from 'sonner'

type ViewMode = 'kanban' | 'table'

function DashboardContent() {
  const searchParams = useSearchParams()
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('kanban')
  const [gmailConnected, setGmailConnected] = useState(false)

  useEffect(() => {
    const gmailParam = searchParams.get('gmail')
    if (gmailParam === 'connected') {
      toast.success('Gmail connected! Click "Sync Gmail" to import your deals.')
      setGmailConnected(true)
    } else if (gmailParam === 'error') {
      toast.error('Failed to connect Gmail. Please try again.')
    }
  }, [searchParams])

  useEffect(() => {
    fetchDeals()
    fetchProfile()
  }, [])

  async function fetchDeals() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/deals')
      if (res.ok) {
        const json = await res.json()
        setDeals(json.data ?? [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const json = await res.json()
        setGmailConnected(json.gmail_connected ?? false)
      }
    } catch {
      // profile fetch is best-effort
    }
  }

  function computeStats() {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1)
    const endOfLastYear = new Date(now.getFullYear(), 0, 1)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const active = deals.filter((d) => !['paid', 'cancelled'].includes(d.status))
    const totalPipeline = active.reduce((s, d) => s + (d.amount ?? 0), 0)
    const activeDeals = active.length

    const earnedYTD = deals
      .filter((d) => d.status === 'paid' && d.live_date && new Date(d.live_date) >= startOfYear)
      .reduce((s, d) => s + (d.amount ?? 0), 0)

    const lastYearEarned = deals
      .filter((d) => d.status === 'paid' && d.live_date && new Date(d.live_date) >= startOfLastYear && new Date(d.live_date) < endOfLastYear)
      .reduce((s, d) => s + (d.amount ?? 0), 0)

    const outstanding = deals
      .filter((d) => d.status === 'invoiced')
      .reduce((s, d) => s + (d.amount ?? 0), 0)

    const overdueCount = deals.filter((d) => {
      if (!d.payment_due_date || d.status === 'paid') return false
      return new Date(d.payment_due_date) < now
    }).length

    const dealsThisMonth = deals.filter((d) => d.created_at && new Date(d.created_at) >= startOfMonth).length
    const dealsLastMonth = deals.filter((d) => d.created_at && new Date(d.created_at) >= startOfLastMonth && new Date(d.created_at) < endOfLastMonth).length

    return { totalPipeline, activeDeals, earnedYTD, lastYearEarned, outstanding, overdueCount, dealsThisMonth, dealsLastMonth }
  }

  const handleDealStatusChange = async (dealId: string, newStatus: string) => {
    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, status: newStatus as Deal['status'] } : d))
    await fetch(`/api/deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? 'Loading...' : `${deals.length} deal${deals.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <GmailConnectButton connected={gmailConnected} />
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-3 ${view === 'kanban' ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => setView('kanban')}
            >
              Board
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-3 ${view === 'table' ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => setView('table')}
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      <StatsBar stats={isLoading ? undefined : computeStats()} isLoading={isLoading} />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {view === 'kanban' ? (
            <DealKanban
              deals={deals}
              isLoading={isLoading}
              onStatusChange={handleDealStatusChange}
            />
          ) : (
            <DealTable
              deals={deals}
              isLoading={isLoading}
              onEdit={() => {}}
              onInvoice={() => {}}
              onMarkPaid={async (deal) => {
                await fetch(`/api/deals/${deal.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'paid' }),
                })
                fetchDeals()
              }}
              onArchive={async (deal) => {
                await fetch(`/api/deals/${deal.id}`, { method: 'DELETE' })
                fetchDeals()
              }}
            />
          )}
        </div>

        <div className="w-72 flex-shrink-0 hidden xl:block">
          <UpcomingDeadlines deals={deals} isLoading={isLoading} />
        </div>
      </div>

      <NewDealModal onDealCreated={(deal) => setDeals((prev) => [deal, ...prev])} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}
