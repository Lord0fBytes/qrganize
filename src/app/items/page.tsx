import { getItems } from '../actions/items'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { items, error } = await getItems()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Items</h1>
            <p className="mt-2 text-gray-600">
              Manage all your items across locations
            </p>
          </div>
          <Link
            href="/items/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            + New Item
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No items yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first item
            </p>
            <Link
              href="/items/new"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Create your first item
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/item/${item.slug}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="text-xl">📦</span>
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            {item.location && (
                              <span>
                                📍 {item.location.name}
                              </span>
                            )}
                            {!item.location && (
                              <span className="text-gray-400">No location assigned</span>
                            )}
                            {item.quantity && (
                              <span>Qty: {item.quantity}</span>
                            )}
                            <span>
                              Created {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
