import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decryptToken, refreshAccessToken } from '@/lib/gmail/auth'
import { fetchSponsorshipThreads } from '@/lib/gmail/fetch'
import { parseThreadWithLLM } from '@/lib/gmail/parser'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get stored Gmail tokens
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('gmail_connected, gmail_access_token, gmail_refresh_token, gmail_token_expiry')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (!profile.gmail_connected || !profile.gmail_access_token || !profile.gmail_refresh_token) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 })
  }

  let accessToken = decryptToken(profile.gmail_access_token)
  const refreshToken = decryptToken(profile.gmail_refresh_token)

  // Refresh token if expired or expiring within 5 minutes
  const expiry = profile.gmail_token_expiry ? new Date(profile.gmail_token_expiry) : new Date(0)
  const expiresIn = expiry.getTime() - Date.now()

  if (expiresIn < 5 * 60 * 1000) {
    try {
      const refreshed = await refreshAccessToken(refreshToken)
      accessToken = refreshed.access_token

      await supabase
        .from('profiles')
        .update({
          gmail_access_token: profile.gmail_access_token
            ? (await import('@/lib/gmail/auth')).encryptToken(refreshed.access_token)
            : null,
          gmail_token_expiry: refreshed.expiry.toISOString(),
        })
        .eq('id', user.id)
    } catch {
      await supabase
        .from('profiles')
        .update({ gmail_connected: false })
        .eq('id', user.id)
      return NextResponse.json(
        { error: 'Gmail session expired. Please reconnect.' },
        { status: 401 }
      )
    }
  }

  // Fetch threads
  let threads
  try {
    threads = await fetchSponsorshipThreads(accessToken)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg === 'GMAIL_UNAUTHORIZED') {
      await supabase.from('profiles').update({ gmail_connected: false }).eq('id', user.id)
      return NextResponse.json(
        { error: 'Gmail access revoked. Please reconnect.' },
        { status: 401 }
      )
    }
    return NextResponse.json({ error: 'Failed to fetch Gmail threads' }, { status: 500 })
  }

  // Parse each thread with LLM (100ms delay between calls)
  const parsed = []
  let skipped = 0

  for (const thread of threads) {
    await new Promise((r) => setTimeout(r, 100))
    const result = await parseThreadWithLLM(thread)
    if (result) {
      parsed.push(result)
    } else {
      skipped++
    }
  }

  return NextResponse.json({
    data: {
      parsed,
      skipped,
      total_scanned: threads.length,
    },
    error: null,
  })
}
