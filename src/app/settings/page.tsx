import { getSettings } from '@/app/actions/settings'
import { SettingsForm } from '@/components/SettingsForm'

export default async function SettingsPage() {
  const { settings, error } = await getSettings()

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">Error loading settings: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
          <p className="mt-2 text-slate-400">
            Configure your QRganize preferences
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            Legacy QR Code Support
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Enable this if you have QR codes from a previous system that you want to reuse.
            Legacy QR codes with paths like <code className="bg-slate-700 px-2 py-1 rounded text-slate-200">/tote-19</code> will
            be automatically converted to the new format.
          </p>

          <SettingsForm initialSettings={settings} />
        </div>

        <div className="mt-6 bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Old QR codes with format <code className="bg-blue-800/50 px-1 rounded">/your-slug</code> will be recognized</li>
            <li>• The system will look up the slug in your selected target (items or locations)</li>
            <li>• If found, you&apos;ll be redirected to the item or location page</li>
            <li>• If not found, you&apos;ll be taken to a create form with the slug pre-filled</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
