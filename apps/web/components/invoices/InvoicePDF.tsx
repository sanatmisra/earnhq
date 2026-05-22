import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { Invoice, Profile } from '@earnhq/types'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 600 },
  ],
})

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 10, color: '#111111', backgroundColor: '#FFFFFF', padding: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  headerLeft: { flex: 1 },
  invoiceLabel: { fontSize: 28, fontWeight: 600, color: '#6366F1', letterSpacing: 2 },
  invoiceNumber: { fontSize: 11, color: '#71717A', marginTop: 4 },
  addressSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  addressBlock: { flex: 1 },
  addressLabel: { fontSize: 8, color: '#71717A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  addressName: { fontSize: 11, fontWeight: 600, marginBottom: 3 },
  addressDetail: { color: '#555555', lineHeight: 1.6 },
  datesRow: { flexDirection: 'row', gap: 40, marginBottom: 32 },
  dateBlock: {},
  dateLabel: { fontSize: 8, color: '#71717A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  dateValue: { fontSize: 11 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 12 },
  tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableHeaderText: { fontSize: 8, color: '#71717A', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: 'center' },
  colRate: { width: 80, textAlign: 'right' },
  colAmount: { width: 80, textAlign: 'right' },
  totalsSection: { marginTop: 16, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 32, marginBottom: 4 },
  totalLabel: { color: '#71717A' },
  totalValue: {},
  grandTotalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 32, marginTop: 8, paddingTop: 8, borderTopWidth: 1.5, borderTopColor: '#6366F1' },
  grandTotalLabel: { fontSize: 12, fontWeight: 600, color: '#6366F1' },
  grandTotalValue: { fontSize: 12, fontWeight: 600, color: '#6366F1' },
  paymentSection: { marginTop: 40, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 4 },
  paymentLabel: { fontSize: 8, color: '#71717A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  paymentText: { color: '#374151', lineHeight: 1.6 },
  footer: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16 },
  footerText: { fontSize: 9, color: '#9CA3AF', textAlign: 'center' },
})

function fmt(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(d))
}

interface InvoicePDFProps {
  invoice: Invoice
  profile: Pick<Profile, 'full_name' | 'email' | 'company_name' | 'address' | 'city' | 'state' | 'zip' | 'country'>
}

export function InvoicePDF({ invoice, profile }: InvoicePDFProps) {
  const creatorName = profile.company_name ?? profile.full_name ?? profile.email
  const creatorAddress = [profile.address, profile.city, profile.state, profile.zip, profile.country]
    .filter(Boolean).join(', ')

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* From / To */}
        <View style={s.addressSection}>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>From</Text>
            <Text style={s.addressName}>{creatorName}</Text>
            {profile.email && <Text style={s.addressDetail}>{profile.email}</Text>}
            {creatorAddress && <Text style={s.addressDetail}>{creatorAddress}</Text>}
          </View>
          <View style={[s.addressBlock, { alignItems: 'flex-end' }]}>
            <Text style={s.addressLabel}>To</Text>
            <Text style={[s.addressName, { textAlign: 'right' }]}>{invoice.client_name}</Text>
            {invoice.client_email && <Text style={[s.addressDetail, { textAlign: 'right' }]}>{invoice.client_email}</Text>}
            {invoice.client_address && <Text style={[s.addressDetail, { textAlign: 'right' }]}>{invoice.client_address}</Text>}
          </View>
        </View>

        {/* Dates */}
        <View style={s.datesRow}>
          <View style={s.dateBlock}>
            <Text style={s.dateLabel}>Issue Date</Text>
            <Text style={s.dateValue}>{fmtDate(invoice.issue_date)}</Text>
          </View>
          {invoice.due_date && (
            <View style={s.dateBlock}>
              <Text style={s.dateLabel}>Due Date</Text>
              <Text style={s.dateValue}>{fmtDate(invoice.due_date)}</Text>
            </View>
          )}
        </View>

        {/* Line items table */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.colDesc]}>Description</Text>
          <Text style={[s.tableHeaderText, s.colQty]}>Qty</Text>
          <Text style={[s.tableHeaderText, s.colRate]}>Rate</Text>
          <Text style={[s.tableHeaderText, s.colAmount]}>Amount</Text>
        </View>

        {invoice.line_items.map((item) => (
          <View key={item.id} style={s.tableRow}>
            <Text style={s.colDesc}>{item.description}</Text>
            <Text style={s.colQty}>{item.quantity}</Text>
            <Text style={s.colRate}>{fmt(item.unitPrice, invoice.currency)}</Text>
            <Text style={s.colAmount}>{fmt(item.total, invoice.currency)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsSection}>
          {invoice.tax_rate > 0 && (
            <>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{fmt(invoice.subtotal, invoice.currency)}</Text>
              </View>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Tax ({invoice.tax_rate}%)</Text>
                <Text style={s.totalValue}>{fmt(invoice.tax_amount, invoice.currency)}</Text>
              </View>
            </>
          )}
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Total</Text>
            <Text style={s.grandTotalValue}>{fmt(invoice.total, invoice.currency)}</Text>
          </View>
        </View>

        {/* Payment instructions */}
        {invoice.payment_notes && (
          <View style={s.paymentSection}>
            <Text style={s.paymentLabel}>Payment Instructions</Text>
            <Text style={s.paymentText}>{invoice.payment_notes}</Text>
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={{ marginTop: 24 }}>
            <Text style={s.addressLabel}>Notes</Text>
            <Text style={s.paymentText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Thank you for this partnership!</Text>
        </View>
      </Page>
    </Document>
  )
}
