import * as React from 'react'
import { formatCurrency, formatDate } from '@earnhq/utils'

interface EmailParams {
  invoiceNumber: string
  creatorName: string
  clientName: string
  amount: number
  currency: string
  dueDate: string | null
  pdfUrl: string
}

export function buildInvoiceEmailHtml(p: EmailParams): string {
  const amountStr = formatCurrency(p.amount, p.currency)
  const dueDateStr = p.dueDate ? formatDate(p.dueDate) : null
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${p.invoiceNumber}</title></head>
<body style="background:#0A0A0A;font-family:Arial,sans-serif;margin:0;padding:0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;border:1px solid #222222">
<tr><td style="padding:32px 40px 0;text-align:center"><p style="margin:0;font-size:28px;font-weight:700;color:#6366F1;letter-spacing:2px">EarnHQ</p></td></tr>
<tr><td style="padding:32px 40px">
<p style="margin:0 0 16px;color:#FAFAFA;font-size:16px">Hi ${p.clientName},</p>
<p style="margin:0 0 24px;color:#A1A1AA;font-size:14px;line-height:1.6">Please find attached the invoice for our recent collaboration.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;border-radius:8px;margin-bottom:32px">
<tr><td style="padding:24px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="color:#71717A;font-size:13px;padding-bottom:12px">Invoice</td><td align="right" style="color:#FAFAFA;font-size:13px;font-weight:600;padding-bottom:12px">${p.invoiceNumber}</td></tr>
<tr><td style="color:#71717A;font-size:13px;padding-bottom:12px">Amount</td><td align="right" style="color:#22C55E;font-size:16px;font-weight:700;padding-bottom:12px">${amountStr}</td></tr>
${dueDateStr ? `<tr><td style="color:#71717A;font-size:13px">Due Date</td><td align="right" style="color:#FAFAFA;font-size:13px">${dueDateStr}</td></tr>` : ''}
</table></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
<tr><td align="center"><a href="${p.pdfUrl}" style="display:inline-block;background:#6366F1;color:#FFFFFF;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none">View Invoice PDF</a></td></tr>
</table>
<p style="margin:0 0 8px;color:#A1A1AA;font-size:13px;line-height:1.6">Please don't hesitate to reach out if you have any questions.</p>
<p style="margin:0;color:#A1A1AA;font-size:13px">Looking forward to working together again!</p>
</td></tr>
<tr><td style="padding:0 40px 32px"><p style="margin:0;color:#FAFAFA;font-size:14px;font-weight:600">${p.creatorName}</p></td></tr>
<tr><td style="padding:20px 40px;border-top:1px solid #222222;text-align:center"><p style="margin:0;color:#71717A;font-size:11px">Sent via EarnHQ — your brand deal command center</p></td></tr>
</table></td></tr></table>
</body></html>`
}

export function buildReminderEmailHtml(p: EmailParams): string {
  const amountStr = formatCurrency(p.amount, p.currency)
  const isOverdue = p.dueDate ? new Date(p.dueDate) < new Date() : false
  const dueDateStr = p.dueDate ? formatDate(p.dueDate) : null
  const amountColor = isOverdue ? '#EF4444' : '#F59E0B'
  const intro = isOverdue
    ? `This is a gentle reminder that invoice ${p.invoiceNumber} is now past due.`
    : `Just a friendly reminder that invoice ${p.invoiceNumber} is coming up for payment.`
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reminder: Invoice ${p.invoiceNumber}</title></head>
<body style="background:#0A0A0A;font-family:Arial,sans-serif;margin:0;padding:0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;border:1px solid #222222">
<tr><td style="padding:32px 40px 0;text-align:center"><p style="margin:0;font-size:28px;font-weight:700;color:#6366F1;letter-spacing:2px">EarnHQ</p></td></tr>
<tr><td style="padding:32px 40px">
<p style="margin:0 0 16px;color:#FAFAFA;font-size:16px">Hi ${p.clientName},</p>
<p style="margin:0 0 24px;color:#A1A1AA;font-size:14px;line-height:1.6">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;border-radius:8px;margin-bottom:32px">
<tr><td style="padding:24px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="color:#71717A;font-size:13px;padding-bottom:12px">Invoice</td><td align="right" style="color:#FAFAFA;font-size:13px;font-weight:600;padding-bottom:12px">${p.invoiceNumber}</td></tr>
<tr><td style="color:#71717A;font-size:13px;padding-bottom:12px">Amount</td><td align="right" style="color:${amountColor};font-size:16px;font-weight:700;padding-bottom:12px">${amountStr}</td></tr>
${dueDateStr ? `<tr><td style="color:#71717A;font-size:13px">${isOverdue ? 'Was Due' : 'Due Date'}</td><td align="right" style="color:${isOverdue ? '#EF4444' : '#FAFAFA'};font-size:13px">${dueDateStr}</td></tr>` : ''}
</table></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
<tr><td align="center"><a href="${p.pdfUrl}" style="display:inline-block;background:#6366F1;color:#FFFFFF;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none">View Invoice</a></td></tr>
</table>
<p style="margin:0;color:#A1A1AA;font-size:13px;line-height:1.6">Please don't hesitate to reach out if you have any questions. Thank you!</p>
</td></tr>
<tr><td style="padding:0 40px 32px"><p style="margin:0;color:#FAFAFA;font-size:14px;font-weight:600">${p.creatorName}</p></td></tr>
<tr><td style="padding:20px 40px;border-top:1px solid #222222;text-align:center"><p style="margin:0;color:#71717A;font-size:11px">Sent via EarnHQ — your brand deal command center</p></td></tr>
</table></td></tr></table>
</body></html>`
}

interface InvoiceEmailProps {
  invoiceNumber: string
  creatorName: string
  clientName: string
  amount: number
  currency: string
  dueDate: string | null
  pdfUrl: string
}

export function InvoiceEmail({
  invoiceNumber,
  creatorName,
  clientName,
  amount,
  currency,
  dueDate,
  pdfUrl,
}: InvoiceEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Invoice ${invoiceNumber} from ${creatorName}`}</title>
      </head>
      <body style={{ backgroundColor: '#0A0A0A', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#0A0A0A', padding: '40px 20px' }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#111111', borderRadius: 12, border: '1px solid #222222' }}>
                {/* Header */}
                <tr>
                  <td style={{ padding: '32px 40px 0', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#6366F1', letterSpacing: 2 }}>EarnHQ</p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '32px 40px' }}>
                    <p style={{ margin: '0 0 16px', color: '#FAFAFA', fontSize: 16 }}>
                      Hi {clientName},
                    </p>
                    <p style={{ margin: '0 0 24px', color: '#A1A1AA', fontSize: 14, lineHeight: 1.6 }}>
                      Please find attached the invoice for our recent collaboration.
                    </p>

                    {/* Invoice details box */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#0A0A0A', borderRadius: 8, marginBottom: 32 }}>
                      <tr>
                        <td style={{ padding: 24 }}>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tr>
                              <td style={{ color: '#71717A', fontSize: 13, paddingBottom: 12 }}>Invoice</td>
                              <td align="right" style={{ color: '#FAFAFA', fontSize: 13, fontWeight: 600, paddingBottom: 12 }}>{invoiceNumber}</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#71717A', fontSize: 13, paddingBottom: 12 }}>Amount</td>
                              <td align="right" style={{ color: '#22C55E', fontSize: 16, fontWeight: 700, paddingBottom: 12 }}>{formatCurrency(amount, currency)}</td>
                            </tr>
                            {dueDate && (
                              <tr>
                                <td style={{ color: '#71717A', fontSize: 13 }}>Due Date</td>
                                <td align="right" style={{ color: '#FAFAFA', fontSize: 13 }}>{formatDate(dueDate)}</td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* CTA Button */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 32 }}>
                      <tr>
                        <td align="center">
                          <a
                            href={pdfUrl}
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#6366F1',
                              color: '#FFFFFF',
                              fontSize: 14,
                              fontWeight: 600,
                              padding: '14px 32px',
                              borderRadius: 8,
                              textDecoration: 'none',
                            }}
                          >
                            View Invoice PDF
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style={{ margin: '0 0 8px', color: '#A1A1AA', fontSize: 13, lineHeight: 1.6 }}>
                      Please don&apos;t hesitate to reach out if you have any questions about this invoice.
                    </p>
                    <p style={{ margin: 0, color: '#A1A1AA', fontSize: 13 }}>
                      Looking forward to working together again!
                    </p>
                  </td>
                </tr>

                {/* Signature */}
                <tr>
                  <td style={{ padding: '0 40px 32px' }}>
                    <p style={{ margin: 0, color: '#FAFAFA', fontSize: 14, fontWeight: 600 }}>{creatorName}</p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: '20px 40px', borderTop: '1px solid #222222', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#71717A', fontSize: 11 }}>
                      Sent via EarnHQ — your brand deal command center
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

export function ReminderEmail({
  invoiceNumber,
  creatorName,
  clientName,
  amount,
  currency,
  dueDate,
  pdfUrl,
}: InvoiceEmailProps) {
  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Reminder: Invoice ${invoiceNumber}`}</title>
      </head>
      <body style={{ backgroundColor: '#0A0A0A', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#0A0A0A', padding: '40px 20px' }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#111111', borderRadius: 12, border: '1px solid #222222' }}>
                <tr>
                  <td style={{ padding: '32px 40px 0', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#6366F1', letterSpacing: 2 }}>EarnHQ</p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '32px 40px' }}>
                    <p style={{ margin: '0 0 16px', color: '#FAFAFA', fontSize: 16 }}>Hi {clientName},</p>
                    <p style={{ margin: '0 0 24px', color: '#A1A1AA', fontSize: 14, lineHeight: 1.6 }}>
                      {isOverdue
                        ? `This is a gentle reminder that invoice ${invoiceNumber} is now past due.`
                        : `Just a friendly reminder that invoice ${invoiceNumber} is coming up for payment.`}
                    </p>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#0A0A0A', borderRadius: 8, marginBottom: 32 }}>
                      <tr>
                        <td style={{ padding: 24 }}>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tr>
                              <td style={{ color: '#71717A', fontSize: 13, paddingBottom: 12 }}>Invoice</td>
                              <td align="right" style={{ color: '#FAFAFA', fontSize: 13, fontWeight: 600, paddingBottom: 12 }}>{invoiceNumber}</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#71717A', fontSize: 13, paddingBottom: 12 }}>Amount</td>
                              <td align="right" style={{ color: isOverdue ? '#EF4444' : '#F59E0B', fontSize: 16, fontWeight: 700, paddingBottom: 12 }}>{formatCurrency(amount, currency)}</td>
                            </tr>
                            {dueDate && (
                              <tr>
                                <td style={{ color: '#71717A', fontSize: 13 }}>{isOverdue ? 'Was Due' : 'Due Date'}</td>
                                <td align="right" style={{ color: isOverdue ? '#EF4444' : '#FAFAFA', fontSize: 13 }}>{formatDate(dueDate)}</td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 32 }}>
                      <tr>
                        <td align="center">
                          <a href={pdfUrl} style={{ display: 'inline-block', backgroundColor: '#6366F1', color: '#FFFFFF', fontSize: 14, fontWeight: 600, padding: '14px 32px', borderRadius: 8, textDecoration: 'none' }}>
                            View Invoice
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style={{ margin: 0, color: '#A1A1AA', fontSize: 13, lineHeight: 1.6 }}>
                      Please don&apos;t hesitate to reach out if you have any questions. Thank you!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 40px 32px' }}>
                    <p style={{ margin: 0, color: '#FAFAFA', fontSize: 14, fontWeight: 600 }}>{creatorName}</p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '20px 40px', borderTop: '1px solid #222222', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#71717A', fontSize: 11 }}>Sent via EarnHQ — your brand deal command center</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
