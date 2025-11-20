import { getItem } from '@/app/actions/items'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteItemButton } from '@/components/DeleteItemButton'
import { QRCodeModal } from '@/components/QRCodeModal'

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const { item, error } = await getItem(id)

  if (error || !item) {
    redirect('/items')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center text-sm text-gray-600">
          <Link href="/items" className="hover:text-gray-900">
            Items
          </Link>
          <svg
            className="mx-2 h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="text-gray-900 font-medium">{item.name}</span>
        </nav>

        {/* Item Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">📦</span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.name}
                </h1>
              </div>
              {item.description && (
                <p className="mt-2 text-gray-600">{item.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {item.quantity && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <span className="text-gray-600">{item.quantity}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="text-gray-600">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-4 flex gap-2">
              <QRCodeModal path={`/item/${id}`} label="Item QR Code" />
              <Link
                href={`/item/${id}/edit`}
                className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                title="Edit item"
                aria-label="Edit item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <DeleteItemButton itemId={id} itemName={item.name} />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
          {item.location ? (
            <Link
              href={`/location/${item.location.id}`}
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium text-gray-900">{item.location.name}</h3>
                <p className="text-sm text-gray-600">Click to view location details</p>
              </div>
              <svg
                className="ml-auto h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-3">
                This item is not assigned to any location
              </p>
              <Link
                href={`/item/${id}/edit`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
              >
                Assign to Location
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
