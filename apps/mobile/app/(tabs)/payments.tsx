import { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, RefreshControl, Alert, SectionList } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { formatCurrency, formatDate, getDaysUntil } from '@earnhq/utils'
import type { Invoice } from '@earnhq/types'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

export default function PaymentsScreen() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [refreshing, setRefreshing] = useState(false)

  async function fetchInvoices() {
    if (!user) return
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['sent', 'overdue'])
      .order('due_date', { ascending: true })
    if (data) setInvoices(data as Invoice[])
  }

  useEffect(() => { fetchInvoices() }, [user])

  async function onRefresh() {
    setRefreshing(true)
    await fetchInvoices()
    setRefreshing(false)
  }

  async function markPaid(invoice: Invoice) {
    Alert.alert('Mark as Paid', `Mark ${invoice.invoice_number} as paid?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark Paid',
        onPress: async () => {
          await supabase.from('invoices').update({ status: 'paid', paid_date: new Date().toISOString() }).eq('id', invoice.id)
          fetchInvoices()
        },
      },
    ])
  }

  const overdue = invoices.filter(i => i.status === 'overdue')
  const dueThisWeek = invoices.filter(i => {
    if (i.status === 'overdue') return false
    if (!i.due_date) return false
    const days = getDaysUntil(i.due_date)
    return days >= 0 && days <= 7
  })
  const upcoming = invoices.filter(i => {
    if (i.status === 'overdue') return false
    if (!i.due_date) return true
    return getDaysUntil(i.due_date) > 7
  })

  const sections = [
    { title: 'Overdue', data: overdue, borderColor: 'border-error' },
    { title: 'Due This Week', data: dueThisWeek, borderColor: 'border-warning' },
    { title: 'Upcoming', data: upcoming, borderColor: 'border-border' },
  ].filter(s => s.data.length > 0)

  if (invoices.length === 0) {
    return (
      <View className="flex-1 bg-bg pt-12">
        <Text className="text-text text-2xl font-bold px-4 mb-4">Payments</Text>
        <EmptyState icon="💰" title="All caught up" subtitle="No outstanding invoices" />
      </View>
    )
  }

  return (
    <SectionList
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={<Text className="text-text text-2xl font-bold mb-4 mt-8">Payments</Text>}
      sections={sections}
      keyExtractor={item => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
      renderSectionHeader={({ section }) => (
        <Text className="text-muted text-xs font-semibold mb-2 mt-4 uppercase tracking-wide">{section.title}</Text>
      )}
      renderItem={({ item: invoice, section }) => (
        <Card className={`mb-2 border-l-2 ${section.borderColor}`}>
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-3">
              <Text className="text-text font-semibold">{invoice.client_name}</Text>
              <Text className="text-muted text-xs">{invoice.invoice_number}</Text>
            </View>
            <Text className="text-text font-bold">{formatCurrency(invoice.total, invoice.currency)}</Text>
          </View>
          {invoice.due_date && (
            <Text className="text-muted text-xs mt-1">Due {formatDate(invoice.due_date)}</Text>
          )}
          <View className="flex-row gap-2 mt-3">
            <Pressable
              onPress={() => markPaid(invoice)}
              className="flex-1 bg-success/20 rounded-lg py-2 items-center"
            >
              <Text className="text-success text-xs font-medium">Mark Paid</Text>
            </Pressable>
          </View>
        </Card>
      )}
    />
  )
}
