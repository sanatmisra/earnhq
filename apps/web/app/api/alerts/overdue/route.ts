import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date().toISOString().split('T')[0]

  // Find all invoices that are past due and not yet marked overdue/paid/cancelled
  const { data: overdueInvoices, error: fetchErr } = await admin
    .from('invoices')
    .select('id, invoice_number, client_name, total, currency, due_date, user_id')
    .lt('due_date', today)
    .in('status', ['sent', 'draft'])

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  if (!overdueInvoices || overdueInvoices.length === 0) {
    return NextResponse.json({ updated: 0, notified: 0 })
  }

  // Bulk update to 'overdue'
  const ids = overdueInvoices.map((i: { id: string }) => i.id)
  const { error: updateErr } = await admin
    .from('invoices')
    .update({ status: 'overdue' })
    .in('id', ids)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Group by user to send one digest email per creator
  const byUser = overdueInvoices.reduce<Record<string, typeof overdueInvoices>>((acc, inv) => {
    ;(acc[inv.user_id] ??= []).push(inv)
    return acc
  }, {})

  let notified = 0
  const errors: string[] = []

  for (const [userId, userInvoices] of Object.entries(byUser)) {
    // Get creator email
    const { data: profile } = await admin
      .from('profiles')
      .select('email, full_name, company_name')
      .eq('id', userId)
      .single()

    if (!profile?.email) continue

    const creatorName = profile.company_name ?? profile.full_name ?? profile.email
    const total = userInvoices.reduce((s: number, i: { total: number }) => s + i.total, 0)

    const invoiceList = userInvoices
      .map((i: { invoice_number: string; client_name: string; total: number; currency: string; due_date: string }) => {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(i.due_date).getTime()) / (1000 * 60 * 60 * 24)
        )
        return `• ${i.client_name} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: i.currency }).format(i.total)} (${i.invoice_number}, ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue)`
      })
      .join('\n')

    const { error: emailErr } = await resend.emails.send({
      from: 'EarnHQ Alerts <alerts@earnhq.com>',
      to: [profile.email],
      subject: `⚠️ ${userInvoices.length} overdue invoice${userInvoices.length > 1 ? 's' : ''} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)} outstanding`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 40px; border-radius: 8px; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #6366F1; margin-top: 0;">Payment Alert</h2>
          <p>Hi ${creatorName},</p>
          <p>You have <strong>${userInvoices.length} overdue invoice${userInvoices.length > 1 ? 's' : ''}</strong> that need your attention:</p>
          <pre style="background: #111111; border: 1px solid #222222; border-radius: 6px; padding: 16px; color: #EF4444; font-size: 13px; line-height: 1.8;">${invoiceList}</pre>
          <p style="color: #A1A1AA; font-size: 13px;">Log into EarnHQ to send reminders or mark these as paid.</p>
          <p style="color: #71717A; font-size: 11px;">EarnHQ — your brand deal command center</p>
        </div>
      `,
    })

    if (emailErr) {
      errors.push(`${userId}: ${emailErr.message}`)
    } else {
      notified++
    }
  }

  return NextResponse.json({
    updated: ids.length,
    notified,
    errors: errors.length > 0 ? errors : undefined,
  })
}
