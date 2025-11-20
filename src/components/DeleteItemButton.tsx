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
      <div className="flex gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm"
        >
          Cancel
        </button>
        <form action={handleDelete}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm"
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
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
    >
      Delete
    </button>
  )
}
