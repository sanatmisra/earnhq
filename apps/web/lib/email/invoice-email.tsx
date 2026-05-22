import * as React from 'react'
import { formatCurrency, formatDate } from '@earnhq/utils'

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
