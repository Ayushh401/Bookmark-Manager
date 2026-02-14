import AuthButton from '@/components/AuthButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmark Manager</h1>
          <p className="text-gray-600 mb-8">
            Save and manage your bookmarks securely with real-time synchronization
          </p>
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
