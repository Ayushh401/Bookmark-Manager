import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth callback received:', { code: code ? 'present' : 'missing', state, next })

  if (code) {
    try {
      const cookieStore = await cookies()
      console.log('Available cookies:', cookieStore.getAll().map((c: any) => c.name))
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              cookie: request.headers.get('cookie') ?? '',
            },
          },
        }
      )

      console.log('Exchanging code for session...')
      const { error, data } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Session exchange failed:', error)
        return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error?error=${error.message}`)
      }
      
      console.log('Session created successfully:', data.session?.user?.email)
      return NextResponse.redirect(`${request.nextUrl.origin}${next}`)
    } catch (err) {
      console.error('Unexpected error in callback:', err)
      return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error?error=unexpected`)
    }
  }

  console.log('No code received in callback')
  return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error?error=no_code`)
}
