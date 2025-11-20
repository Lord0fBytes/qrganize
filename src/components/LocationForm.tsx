'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { generateSlug } from '@/lib/slugify'

interface LocationFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    name: string
    slug: string
    description: string | null
  }
  parentId?: string
  prefilledSlug?: string
  onSubmit: (formData: FormData) => Promise<void>
  cancelHref: string
}

export function LocationForm({ mode, initialData, parentId, prefilledSlug, onSubmit, cancelHref }: LocationFormProps) {
  const [slug, setSlug] = useState(initialData?.slug || prefilledSlug || '')
  const [manuallyEdited, setManuallyEdited] = useState(!!prefilledSlug)
  const slugInputRef = useRef<HTMLInputElement>(null)

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const nameValue = e.target.value

    // Only auto-generate if slug hasn't been manually edited
    if (!manuallyEdited && nameValue) {
      const generatedSlug = generateSlug(nameValue)
      setSlug(generatedSlug)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
    setManuallyEdited(true)
  }

  const handleSlugFocus = () => {
    setManuallyEdited(true)
  }

  return (
    <form>
      {parentId && <input type="hidden" name="parent_id" value={parentId} />}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Location Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            onBlur={handleNameBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="e.g., Living Room, Garage, Box #12"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            URL Slug (optional)
          </label>
          <input
            ref={slugInputRef}
            type="text"
            id="slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            onFocus={handleSlugFocus}
            pattern="[a-z0-9-]*"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="e.g., living-room, garage, box-12"
          />
          <p className="mt-1 text-sm text-gray-500">
            Auto-generates from name. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialData?.description || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Add any additional details about this location"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          formAction={onSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          {mode === 'new' ? 'Create Location' : 'Save Changes'}
        </button>
        <Link
          href={cancelHref}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
