import { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from '@/lib/supabase'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    try {
      const redirectUri = makeRedirectUri({ scheme: 'earnhq' })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      })

      if (error) throw error

      const result = await WebBrowser.openAuthSessionAsync(
        data.url ?? '',
        redirectUri
      )

      if (result.type === 'success') {
        const { url } = result
        const params = new URLSearchParams(url.split('#')[1])
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        }
      }
    } catch {
      Alert.alert('Error', 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <Text className="text-4xl font-bold text-brand mb-2">EarnHQ</Text>
      <Text className="text-muted text-base mb-16">Your brand deal command center</Text>

      <Pressable
        onPress={signInWithGoogle}
        disabled={loading}
        className="w-full bg-brand rounded-xl py-4 items-center active:opacity-80"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Continue with Google</Text>
        )}
      </Pressable>

      <Text className="text-muted text-xs mt-8 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  )
}
