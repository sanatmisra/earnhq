import { View, Text } from 'react-native'

export function EmptyState({ icon, title, subtitle }: {
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <Text className="text-4xl mb-3">{icon}</Text>
      <Text className="text-text font-semibold text-base mb-2">{title}</Text>
      <Text className="text-muted text-sm text-center">{subtitle}</Text>
    </View>
  )
}
