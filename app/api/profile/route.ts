import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, gmail_access_token, gmail_token_expiry')
    .eq('id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id: data.id,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    gmail_connected: !!(data.gmail_access_token),
    gmail_token_expiry: data.gmail_token_expiry,
  })
}
