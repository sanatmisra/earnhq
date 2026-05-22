'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils'
import type { Invoice } from '@/types'
import { toast } from 'sonner'

type Section = 'overdue' | 'due_soon' | 'upcoming' | 'paid'

interface InvoiceRowProps {
  invoice: Invoice
  onMarkPaid: (id: string) => void
  onSendReminder: (id: string) => void
  isPaying: boolean
  isSending: boolean
}

function InvoiceRow({ invoice, onMarkPaid, onSendReminder, isPaying, isSending }: InvoiceRowProps) {
  const daysUntil = invoice.due_date ? getDaysUntil(invoice.due_date) : null
  const isOverdue = invoice.status === 'overdue' || (daysUntil !== null && daysUntil < 0)

  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#222222] bg-[#111111] p-4">
      <div className="shrink-0">
        {isOverdue ? (
          <AlertCircle className="h-5 w-5 text-[#EF4444]" />
        ) : daysUntil !== null && daysUntil <= 7 ? (
          <Clock className="h-5 w-5 text-[#F59E0B]" />
        ) : (
          <Clock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{invoice.client_name}</span>
          <Badge
            variant="secondary"
            className={`text-xs ${isOverdue ? 'border-[#EF444440] bg-[#EF444420] text-[#EF4444]' : 'border-[#22222280] bg-[#111111] text-muted-foreground'}`}
          >
            {invoice.invoice_number}
          </Badge>
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground">
          {invoice.due_date ? (
            isOverdue
              ? `${Math.abs(daysUntil ?? 0)} day${Math.abs(daysUntil ?? 0) !== 1 ? 's' : ''} overdue`
              : daysUntil !== null
              ? `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} — ${formatDate(invoice.due_date)}`
              : formatDate(invoice.due_date)
          ) : 'No due date'}
        </div>
      </div>

      <span className={`text-lg font-semibold ${isOverdue ? 'text-[#EF4444]' : 'text-foreground'}`}>
        {formatCurrency(invoice.total, invoice.currency)}
      </span>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[#222222] text-xs"
          disabled={isSending || !invoice.client_email}
          onClick={() => onSendReminder(invoice.id)}
        >
          {isSending ? (
            <span className="flex items-center gap-1.5"><Send className="h-3 w-3 animate-pulse" /> Sending…</span>
          ) : (
            <span className="flex items-center gap-1.5"><Send className="h-3 w-3" /> Remind</span>
          )}
        </Button>
        <Button
          size="sm"
          className="bg-[#22C55E] text-xs text-white hover:bg-[#16a34a]"
          disabled={isPaying}
          onClick={() => onMarkPaid(invoice.id)}
        >
          {isPaying ? (
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 animate-pulse" /> Marking…</span>
          ) : (
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Mark Paid</span>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [paying, setPaying] = useState<string | null>(null)
  const [sending, setSending] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/invoices')
      if (res.ok) {
        const json = await res.json()
        setInvoices(json.data ?? [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const { overdue, dueSoon, upcoming, recentlyPaid, totalOutstanding } = useMemo(() => {
    const outstanding: Invoice[] = []
    const recentlyPaid: Invoice[] = []

    for (const inv of invoices) {
      if (inv.status === 'paid') {
        recentlyPaid.push(inv)
      } else if (inv.status !== 'cancelled') {
        outstanding.push(inv)
      }
    }

    const overdue = outstanding.filter(i => {
      const d = i.due_date ? getDaysUntil(i.due_date) : null
      return i.status === 'overdue' || (d !== null && d < 0)
    })
    const dueSoon = outstanding.filter(i => {
      const d = i.due_date ? getDaysUntil(i.due_date) : null
      return i.status !== 'overdue' && d !== null && d >= 0 && d <= 7
    })
    const upcoming = outstanding.filter(i => {
      const d = i.due_date ? getDaysUntil(i.due_date) : null
      return i.status !== 'overdue' && (d === null || d > 7)
    })
    const totalOutstanding = outstanding.reduce((s, i) => s + i.total, 0)

    return { overdue, dueSoon, upcoming, recentlyPaid: recentlyPaid.slice(0, 5), totalOutstanding }
  }, [invoices])

  async function markPaid(id: string) {
    setPaying(id)
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Invoice marked as paid')
      fetchInvoices()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update invoice')
    } finally {
      setPaying(null)
    }
  }

  async function sendReminder(id: string) {
    setSending(id)
    try {
      const res = await fetch(`/api/invoices/${id}/send`, { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Reminder sent')
      fetchInvoices()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send reminder')
    } finally {
      setSending(null)
    }
  }

  const sections: { key: Section; label: string; items: Invoice[]; accent: string }[] = [
    { key: 'overdue', label: 'Overdue', items: overdue, accent: 'text-[#EF4444]' },
    { key: 'due_soon', label: 'Due within 7 days', items: dueSoon, accent: 'text-[#F59E0B]' },
    { key: 'upcoming', label: 'Upcoming', items: upcoming, accent: 'text-muted-foreground' },
  ]

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track outstanding invoices and chase payments.</p>
        </div>
        {totalOutstanding > 0 && (
          <div className="rounded-lg border border-[#222222] bg-[#111111] px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground">Total outstanding</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{formatCurrency(totalOutstanding)}</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
        </div>
      ) : (
        <>
          {sections.map(({ key, label, items, accent }) =>
            items.length === 0 ? null : (
              <section key={key} className="space-y-3">
                <h2 className={`text-sm font-semibold uppercase tracking-wide ${accent}`}>{label}</h2>
                {items.map(inv => (
                  <InvoiceRow
                    key={inv.id}
                    invoice={inv}
                    onMarkPaid={markPaid}
                    onSendReminder={sendReminder}
                    isPaying={paying === inv.id}
                    isSending={sending === inv.id}
                  />
                ))}
              </section>
            )
          )}

          {overdue.length === 0 && dueSoon.length === 0 && upcoming.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-[#222222] bg-[#111111] p-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-[#22C55E]" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">No outstanding payments right now.</p>
            </div>
          )}

          {recentlyPaid.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Payments</h2>
              {recentlyPaid.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 rounded-lg border border-[#222222] bg-[#111111] p-4 opacity-70">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22C55E]" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{inv.client_name}</span>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {inv.paid_date ? `Received ${formatDate(inv.paid_date)}` : 'Paid'}
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-[#22C55E]">
                    {formatCurrency(inv.total, inv.currency)}
                  </span>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
