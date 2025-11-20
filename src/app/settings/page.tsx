import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSettings } from '@/app/actions/settings'
import { SettingsForm } from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { settings, error } = await getSettings()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading settings: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your QRganize preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Legacy QR Code Support
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enable this if you have QR codes from a previous system that you want to reuse.
            Legacy QR codes with paths like <code className="bg-gray-100 px-2 py-1 rounded">/tote-19</code> will
            be automatically converted to the new format.
          </p>

          <SettingsForm initialSettings={settings} />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Old QR codes with format <code className="bg-blue-100 px-1 rounded">/your-slug</code> will be recognized</li>
            <li>• The system will look up the slug in your selected target (items or locations)</li>
            <li>• If found, you&apos;ll be redirected to the item or location page</li>
            <li>• If not found, you&apos;ll be taken to a create form with the slug pre-filled</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
