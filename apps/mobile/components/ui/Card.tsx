import { View, ViewProps } from 'react-native'

export function Card({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={`bg-surface border border-border rounded-xl p-4 ${className ?? ''}`} {...props}>
      {children}
    </View>
  )
}
