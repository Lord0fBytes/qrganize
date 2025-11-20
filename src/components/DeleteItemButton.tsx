'use client'

import { deleteItem } from '@/app/actions/items'
import { useState } from 'react'

export function DeleteItemButton({
  itemId,
  itemName,
}: {
  itemId: string
  itemName: string
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    await deleteItem(itemId)
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm"
        >
          Cancel
        </button>
        <form action={handleDelete}>
          <button
            type="submit"
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm"
          >
            Confirm Delete
          </button>
        </form>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      title={`Delete ${itemName}`}
      aria-label={`Delete ${itemName}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
