'use client'

import { useState } from 'react'
import { updateSettings, type UserSettings, type LegacyQRTarget } from '@/app/actions/settings'

interface SettingsFormProps {
  initialSettings: UserSettings | null
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [enabled, setEnabled] = useState(initialSettings?.legacy_qr_enabled ?? false)
  const [target, setTarget] = useState<LegacyQRTarget>(initialSettings?.legacy_qr_target ?? 'items')
  const [domain, setDomain] = useState(initialSettings?.legacy_qr_domain ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('legacy_qr_enabled', enabled.toString())
    formData.append('legacy_qr_target', target)
    formData.append('legacy_qr_domain', domain)

    const result = await updateSettings(formData)

    setSaving(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Toggle Switch */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-900">Enable Legacy QR Support</span>
          </div>
        </label>
      </div>

      {/* Legacy Domain Input - only show if enabled */}
      {enabled && (
        <div className="mb-6">
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Legacy QR Code Domain (optional)
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g., http://localhost:3002 or https://old-app.com"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          <p className="mt-1 text-sm text-gray-500">
            If your old QR codes use a different domain, enter it here. Leave blank if using the same domain.
          </p>
        </div>
      )}

      {/* Radio Buttons - only show if enabled */}
      {enabled && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Legacy QR codes redirect to:
          </label>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="target"
                value="items"
                checked={target === 'items'}
                onChange={(e) => setTarget(e.target.value as LegacyQRTarget)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3">
                <span className="font-medium text-gray-900">Items</span>
                <span className="block text-sm text-gray-500">
                  Legacy QR codes will look up slugs in the items table
                </span>
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="target"
                value="locations"
                checked={target === 'locations'}
                onChange={(e) => setTarget(e.target.value as LegacyQRTarget)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3">
                <span className="font-medium text-gray-900">Locations</span>
                <span className="block text-sm text-gray-500">
                  Legacy QR codes will look up slugs in the locations table
                </span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
