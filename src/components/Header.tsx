import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-slate-100">
              QRganize
            </Link>
          </div>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-400">
                  {user.email}
                </span>
                <form>
                  <button
                    formAction={logout}
                    className="text-sm text-slate-400 hover:text-slate-100 font-medium"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-slate-400 hover:text-slate-100 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
