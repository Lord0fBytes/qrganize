import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QRScanner } from '@/components/QRScanner'
import { getSettings } from '@/app/actions/settings'

export default async function ScanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user settings for legacy QR support
  const { settings } = await getSettings()
  const legacyDomain = settings?.legacy_qr_domain || null

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Scan QR Code</h1>
              <p className="mt-2 text-slate-400">
                Scan a QRganize QR code to view location or item details
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 font-semibold flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <QRScanner legacyDomain={legacyDomain} />
        </div>
      </div>
    </div>
  )
}
