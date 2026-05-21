import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { generateInvoiceNumber } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

const createInvoiceSchema = z.object({
  deal_id: z.string().uuid().nullable().optional(),
  client_name: z.string().trim().min(1, 'Client name is required'),
  client_email: z.union([z.string().trim().email(), z.literal('')]).optional(),
  client_address: z.string().trim().optional(),
  description: z.string().trim().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  currency: z.enum(['USD', 'GBP', 'EUR']).default('USD'),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  payment_notes: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = createInvoiceSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid invoice payload' },
      { status: 400 }
    )
  }

  const invoice = parsed.data
  const { count, error: countError } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      deal_id: invoice.deal_id ?? null,
      invoice_number: generateInvoiceNumber(count ?? 0),
      client_name: invoice.client_name,
      client_email: invoice.client_email || null,
      client_address: invoice.client_address || null,
      subtotal: invoice.amount,
      total: invoice.amount,
      currency: invoice.currency,
      line_items: [
        {
          id: crypto.randomUUID(),
          description: invoice.description,
          quantity: 1,
          unitPrice: invoice.amount,
          total: invoice.amount,
        },
      ],
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      payment_notes: invoice.payment_notes || null,
      notes: invoice.notes || null,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
