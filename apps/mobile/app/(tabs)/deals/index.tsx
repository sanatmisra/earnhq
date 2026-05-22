import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, RefreshControl, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { formatCurrency } from '@earnhq/utils'
import type { Deal, DealStatus } from '@earnhq/types'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

const STATUS_FILTERS: { label: string; value: DealStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Negotiating', value: 'negotiating' },
  { label: 'Contracted', value: 'contracted' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Live', value: 'live' },
  { label: 'Invoiced', value: 'invoiced' },
  { label: 'Paid', value: 'paid' },
]

export default function DealsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [filter, setFilter] = useState<DealStatus | 'all'>('all')
  const [refreshing, setRefreshing] = useState(false)

  async function fetchDeals() {
    if (!user) return
    let query = supabase.from('deals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    if (data) setDeals(data as Deal[])
  }

  useEffect(() => { fetchDeals() }, [user, filter])

  async function onRefresh() {
    setRefreshing(true)
    await fetchDeals()
    setRefreshing(false)
  }

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-12 pb-3">
        <Text className="text-text text-2xl font-bold mb-4">Deals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
          {STATUS_FILTERS.map(f => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`mx-1 px-3 py-1.5 rounded-full border ${filter === f.value ? 'bg-brand border-brand' : 'border-border'}`}
            >
              <Text className={`text-xs font-medium ${filter === f.value ? 'text-white' : 'text-muted'}`}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={deals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
        ListEmptyComponent={
          <EmptyState icon="🤝" title="No deals yet" subtitle="Your brand deals will appear here" />
        }
        renderItem={({ item: deal }) => (
          <Pressable onPress={() => router.push(`/deals/${deal.id}` as never)} className="mb-2">
            <Card>
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-text font-semibold">{deal.brand_name}</Text>
                  <Text className="text-muted text-xs mt-0.5" numberOfLines={1}>{deal.title}</Text>
                </View>
                {deal.amount != null && (
                  <Text className="text-success text-sm font-medium">{formatCurrency(deal.amount, deal.currency)}</Text>
                )}
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <Badge status={deal.status} />
                <Text className="text-muted text-xs capitalize">{deal.platform}</Text>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </View>
  )
}
