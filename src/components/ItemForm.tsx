'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { generateSlug } from '@/lib/slugify'

interface ItemFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    name: string
    slug: string
    description: string | null
    quantity: number | null
    location_id: string | null
  }
  allLocations: Array<{ id: string; name: string }>
  preselectedLocationId?: string
  prefilledSlug?: string
  onSubmit: any
  cancelHref: string
}

export function ItemForm({
  mode,
  initialData,
  allLocations,
  preselectedLocationId,
  prefilledSlug,
  onSubmit,
  cancelHref
}: ItemFormProps) {
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
    <form action={onSubmit}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Item Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            onBlur={handleNameBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
            placeholder="e.g., Winter Clothes, Tools, Documents"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
            placeholder="e.g., winter-clothes, tools, documents"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
            placeholder="Add any additional details about this item"
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity (optional)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            defaultValue={initialData?.quantity || 1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label
            htmlFor="location_id"
            className="block text-sm font-medium text-gray-700"
          >
            Location (optional)
          </label>
          <select
            id="location_id"
            name="location_id"
            defaultValue={preselectedLocationId || initialData?.location_id || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
          >
            <option value="">No location (unassigned)</option>
            {allLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'new'
              ? 'You can assign or change the location later'
              : 'Change the location to move this item'
            }
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          {mode === 'new' ? 'Create Item' : 'Save Changes'}
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
