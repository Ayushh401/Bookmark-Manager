'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Error logging in:', error)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error logging out:', error)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Login with Google'}
    </button>
  )
}
