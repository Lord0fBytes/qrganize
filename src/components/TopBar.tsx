import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'

export async function TopBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title - centered on mobile, left-aligned on desktop */}
        <div className="flex-1 flex lg:justify-start justify-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            QRganize
          </Link>
        </div>

        {/* User info - hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <form>
            <button
              formAction={logout}
              className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
