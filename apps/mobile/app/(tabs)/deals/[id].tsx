import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@earnhq/utils'
import type { Deal, DealStatus } from '@earnhq/types'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ChevronLeft } from 'lucide-react-native'

const NEXT_STATUS: Partial<Record<DealStatus, DealStatus>> = {
  negotiating: 'contracted',
  contracted: 'in_production',
  in_production: 'live',
  live: 'invoiced',
  invoiced: 'paid',
}

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('deals').select('*').eq('id', id).single().then(({ data }) => {
      setDeal(data as Deal)
      setLoading(false)
    })
  }, [id])

  async function advanceStatus() {
    if (!deal) return
    const next = NEXT_STATUS[deal.status]
    if (!next) return
    const { data } = await supabase.from('deals').update({ status: next }).eq('id', deal.id).select().single()
    if (data) setDeal(data as Deal)
  }

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color="#6366F1" />
      </View>
    )
  }

  if (!deal) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <Text className="text-muted">Deal not found</Text>
      </View>
    )
  }

  const nextStatus = NEXT_STATUS[deal.status]

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      <Pressable onPress={() => router.back()} className="flex-row items-center mt-12 mb-6">
        <ChevronLeft color="#71717A" size={20} />
        <Text className="text-muted text-sm ml-1">Back</Text>
      </Pressable>

      <View className="flex-row items-start justify-between mb-6">
        <View className="flex-1 mr-4">
          <Text className="text-text text-2xl font-bold">{deal.brand_name}</Text>
          <Text className="text-muted mt-1">{deal.title}</Text>
        </View>
        <Badge status={deal.status} />
      </View>

      <Card className="mb-3">
        <Text className="text-muted text-xs mb-3">Deal Details</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Platform</Text>
          <Text className="text-text text-sm capitalize">{deal.platform}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Type</Text>
          <Text className="text-text text-sm capitalize">{deal.deal_type}</Text>
        </View>
        {deal.amount != null && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted text-sm">Amount</Text>
            <Text className="text-success text-sm font-medium">{formatCurrency(deal.amount, deal.currency)}</Text>
          </View>
        )}
        {deal.deadline && (
          <View className="flex-row justify-between">
            <Text className="text-muted text-sm">Deadline</Text>
            <Text className="text-text text-sm">{formatDate(deal.deadline)}</Text>
          </View>
        )}
      </Card>

      {deal.deliverables && deal.deliverables.length > 0 && (
        <Card className="mb-3">
          <Text className="text-muted text-xs mb-3">Deliverables</Text>
          {deal.deliverables.map(d => (
            <View key={d.id} className="flex-row items-center mb-2">
              <View className={`w-4 h-4 rounded border mr-3 items-center justify-center ${d.completed ? 'bg-success border-success' : 'border-border'}`}>
                {d.completed && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className={`text-sm flex-1 ${d.completed ? 'text-muted line-through' : 'text-text'}`}>{d.description}</Text>
            </View>
          ))}
        </Card>
      )}

      {deal.notes && (
        <Card className="mb-3">
          <Text className="text-muted text-xs mb-2">Notes</Text>
          <Text className="text-text text-sm">{deal.notes}</Text>
        </Card>
      )}

      <View className="gap-2 mt-2">
        {deal.status === 'live' && (
          <Pressable
            onPress={() => router.push({ pathname: '/(tabs)/invoices/new', params: { dealId: deal.id } } as never)}
            className="bg-brand rounded-xl py-3.5 items-center"
          >
            <Text className="text-white font-semibold">Create Invoice</Text>
          </Pressable>
        )}
        {nextStatus && (
          <Pressable
            onPress={() => Alert.alert('Advance Status', `Move to "${nextStatus.replace('_', ' ')}"?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Confirm', onPress: advanceStatus },
            ])}
            className="border border-border rounded-xl py-3.5 items-center"
          >
            <Text className="text-text font-medium capitalize">Move to {nextStatus.replace('_', ' ')}</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  )
}
