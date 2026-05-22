import { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, RefreshControl, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { formatCurrency, formatDate } from '@earnhq/utils'
import type { Invoice, InvoiceStatus } from '@earnhq/types'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus } from 'lucide-react-native'

const STATUS_FILTERS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Paid', value: 'paid' },
]

export default function InvoicesScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')
  const [refreshing, setRefreshing] = useState(false)

  async function fetchInvoices() {
    if (!user) return
    let query = supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    if (data) setInvoices(data as Invoice[])
  }

  useEffect(() => { fetchInvoices() }, [user, filter])

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

  const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0)
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0)
  const paidMtd = invoices
    .filter(i => i.status === 'paid' && i.paid_date && new Date(i.paid_date).getMonth() === new Date().getMonth())
    .reduce((s, i) => s + i.total, 0)

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-12 pb-3">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-text text-2xl font-bold">Invoices</Text>
          <Pressable onPress={() => router.push('/(tabs)/invoices/new' as never)} className="bg-brand rounded-full p-2">
            <Plus color="white" size={18} />
          </Pressable>
        </View>

        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1 py-2">
            <Text className="text-muted text-xs">Outstanding</Text>
            <Text className="text-warning text-base font-bold">{formatCurrency(outstanding)}</Text>
          </Card>
          <Card className="flex-1 py-2">
            <Text className="text-muted text-xs">Overdue</Text>
            <Text className="text-error text-base font-bold">{formatCurrency(overdue)}</Text>
          </Card>
          <Card className="flex-1 py-2">
            <Text className="text-muted text-xs">Paid MTD</Text>
            <Text className="text-success text-base font-bold">{formatCurrency(paidMtd)}</Text>
          </Card>
        </View>

        <View className="flex-row gap-2">
          {STATUS_FILTERS.map(f => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full border ${filter === f.value ? 'bg-brand border-brand' : 'border-border'}`}
            >
              <Text className={`text-xs font-medium ${filter === f.value ? 'text-white' : 'text-muted'}`}>{f.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
        ListEmptyComponent={
          <EmptyState icon="📄" title="No invoices yet" subtitle="Create your first invoice to get paid" />
        }
        renderItem={({ item: invoice }) => (
          <Pressable onPress={() => invoice.status !== 'paid' && markPaid(invoice)} className="mb-2">
            <Card>
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-text font-semibold">{invoice.client_name}</Text>
                  <Text className="text-muted text-xs mt-0.5">{invoice.invoice_number}</Text>
                </View>
                <Text className="text-text font-bold">{formatCurrency(invoice.total, invoice.currency)}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Badge status={invoice.status} />
                {invoice.due_date && (
                  <Text className="text-muted text-xs">Due {formatDate(invoice.due_date)}</Text>
                )}
              </View>
            </Card>
          </Pressable>
        )}
      />
    </View>
  )
}
