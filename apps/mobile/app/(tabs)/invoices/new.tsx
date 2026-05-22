import { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { generateInvoiceNumber } from '@earnhq/utils'
import type { Deal } from '@earnhq/types'
import { ChevronLeft } from 'lucide-react-native'

export default function NewInvoiceScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { dealId } = useLocalSearchParams<{ dealId?: string }>()

  const [loading, setLoading] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (dealId) {
      supabase.from('deals').select('*').eq('id', dealId).single().then(({ data }) => {
        if (data) {
          const deal = data as Deal
          setClientName(deal.brand_name)
          setClientEmail(deal.brand_contact_email ?? '')
          setDescription(deal.title)
          if (deal.amount != null) setAmount(String(deal.amount))
          setCurrency(deal.currency)
        }
      })
    }
  }, [dealId])

  async function createInvoice() {
    if (!user || !clientName || !amount) {
      Alert.alert('Missing fields', 'Please fill in client name and amount.')
      return
    }

    setLoading(true)
    try {
      const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      const invoiceNumber = generateInvoiceNumber(count ?? 0)
      const amountNum = parseFloat(amount)

      await supabase.from('invoices').insert({
        user_id: user.id,
        deal_id: dealId ?? null,
        invoice_number: invoiceNumber,
        status: 'draft',
        client_name: clientName,
        client_email: clientEmail || null,
        subtotal: amountNum,
        tax_rate: 0,
        tax_amount: 0,
        total: amountNum,
        currency,
        line_items: [{ id: '1', description: description || clientName, quantity: 1, unitPrice: amountNum, total: amountNum }],
        issue_date: new Date().toISOString().split('T')[0],
        due_date: dueDate || null,
        notes: null,
      })

      Alert.alert('Invoice created', `${invoiceNumber} has been created as a draft.`, [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch {
      Alert.alert('Error', 'Failed to create invoice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Pressable onPress={() => router.back()} className="flex-row items-center mt-12 mb-6">
        <ChevronLeft color="#71717A" size={20} />
        <Text className="text-muted text-sm ml-1">Back</Text>
      </Pressable>

      <Text className="text-text text-2xl font-bold mb-6">New Invoice</Text>

      {[
        { label: 'Brand / Client Name *', value: clientName, setter: setClientName, placeholder: 'Acme Corp' },
        { label: 'Client Email', value: clientEmail, setter: setClientEmail, placeholder: 'billing@acme.com', keyboard: 'email-address' as const },
        { label: 'Description', value: description, setter: setDescription, placeholder: 'YouTube Integration — April' },
        { label: 'Amount *', value: amount, setter: setAmount, placeholder: '5000', keyboard: 'numeric' as const },
        { label: 'Currency', value: currency, setter: setCurrency, placeholder: 'USD' },
        { label: 'Due Date (YYYY-MM-DD)', value: dueDate, setter: setDueDate, placeholder: '2026-06-01' },
      ].map(field => (
        <View key={field.label} className="mb-4">
          <Text className="text-muted text-xs mb-1.5">{field.label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.placeholder}
            placeholderTextColor="#71717A"
            keyboardType={field.keyboard}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-text"
          />
        </View>
      ))}

      <Pressable
        onPress={createInvoice}
        disabled={loading}
        className="bg-brand rounded-xl py-4 items-center mt-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Create Invoice</Text>
        )}
      </Pressable>
    </ScrollView>
  )
}
