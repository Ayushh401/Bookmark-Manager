'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthCodeError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Error: {error}</p>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            There was an error during authentication. Please try again.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </Link>
            
            <div className="text-xs text-gray-500">
              <p>Debugging tips:</p>
              <p>1. Check browser console for errors</p>
              <p>2. Check server terminal for detailed logs</p>
              <p>3. Verify redirect URLs in Supabase</p>
              <p>4. Ensure Google OAuth is enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
