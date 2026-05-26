'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DealCard } from './DealCard'
import { formatCurrency } from '@/lib/utils'
import type { Deal, DealStatus } from '@/types'
import { DEAL_STATUS_COLORS } from '@/types'

const COLUMNS: { status: DealStatus; label: string }[] = [
  { status: 'negotiating', label: 'Negotiating' },
  { status: 'contracted', label: 'Contracted' },
  { status: 'in_production', label: 'In Production' },
  { status: 'live', label: 'Live' },
  { status: 'invoiced', label: 'Invoiced' },
  { status: 'paid', label: 'Paid' },
]

interface KanbanColumnProps {
  status: DealStatus
  label: string
  deals: Deal[]
  color: string
}

function KanbanColumn({ status, label, deals, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const totalValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] max-w-[280px] ${
        isOver ? 'bg-surface' : ''
      } rounded-lg transition-colors`}
    >
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {deals.length}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatCurrency(totalValue)}
        </span>
      </div>

      <div className="flex-1 space-y-2 px-1 pb-2 min-h-[200px]">
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

interface DealKanbanProps {
  deals?: Deal[]
  isLoading?: boolean
  onStatusChange?: (dealId: string, newStatus: DealStatus) => void
}

export function DealKanban({ deals = [], isLoading = false, onStatusChange }: DealKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const dealId = active.id as string
    const newStatus = over.id as DealStatus

    // Check if dropped on a column
    if (COLUMNS.some((col) => col.status === newStatus)) {
      const deal = deals.find((d) => d.id === dealId)
      if (deal && deal.status !== newStatus) {
        onStatusChange?.(dealId, newStatus)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="min-w-[280px]">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2 px-1">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-3 bg-[#0D0D0D] border-[#1E1E1E]">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Group deals by status
  const dealsByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.status] = deals.filter((d) => d.status === col.status)
    return acc
  }, {} as Record<DealStatus, Deal[]>)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            deals={dealsByStatus[col.status] || []}
            color={DEAL_STATUS_COLORS[col.status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
