'use client'

import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import type { RateCard, Platform, DealType } from '@/types'
import { PLATFORM_LABELS, DEAL_TYPE_LABELS } from '@/types'
import { toast } from 'sonner'

const PLATFORMS: Platform[] = ['youtube', 'instagram', 'tiktok', 'podcast', 'newsletter']
const DEAL_TYPES: DealType[] = ['integration', 'dedicated', 'ugc', 'affiliate', 'event']

interface RateCardFormData {
  platform: Platform
  deal_type: DealType
  name: string
  base_rate: string
  currency: string
  description: string
  notes: string
}

const DEFAULT_FORM: RateCardFormData = {
  platform: 'youtube',
  deal_type: 'integration',
  name: '',
  base_rate: '',
  currency: 'USD',
  description: '',
  notes: '',
}

function RateCardFormDialog({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: Partial<RateCard> | null
  onClose: () => void
  onSaved: (card: RateCard) => void
}) {
  const [form, setForm] = useState<RateCardFormData>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        platform: initial.platform ?? 'youtube',
        deal_type: initial.deal_type ?? 'integration',
        name: initial.name ?? '',
        base_rate: initial.base_rate != null ? String(initial.base_rate) : '',
        currency: initial.currency ?? 'USD',
        description: initial.description ?? '',
        notes: initial.notes ?? '',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [initial, open])

  function set(key: keyof RateCardFormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    if (!form.name.trim() || !form.base_rate) {
      toast.error('Name and rate are required')
      return
    }
    setSaving(true)
    try {
      const body = {
        platform: form.platform,
        deal_type: form.deal_type,
        name: form.name.trim(),
        base_rate: parseFloat(form.base_rate),
        currency: form.currency,
        description: form.description.trim() || null,
        notes: form.notes.trim() || null,
        includes: [],
        is_active: true,
      }

      const url = initial?.id ? `/api/rate-card/${initial.id}` : '/api/rate-card'
      const method = initial?.id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save')
      const saved: RateCard = await res.json()
      onSaved(saved)
      toast.success(initial?.id ? 'Rate updated' : 'Rate added')
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg border-[#222222] bg-[#111111]">
        <DialogHeader>
          <DialogTitle>{initial?.id ? 'Edit Rate' : 'Add Rate'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => v && set('platform', v)}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Content Type</Label>
              <Select value={form.deal_type} onValueChange={v => v && set('deal_type', v)}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map(t => <SelectItem key={t} value={t}>{DEAL_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Rate Name</Label>
            <Input
              placeholder="e.g. YouTube Integration — Standard"
              className="bg-[#0A0A0A] border-[#222222]"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Base Rate</Label>
              <Input
                type="number"
                placeholder="5000"
                className="bg-[#0A0A0A] border-[#222222]"
                value={form.base_rate}
                onChange={e => set('base_rate', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={v => v && set('currency', v)}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="What's included at this rate?"
              className="bg-[#0A0A0A] border-[#222222]"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              placeholder="Any caveats or conditions"
              className="bg-[#0A0A0A] border-[#222222]"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="border-[#222222]" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : initial?.id ? 'Save Changes' : 'Add Rate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RateCardPage() {
  const [rates, setRates] = useState<RateCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<RateCard> | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/rate-card')
      if (res.ok) {
        const json = await res.json()
        setRates(json.data ?? [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchRates() }, [fetchRates])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(card: RateCard) {
    setEditing(card)
    setDialogOpen(true)
  }

  async function deleteRate(id: string) {
    if (!confirm('Delete this rate?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/rate-card/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error)
      setRates(prev => prev.filter(r => r.id !== id))
      toast.success('Rate deleted')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  function onSaved(saved: RateCard) {
    setRates(prev => {
      const exists = prev.find(r => r.id === saved.id)
      return exists ? prev.map(r => r.id === saved.id ? saved : r) : [saved, ...prev]
    })
  }

  // Group by platform
  const byPlatform = rates.reduce<Record<string, RateCard[]>>((acc, r) => {
    const key = r.platform
    ;(acc[key] ??= []).push(r)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rate Card</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your standard rates per platform and content type. Used to flag below-rate deals.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Rate
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      ) : rates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-[#222222] bg-[#111111] p-16 text-center">
          <p className="font-medium">No rates yet</p>
          <p className="text-sm text-muted-foreground">Add your standard rates to get deal warnings when you&apos;re being underpaid.</p>
          <Button onClick={openAdd} className="mt-2"><Plus className="h-4 w-4" /> Add your first rate</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {PLATFORMS.filter(p => byPlatform[p]?.length).map(platform => (
            <section key={platform}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {PLATFORM_LABELS[platform]}
              </h2>
              <div className="overflow-hidden rounded-lg border border-[#222222]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#222222] bg-[#0D0D0D]">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Content Type</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Base Rate</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {byPlatform[platform]!.map(card => (
                      <tr key={card.id} className="border-b border-[#222222] last:border-0 hover:bg-[#111111]">
                        <td className="px-4 py-3">
                          <div className="font-medium">{card.name}</div>
                          {card.description && (
                            <div className="text-xs text-muted-foreground">{card.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="border border-[#222222] capitalize text-xs">
                            {DEAL_TYPE_LABELS[card.deal_type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#22C55E]">
                          {formatCurrency(card.base_rate, card.currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => openEdit(card)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-[#EF4444]"
                              disabled={deleting === card.id}
                              onClick={() => deleteRate(card.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      <RateCardFormDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSaved={onSaved}
      />
    </div>
  )
}
