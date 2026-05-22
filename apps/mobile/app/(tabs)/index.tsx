import { useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { formatCurrency } from '@earnhq/utils'
import type { Deal, Invoice } from '@earnhq/types'
import { Card } from '@/components/ui/Card'

export default function DashboardScreen() {
  const { user } = useAuth()
  const [deals, setDeals] = useState<Deal[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [refreshing, setRefreshing] = useState(false)

  async function fetchData() {
    if (!user) return
    const [dealsRes, invoicesRes] = await Promise.all([
      supabase.from('deals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (dealsRes.data) setDeals(dealsRes.data as Deal[])
    if (invoicesRes.data) setInvoices(invoicesRes.data as Invoice[])
  }

  useEffect(() => { fetchData() }, [user])

  async function onRefresh() {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const activeDeals = deals.filter(d => !['paid', 'cancelled'].includes(d.status)).length
  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
  const outstanding = pendingInvoices.reduce((sum, i) => sum + i.total, 0)
  const paidMtd = invoices
    .filter(i => i.status === 'paid' && i.paid_date && new Date(i.paid_date).getMonth() === new Date().getMonth())
    .reduce((sum, i) => sum + i.total, 0)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
    >
      <Text className="text-muted text-sm mt-8 mb-1">{greeting},</Text>
      <Text className="text-text text-2xl font-bold mb-6">{name}</Text>

      <View className="flex-row gap-3 mb-3">
        <Card className="flex-1">
          <Text className="text-muted text-xs mb-1">Active Deals</Text>
          <Text className="text-text text-2xl font-bold">{activeDeals}</Text>
        </Card>
        <Card className="flex-1">
          <Text className="text-muted text-xs mb-1">Pending Invoices</Text>
          <Text className="text-text text-2xl font-bold">{pendingInvoices.length}</Text>
        </Card>
      </View>

      <View className="flex-row gap-3 mb-6">
        <Card className="flex-1">
          <Text className="text-muted text-xs mb-1">Outstanding</Text>
          <Text className="text-warning text-xl font-bold">{formatCurrency(outstanding)}</Text>
        </Card>
        <Card className="flex-1">
          <Text className="text-muted text-xs mb-1">Paid MTD</Text>
          <Text className="text-success text-xl font-bold">{formatCurrency(paidMtd)}</Text>
        </Card>
      </View>

      <Text className="text-text font-semibold text-base mb-3">Recent Deals</Text>
      {deals.length === 0 ? (
        <Card>
          <Text className="text-muted text-sm text-center py-4">No deals yet</Text>
        </Card>
      ) : (
        deals.slice(0, 3).map(deal => (
          <Card key={deal.id} className="mb-2">
            <Text className="text-text font-medium">{deal.brand_name}</Text>
            <Text className="text-muted text-xs mt-0.5">{deal.title}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-brand text-xs capitalize">{deal.status.replace('_', ' ')}</Text>
              {deal.amount != null && (
                <Text className="text-success text-xs">{formatCurrency(deal.amount, deal.currency)}</Text>
              )}
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  )
}
