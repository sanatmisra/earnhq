'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
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
import type { Invoice } from '@/types'
import { toast } from 'sonner'

const invoiceSchema = z.object({
  client_name: z.string().trim().min(1, 'Brand name is required'),
  client_email: z.union([z.string().trim().email('Enter a valid email'), z.literal('')]),
  description: z.string().trim().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  currency: z.enum(['USD', 'GBP', 'EUR']),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  payment_notes: z.string().optional(),
  notes: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
  onCreated?: (invoice: Invoice) => void
}

export function InvoiceForm({ onCreated }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = useMemo(() => new Date(), [])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      client_email: '',
      currency: 'USD',
      issue_date: format(today, 'yyyy-MM-dd'),
      due_date: format(addDays(today, 30), 'yyyy-MM-dd'),
      payment_notes: '',
      notes: '',
    },
  })

  const onSubmit = async (invoice: InvoiceFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error ?? 'Failed to create invoice')
      }

      const createdInvoice = await response.json()
      toast.success('Draft invoice created')
      onCreated?.(createdInvoice)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Brand Name" error={errors.client_name?.message}>
          <Input
            {...register('client_name')}
            placeholder="e.g., Nike"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
        <Field label="Brand Contact Email" error={errors.client_email?.message}>
          <Input
            {...register('client_email')}
            type="email"
            placeholder="brand@example.com"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          placeholder="YouTube integration for the May campaign"
          className="min-h-24 w-full rounded-md border border-[#222222] bg-[#0D0D0D] px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Amount" error={errors.amount?.message}>
          <Input
            {...register('amount')}
            min="0"
            step="0.01"
            type="number"
            placeholder="2500.00"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
        <Field label="Currency">
          <Select
            defaultValue="USD"
            onValueChange={(value) => setValue('currency', value as InvoiceFormData['currency'])}
          >
            <SelectTrigger className="w-full bg-[#0D0D0D] border-[#222222]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Payment Instructions">
          <Input
            {...register('payment_notes')}
            placeholder="Wise, PayPal, or bank details"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Issue Date" error={errors.issue_date?.message}>
          <Input
            {...register('issue_date')}
            type="date"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
        <Field label="Due Date" error={errors.due_date?.message}>
          <Input
            {...register('due_date')}
            type="date"
            className="bg-[#0D0D0D] border-[#222222]"
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          {...register('notes')}
          placeholder="Optional notes for this invoice"
          className="min-h-20 w-full rounded-md border border-[#222222] bg-[#0D0D0D] px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </Field>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Draft
        </Button>
      </div>
    </form>
  )
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode
  error?: string
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
