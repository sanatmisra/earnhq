import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, creator_type } = body as { email?: string; creator_type?: string }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      return Response.json({ success: true, position: count ?? 1 })
    }

    const { error: insertError } = await supabase.from('waitlist').insert({
      email: email.toLowerCase(),
      creator_type: creator_type ?? null,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        const { count } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
        return Response.json({ success: true, position: count ?? 1 })
      }
      console.error('Waitlist insert error:', insertError)
      return Response.json({ error: 'Failed to join waitlist' }, { status: 500 })
    }

    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const position = count ?? 1

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'EarnHQ <onboarding@resend.dev>',
      to: email,
      subject: "You're on the EarnHQ waitlist 🎉",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#111;">
          <h2 style="font-size:24px;font-weight:800;margin-bottom:8px;">You're #${position} on the waitlist.</h2>
          <p style="color:#555;margin-bottom:24px;">We're building the brand deal command center creators actually deserve.</p>
          <p style="margin-bottom:24px;">When we're ready, you'll be first to know.</p>
          <p style="margin-bottom:8px;">In the meantime, follow our build journey on Twitter: <a href="https://x.com/earnhq" style="color:#6366F1;">@earnhq</a></p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
          <p style="color:#999;font-size:13px;">— The EarnHQ team</p>
        </div>
      `,
    })

    return Response.json({ success: true, position })
  } catch (err) {
    console.error('Waitlist error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
