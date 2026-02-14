import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        storage: {
          getItem: (key) => {
            if (typeof window !== 'undefined') {
              return localStorage.getItem(key)
            }
            return null
          },
          setItem: (key, value) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(key, value)
            }
          },
          removeItem: (key) => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(key)
            }
          }
        }
      }
    }
  )
}
