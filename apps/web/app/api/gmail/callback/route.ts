import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptToken } from '@/lib/gmail/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      new URL('/dashboard?gmail=error&reason=oauth_denied', request.url)
    )
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL('/dashboard?gmail=error&reason=token_exchange', request.url)
    )
  }

  const tokens = await tokenRes.json()
  const { access_token, refresh_token, expires_in } = tokens

  if (!access_token || !refresh_token) {
    return NextResponse.redirect(
      new URL('/dashboard?gmail=error&reason=missing_tokens', request.url)
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const expiry = new Date(Date.now() + expires_in * 1000).toISOString()

  const { error: dbError } = await supabase
    .from('profiles')
    .update({
      gmail_connected: true,
      gmail_access_token: encryptToken(access_token),
      gmail_refresh_token: encryptToken(refresh_token),
      gmail_token_expiry: expiry,
    })
    .eq('id', user.id)

  if (dbError) {
    return NextResponse.redirect(
      new URL('/dashboard?gmail=error&reason=db_error', request.url)
    )
  }

  return NextResponse.redirect(new URL('/dashboard?gmail=connected', request.url))
}
