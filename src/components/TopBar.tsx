import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'

export async function TopBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title - centered on mobile, left-aligned on desktop */}
        <div className="flex-1 flex lg:justify-start justify-center">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-slate-300 transition-colors">
            QRganize
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search button - visible on all screens */}
          <Link
            href="/search"
            className="p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center"
            title="Search"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Scan button - visible on all screens */}
          <Link
            href="/scan"
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            title="Scan QR Code"
            aria-label="Scan QR Code"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="hidden sm:inline text-sm font-semibold">Scan</span>
          </Link>

          {/* User info - hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {user?.email}
            </span>
            <form>
              <button
                formAction={logout}
                className="text-sm px-4 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-md transition-colors font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
