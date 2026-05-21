'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'
import type { Deal, Platform, DealType, DealStatus } from '@/types'

const dealSchema = z.object({
  brand_name: z.string().min(1, 'Brand name is required'),
  title: z.string().optional(),
  platform: z.enum(['youtube', 'instagram', 'tiktok', 'podcast', 'newsletter']),
  deal_type: z.enum(['integration', 'dedicated', 'ugc', 'affiliate', 'event']),
  amount: z.coerce.number().min(0).optional(),
  currency: z.string().optional(),
  status: z.enum(['negotiating', 'contracted', 'in_production', 'live', 'invoiced', 'paid', 'cancelled']).optional(),
  description: z.string().optional(),
  deadline: z.string().optional(),
  live_date: z.string().optional(),
  payment_due_date: z.string().optional(),
  notes: z.string().optional(),
})

type DealFormData = z.infer<typeof dealSchema>

interface NewDealModalProps {
  onDealCreated?: (deal: Deal) => void
}

export function NewDealModal({ onDealCreated }: NewDealModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DealFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(dealSchema) as any,
    defaultValues: {
      platform: 'youtube',
      deal_type: 'integration',
      status: 'negotiating',
      currency: 'USD',
    },
  })

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Failed to create deal')
      }

      const deal = await res.json()
      toast.success('Deal created successfully')
      onDealCreated?.(deal)
      setOpen(false)
      reset()
    } catch {
      toast.error('Failed to create deal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">New Deal</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#111111] border-[#222222]">
        <DialogHeader>
          <DialogTitle>New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              {...register('brand_name')}
              placeholder="e.g., Nike, Samsung"
              className="bg-[#0D0D0D] border-[#222222]"
            />
            {errors.brand_name && (
              <p className="text-xs text-error">{errors.brand_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Deal Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Q1 Integration Campaign"
              className="bg-[#0D0D0D] border-[#222222]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select
                defaultValue="youtube"
                onValueChange={(value) => setValue('platform', value as Platform)}
              >
                <SelectTrigger className="bg-[#0D0D0D] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deal Type *</Label>
              <Select
                defaultValue="integration"
                onValueChange={(value) => setValue('deal_type', value as DealType)}
              >
                <SelectTrigger className="bg-[#0D0D0D] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="dedicated">Dedicated</SelectItem>
                  <SelectItem value="ugc">UGC</SelectItem>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount')}
                placeholder="0.00"
                className="bg-[#0D0D0D] border-[#222222]"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue="negotiating"
                onValueChange={(value) => setValue('status', value as DealStatus)}
              >
                <SelectTrigger className="bg-[#0D0D0D] border-[#222222]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="contracted">Contracted</SelectItem>
                  <SelectItem value="in_production">In Production</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="invoiced">Invoiced</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deliverable Description</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Describe the deliverables..."
              className="w-full min-h-[80px] rounded-md bg-[#0D0D0D] border border-[#222222] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline')}
                className="bg-[#0D0D0D] border-[#222222]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live_date">Go-Live Date</Label>
              <Input
                id="live_date"
                type="date"
                {...register('live_date')}
                className="bg-[#0D0D0D] border-[#222222]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_due_date">Payment Due</Label>
              <Input
                id="payment_due_date"
                type="date"
                {...register('payment_due_date')}
                className="bg-[#0D0D0D] border-[#222222]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Any additional notes..."
              className="w-full min-h-[60px] rounded-md bg-[#0D0D0D] border border-[#222222] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#222222]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
