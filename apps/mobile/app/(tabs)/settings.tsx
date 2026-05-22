import { View, Text, Pressable, Alert } from 'react-native'
import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/Card'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <View className="flex-1 bg-bg px-4 pt-12">
      <Text className="text-text text-2xl font-bold mb-6">Settings</Text>

      <Card className="mb-4">
        <Text className="text-muted text-xs mb-1">Signed in as</Text>
        <Text className="text-text font-medium">{user?.email}</Text>
      </Card>

      <Pressable onPress={handleSignOut} className="border border-error rounded-xl py-3.5 items-center">
        <Text className="text-error font-medium">Sign Out</Text>
      </Pressable>
    </View>
  )
}
