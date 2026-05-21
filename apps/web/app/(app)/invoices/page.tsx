'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/types'
import { INVOICE_STATUS_COLORS } from '@/types'

type StatusFilter = 'all' | InvoiceStatus

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true)

      try {
        const response = await fetch('/api/invoices')

        if (response.ok) {
          const json = await response.json()
          setInvoices(json.data ?? [])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const stats = useMemo(() => {
    return invoices.reduce(
      (totals, invoice) => {
        totals.invoiced += invoice.total

        if (invoice.status === 'paid') {
          totals.paid += invoice.total
        } else if (invoice.status !== 'cancelled') {
          totals.outstanding += invoice.total
        }

        if (invoice.status === 'overdue') totals.overdue += 1

        return totals
      },
      { invoiced: 0, paid: 0, outstanding: 0, overdue: 0 }
    )
  }, [invoices])

  const filteredInvoices = invoices.filter((invoice) => (
    statusFilter === 'all' || invoice.status === statusFilter
  ))

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create draft invoices from your sponsorship work and keep payment status visible.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InvoiceStat label="Total invoiced" value={formatCurrency(stats.invoiced)} />
        <InvoiceStat label="Paid" value={formatCurrency(stats.paid)} tone="success" />
        <InvoiceStat label="Outstanding" value={formatCurrency(stats.outstanding)} tone="brand" />
        <InvoiceStat label="Overdue" value={String(stats.overdue)} tone="error" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading invoices...' : `${filteredInvoices.length} invoice${filteredInvoices.length === 1 ? '' : 's'}`}
        </p>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-40 bg-[#111111]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#222222]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#222222] bg-[#0D0D0D] hover:bg-[#0D0D0D]">
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Issued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <TableRow key={index} className="border-[#222222]">
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8" />
                    <span>No invoices match this view yet.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-[#222222] hover:bg-[#111111]">
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>
                    <div>{invoice.client_name}</div>
                    {invoice.client_email && (
                      <div className="text-xs text-muted-foreground">{invoice.client_email}</div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="border capitalize"
                      style={{
                        backgroundColor: `${INVOICE_STATUS_COLORS[invoice.status]}20`,
                        borderColor: `${INVOICE_STATUS_COLORS[invoice.status]}40`,
                        color: INVOICE_STATUS_COLORS[invoice.status],
                      }}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.issue_date)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#222222] bg-[#111111]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            onCreated={(invoice) => {
              setInvoices((current) => [invoice, ...current])
              setIsFormOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InvoiceStat({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'success' | 'brand' | 'error'
}) {
  const tones = {
    default: 'text-foreground',
    success: 'text-success',
    brand: 'text-brand',
    error: 'text-error',
  }

  return (
    <div className="rounded-lg border border-[#222222] bg-[#111111] p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  )
}
