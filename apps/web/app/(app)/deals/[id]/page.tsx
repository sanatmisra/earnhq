'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Video,
  Camera,
  Music,
  Mic,
  Mail,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  CheckCircle2,
  Circle,
  ExternalLink,
  Pencil,
  Check,
  X,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ApprovalLoopBanner } from '@/components/deals/ApprovalLoopBanner'
import { ExclusivitySection } from '@/components/deals/ExclusivitySection'
import type { Deal, DealStatus, Platform, Deliverable } from '@/types'
import { DEAL_STATUS_COLORS, PLATFORM_LABELS, DEAL_TYPE_LABELS } from '@/types'
import { createClient } from '@/lib/supabase/client'

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  youtube: Video,
  instagram: Camera,
  tiktok: Music,
  podcast: Mic,
  newsletter: Mail,
}

const STATUS_FLOW: DealStatus[] = [
  'negotiating',
  'contracted',
  'in_production',
  'live',
  'invoiced',
  'paid',
]

const NEXT_STATUS: Partial<Record<DealStatus, DealStatus>> = {
  negotiating: 'contracted',
  contracted: 'in_production',
  in_production: 'live',
  live: 'invoiced',
  invoiced: 'paid',
}

function StatusPipeline({ current }: { current: DealStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(current)
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STATUS_FLOW.map((status, i) => {
        const isPast = i < currentIndex
        const isCurrent = i === currentIndex
        const color = DEAL_STATUS_COLORS[status]
        return (
          <div key={status} className="flex items-center gap-1">
            <div
              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
              style={
                isCurrent
                  ? {
                      backgroundColor: `${color}20`,
                      color,
                      borderColor: `${color}60`,
                    }
                  : isPast
                  ? { backgroundColor: '#1A1A1A', color: '#444', borderColor: '#333' }
                  : { backgroundColor: 'transparent', color: '#555', borderColor: '#2A2A2A' }
              }
            >
              {status.replace('_', ' ')}
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface EditableFieldProps {
  label: string
  value: string
  onSave: (val: string) => void
  type?: 'text' | 'date' | 'number' | 'email' | 'url'
  placeholder?: string
  prefix?: string
}

function EditableField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  prefix,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 bg-[#0D0D0D] border-[#333] text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <button onClick={handleSave} className="text-brand hover:text-brand/80">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0.5 group cursor-pointer" onClick={() => setEditing(true)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-sm font-medium">
          {prefix && value ? `${prefix}${value}` : value || <span className="text-muted-foreground italic">Not set</span>}
        </p>
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [newDeliverable, setNewDeliverable] = useState('')
  const [addingDeliverable, setAddingDeliverable] = useState(false)

  const fetchDeal = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('deals').select('*').eq('id', id).single()
    if (data) setDeal(data as Deal)
    setIsLoading(false)
  }, [id])

  useEffect(() => {
    fetchDeal()
  }, [fetchDeal])

  const updateField = async (updates: Partial<Deal>) => {
    if (!deal) return
    // Optimistic
    setDeal((prev) => (prev ? { ...prev, ...updates } : prev))
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...deal, ...updates }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setDeal(data)
    } catch {
      toast.error('Failed to save')
      fetchDeal()
    }
  }

  const advanceStatus = async () => {
    if (!deal) return
    const next = NEXT_STATUS[deal.status]
    if (!next) return
    setIsAdvancing(true)
    await updateField({ status: next })
    setIsAdvancing(false)
    toast.success(`Moved to ${next.replace('_', ' ')}`)
  }

  const toggleDeliverable = async (delivId: string) => {
    if (!deal) return
    const updated = (deal.deliverables ?? []).map((d) =>
      d.id === delivId ? { ...d, completed: !d.completed } : d
    )
    await updateField({ deliverables: updated })
  }

  const addDeliverable = async () => {
    if (!deal || !newDeliverable.trim()) return
    const newItem: Deliverable = {
      id: crypto.randomUUID(),
      description: newDeliverable.trim(),
      completed: false,
    }
    await updateField({ deliverables: [...(deal.deliverables ?? []), newItem] })
    setNewDeliverable('')
    setAddingDeliverable(false)
  }

  const removeDeliverable = async (delivId: string) => {
    if (!deal) return
    await updateField({
      deliverables: (deal.deliverables ?? []).filter((d) => d.id !== delivId),
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground mb-4">Deal not found</p>
        <Button variant="outline" onClick={() => router.push('/deals')}>
          Back to Deals
        </Button>
      </div>
    )
  }

  const PlatformIcon = platformIcons[deal.platform]
  const nextStatus = NEXT_STATUS[deal.status]
  const completedDeliverables = (deal.deliverables ?? []).filter((d) => d.completed).length
  const totalDeliverables = (deal.deliverables ?? []).length

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-2">
        <Link
          href="/deals"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Deals
        </Link>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold truncate">{deal.brand_name}</h1>
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${DEAL_STATUS_COLORS[deal.status]}20`,
                color: DEAL_STATUS_COLORS[deal.status],
                borderColor: `${DEAL_STATUS_COLORS[deal.status]}40`,
              }}
              className="border capitalize flex-shrink-0"
            >
              {deal.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{deal.title}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {deal.status === 'live' && (
            <Link
              href={`/invoices?dealId=${deal.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-[#222222] hover:bg-[#1A1A1A] transition-colors"
            >
              <FileText className="h-4 w-4" />
              Create Invoice
            </Link>
          )}
          {nextStatus && (
            <Button size="sm" onClick={advanceStatus} disabled={isAdvancing}>
              {isAdvancing && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Move to {nextStatus.replace('_', ' ')}
            </Button>
          )}
        </div>
      </div>

      {/* Status pipeline */}
      <StatusPipeline current={deal.status} />

      <ApprovalLoopBanner deal={deal} onUpdate={updateField} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — deal info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Deal Details card */}
          <Card className="p-5 bg-[#111111] border-[#222222]">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Deal Details
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Platform</p>
                <div className="flex items-center gap-1.5">
                  <PlatformIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{PLATFORM_LABELS[deal.platform]}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Deal Type</p>
                <p className="text-sm font-medium">{DEAL_TYPE_LABELS[deal.deal_type]}</p>
              </div>
              <EditableField
                label="Amount"
                value={deal.amount?.toString() ?? ''}
                onSave={(v) => updateField({ amount: v ? Number(v) : null })}
                type="number"
                prefix="$"
              />
              <EditableField
                label="Currency"
                value={deal.currency ?? 'USD'}
                onSave={(v) => updateField({ currency: v })}
              />
            </div>

            <Separator className="my-4 bg-[#222222]" />

            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Key Dates</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <EditableField
                label="Deadline"
                value={deal.deadline ?? ''}
                onSave={(v) => updateField({ deadline: v || null })}
                type="date"
              />
              <EditableField
                label="Go-Live Date"
                value={deal.live_date ?? ''}
                onSave={(v) => updateField({ live_date: v || null })}
                type="date"
              />
              <EditableField
                label="Payment Due"
                value={deal.payment_due_date ?? ''}
                onSave={(v) => updateField({ payment_due_date: v || null })}
                type="date"
              />
              <EditableField
                label="Contract Date"
                value={deal.contract_date ?? ''}
                onSave={(v) => updateField({ contract_date: v || null })}
                type="date"
              />
            </div>
          </Card>

          {/* Brand Contact card */}
          <Card className="p-5 bg-[#111111] border-[#222222]">
            <h2 className="text-sm font-semibold mb-4">Brand Contact</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <EditableField
                label="Contact Name"
                value={deal.brand_contact_name ?? ''}
                onSave={(v) => updateField({ brand_contact_name: v || null })}
                placeholder="Jane Smith"
              />
              <EditableField
                label="Contact Email"
                value={deal.brand_contact_email ?? ''}
                onSave={(v) => updateField({ brand_contact_email: v || null })}
                type="email"
                placeholder="jane@brand.com"
              />
              <EditableField
                label="Brand Website"
                value={deal.brand_website ?? ''}
                onSave={(v) => updateField({ brand_website: v || null })}
                type="url"
                placeholder="https://brand.com"
              />
            </div>
            {deal.brand_website && (
              <a
                href={deal.brand_website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Visit website
              </a>
            )}
          </Card>

          <ExclusivitySection deal={deal} onUpdate={updateField} />

          {/* Notes card */}
          <Card className="p-5 bg-[#111111] border-[#222222]">
            <h2 className="text-sm font-semibold mb-3">Notes</h2>
            <textarea
              defaultValue={deal.notes ?? ''}
              placeholder="Add notes about this deal…"
              className="w-full min-h-[80px] text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
              onBlur={(e) => {
                const val = e.target.value
                if (val !== (deal.notes ?? '')) {
                  updateField({ notes: val || null })
                }
              }}
            />
          </Card>
        </div>

        {/* Right column — deliverables + meta */}
        <div className="space-y-4">
          {/* Deliverables */}
          <Card className="p-5 bg-[#111111] border-[#222222]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                Deliverables
              </h2>
              {totalDeliverables > 0 && (
                <span className="text-xs text-muted-foreground">
                  {completedDeliverables}/{totalDeliverables}
                </span>
              )}
            </div>

            {totalDeliverables > 0 && (
              <div className="w-full bg-[#222222] rounded-full h-1 mb-3">
                <div
                  className="bg-success h-1 rounded-full transition-all"
                  style={{ width: `${(completedDeliverables / totalDeliverables) * 100}%` }}
                />
              </div>
            )}

            <div className="space-y-2 mb-3">
              {(deal.deliverables ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No deliverables yet</p>
              ) : (
                (deal.deliverables ?? []).map((deliv) => (
                  <div
                    key={deliv.id}
                    className="flex items-start gap-2 group"
                  >
                    <button
                      onClick={() => toggleDeliverable(deliv.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {deliv.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <span
                      className={`text-sm flex-1 ${
                        deliv.completed ? 'text-muted-foreground line-through' : ''
                      }`}
                    >
                      {deliv.description}
                    </span>
                    <button
                      onClick={() => removeDeliverable(deliv.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-error"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {addingDeliverable ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="Deliverable description…"
                  className="h-7 text-xs bg-[#0D0D0D] border-[#333]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addDeliverable()
                    if (e.key === 'Escape') setAddingDeliverable(false)
                  }}
                />
                <button onClick={addDeliverable} className="text-brand">
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAddingDeliverable(false)}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingDeliverable(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add deliverable
              </button>
            )}
          </Card>

          {/* Deal meta */}
          <Card className="p-5 bg-[#111111] border-[#222222] space-y-3">
            <h2 className="text-sm font-semibold">Info</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(deal.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span>{formatDate(deal.updated_at)}</span>
              </div>
              {deal.deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{formatDate(deal.deadline)}</span>
                </div>
              )}
              {deal.amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deal value</span>
                  <span className="text-success font-medium">
                    {formatCurrency(deal.amount, deal.currency)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          {deal.description && (
            <Card className="p-5 bg-[#111111] border-[#222222]">
              <h2 className="text-sm font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {deal.description}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
