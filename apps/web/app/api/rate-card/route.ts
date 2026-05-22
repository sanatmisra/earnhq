import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const rateCardSchema = z.object({
  platform: z.enum(['youtube', 'instagram', 'tiktok', 'podcast', 'newsletter']),
  deal_type: z.enum(['integration', 'dedicated', 'ugc', 'affiliate', 'event']),
  name: z.string().trim().min(1),
  base_rate: z.number().positive(),
  currency: z.enum(['USD', 'GBP', 'EUR']).default('USD'),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  includes: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('rate_card')
    .select('*')
    .eq('user_id', user.id)
    .order('platform')
    .order('deal_type')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = rateCardSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('rate_card')
    .insert({ ...parsed.data, user_id: user.id })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
