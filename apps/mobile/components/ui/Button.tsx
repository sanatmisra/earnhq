import { Pressable, Text, ActivityIndicator } from 'react-native'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

const VARIANTS: Record<Variant, { container: string; text: string }> = {
  primary:  { container: 'bg-brand',         text: 'text-white' },
  outline:  { container: 'border border-border', text: 'text-text' },
  ghost:    { container: '',                  text: 'text-muted' },
  danger:   { container: 'border border-error', text: 'text-error' },
}

export function Button({
  onPress,
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
}: {
  onPress: () => void
  label: string
  variant?: Variant
  loading?: boolean
  disabled?: boolean
}) {
  const v = VARIANTS[variant]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl py-3.5 items-center active:opacity-75 ${v.container} ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#6366F1'} />
      ) : (
        <Text className={`font-semibold text-base ${v.text}`}>{label}</Text>
      )}
    </Pressable>
  )
}
