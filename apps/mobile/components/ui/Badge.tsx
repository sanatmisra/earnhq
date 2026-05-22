import { Text, View } from 'react-native'
import type { DealStatus, InvoiceStatus } from '@earnhq/types'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  negotiating:   { bg: 'bg-brand/20',        text: 'text-brand' },
  contracted:    { bg: 'bg-blue-500/20',      text: 'text-blue-400' },
  in_production: { bg: 'bg-warning/20',       text: 'text-warning' },
  live:          { bg: 'bg-success/20',       text: 'text-success' },
  invoiced:      { bg: 'bg-purple-500/20',    text: 'text-purple-400' },
  paid:          { bg: 'bg-emerald-500/20',   text: 'text-emerald-400' },
  cancelled:     { bg: 'bg-muted/20',         text: 'text-muted' },
  draft:         { bg: 'bg-muted/20',         text: 'text-muted' },
  sent:          { bg: 'bg-blue-500/20',      text: 'text-blue-400' },
  overdue:       { bg: 'bg-error/20',         text: 'text-error' },
}

export function Badge({ status }: { status: DealStatus | InvoiceStatus }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS['cancelled']!
  return (
    <View className={`px-2 py-0.5 rounded-full ${colors.bg}`}>
      <Text className={`text-xs font-medium capitalize ${colors.text}`}>
        {status.replace('_', ' ')}
      </Text>
    </View>
  )
}
