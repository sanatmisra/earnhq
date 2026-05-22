import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require('@react-pdf/renderer') as { renderToBuffer: (el: unknown) => Promise<Buffer> }
import { Resend } from 'resend'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
// createElement is used for InvoicePDF (react-pdf)
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { InvoicePDF } from '@/components/invoices/InvoicePDF'
import { buildInvoiceEmailHtml } from '@/lib/email/invoice-email'
import type { Invoice, Profile } from '@earnhq/types'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch invoice
  const { data: invoiceData, error: invoiceErr } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (invoiceErr || !invoiceData) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  const invoice = invoiceData as Invoice

  if (!invoice.client_email) {
    return NextResponse.json({ error: 'Invoice has no recipient email' }, { status: 422 })
  }

  // Fetch creator profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, email, company_name, address, city, state, zip, country')
    .eq('id', user.id)
    .single()

  const profile = (profileData ?? {
    full_name: user.email ?? '',
    email: user.email ?? '',
    company_name: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    country: '',
  }) as Pick<Profile, 'full_name' | 'email' | 'company_name' | 'address' | 'city' | 'state' | 'zip' | 'country'>

  // Generate PDF buffer
  const pdfBuffer = await renderToBuffer(
    createElement(InvoicePDF, { invoice, profile })
  )

  // Upload to Supabase Storage (service role to bypass RLS)
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileName = `${user.id}/${invoice.invoice_number}.pdf`
  const { error: uploadError } = await admin.storage
    .from('invoices')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage.from('invoices').getPublicUrl(fileName)

  // Send email via Resend
  const creatorName = profile.company_name ?? profile.full_name ?? profile.email ?? 'Creator'
  const { error: emailError } = await resend.emails.send({
    from: `${creatorName} via EarnHQ <invoices@earnhq.com>`,
    to: [invoice.client_email],
    subject: `Invoice ${invoice.invoice_number} from ${creatorName} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.total)}`,
    html: buildInvoiceEmailHtml({
      invoiceNumber: invoice.invoice_number,
      creatorName,
      clientName: invoice.client_name,
      amount: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.due_date,
      pdfUrl: publicUrl,
    }),
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        content: Buffer.from(pdfBuffer).toString('base64'),
      },
    ],
  })

  if (emailError) {
    return NextResponse.json({ error: `Email send failed: ${emailError.message}` }, { status: 500 })
  }

  // Update invoice: status → sent, pdf_url, sent_at
  const { data: updated, error: updateErr } = await supabase
    .from('invoices')
    .update({
      status: 'sent',
      pdf_url: publicUrl,
      sent_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, pdf_url: publicUrl, invoice: updated })
}
