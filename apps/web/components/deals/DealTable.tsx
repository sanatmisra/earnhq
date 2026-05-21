'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, getBrandLogoUrl, getInitials } from '@/lib/utils'
import {
  Video,
  Camera,
  Music,
  Mic,
  Mail,
  MoreHorizontal,
  ArrowUpDown,
  FileText,
  CheckCircle,
  Archive,
  Pencil,
} from 'lucide-react'
import type { Deal, Platform, DealStatus } from '@/types'
import { DEAL_STATUS_COLORS, PLATFORM_LABELS, DEAL_TYPE_LABELS } from '@/types'

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  youtube: Video,
  instagram: Camera,
  tiktok: Music,
  podcast: Mic,
  newsletter: Mail,
}

type SortField = 'brand_name' | 'amount' | 'deadline' | 'payment_due_date' | 'status'
type SortDirection = 'asc' | 'desc'

interface DealTableProps {
  deals?: Deal[]
  isLoading?: boolean
  onEdit?: (deal: Deal) => void
  onInvoice?: (deal: Deal) => void
  onMarkPaid?: (deal: Deal) => void
  onArchive?: (deal: Deal) => void
}

export function DealTable({
  deals = [],
  isLoading = false,
  onEdit,
  onInvoice,
  onMarkPaid,
  onArchive,
}: DealTableProps) {
  const [sortField, setSortField] = useState<SortField>('deadline')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedDeals = [...deals].sort((a, b) => {
    let aVal: string | number | null = null
    let bVal: string | number | null = null

    switch (sortField) {
      case 'brand_name':
        aVal = a.brand_name.toLowerCase()
        bVal = b.brand_name.toLowerCase()
        break
      case 'amount':
        aVal = a.amount || 0
        bVal = b.amount || 0
        break
      case 'deadline':
        aVal = a.deadline || ''
        bVal = b.deadline || ''
        break
      case 'payment_due_date':
        aVal = a.payment_due_date || ''
        bVal = b.payment_due_date || ''
        break
      case 'status':
        aVal = a.status
        bVal = b.status
        break
    }

    if (aVal === null || bVal === null) return 0
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#222222] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#222222] hover:bg-transparent">
              <TableHead className="text-muted-foreground">Brand</TableHead>
              <TableHead className="text-muted-foreground">Platform</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Deadline</TableHead>
              <TableHead className="text-muted-foreground">Payment Due</TableHead>
              <TableHead className="text-muted-foreground w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-[#222222]">
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  )

  return (
    <div className="rounded-lg border border-[#222222] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#222222] hover:bg-transparent bg-[#0D0D0D]">
            <TableHead>
              <SortButton field="brand_name">Brand</SortButton>
            </TableHead>
            <TableHead className="text-muted-foreground">Platform</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead>
              <SortButton field="amount">Amount</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="deadline">Deadline</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="payment_due_date">Payment Due</SortButton>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDeals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No deals found
              </TableCell>
            </TableRow>
          ) : (
            sortedDeals.map((deal) => {
              const PlatformIcon = platformIcons[deal.platform]
              return (
                <TableRow
                  key={deal.id}
                  className="border-[#222222] hover:bg-[#111111] cursor-pointer"
                >
                  <TableCell>
                    <Link href={`/deals/${deal.id}`} className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-[#1A1A1A] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={getBrandLogoUrl(deal.brand_name)}
                          alt=""
                          className="h-4 w-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <span className="hidden text-xs font-medium text-muted-foreground">
                          {getInitials(deal.brand_name)}
                        </span>
                      </div>
                      <span className="font-medium">{deal.brand_name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <PlatformIcon className="h-4 w-4" />
                      <span className="text-sm">{PLATFORM_LABELS[deal.platform]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {DEAL_TYPE_LABELS[deal.deal_type]}
                  </TableCell>
                  <TableCell className="font-medium">
                    {deal.amount ? formatCurrency(deal.amount) : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${DEAL_STATUS_COLORS[deal.status]}20`,
                        color: DEAL_STATUS_COLORS[deal.status],
                        borderColor: `${DEAL_STATUS_COLORS[deal.status]}40`,
                      }}
                      className="border capitalize"
                    >
                      {deal.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {deal.deadline ? formatDate(deal.deadline) : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {deal.payment_due_date ? formatDate(deal.payment_due_date) : '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#222222]">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(deal)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onInvoice?.(deal)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMarkPaid?.(deal)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onArchive?.(deal)}
                          className="text-muted-foreground"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
