import { getItem } from '@/app/actions/items'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteItemButton } from '@/components/DeleteItemButton'
import { QRCodeModal } from '@/components/QRCodeModal'

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { slug } = await params
  const { item, error } = await getItem(slug)

  if (error || !item) {
    redirect('/items')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center text-sm text-slate-400">
          <Link href="/items" className="hover:text-slate-100 flex items-center">
            Items
          </Link>
          <svg
            className="mx-2 h-4 w-4 flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="text-slate-100 font-medium flex items-center">{item.name}</span>
        </nav>

        {/* Item Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-4xl leading-none">📦</span>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-100 leading-tight">
                    {item.name}
                  </h1>
                </div>
              </div>
              {item.description && (
                <p className="mt-2 text-slate-400">{item.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {item.quantity && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-slate-300">Quantity:</span>
                    <span className="text-slate-400">{item.quantity}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-medium text-slate-300">Created:</span>
                  <span className="text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-4 flex gap-2">
              <QRCodeModal path={`/item/${slug}`} label="Item QR Code" />
              <Link
                href={`/item/${slug}/edit`}
                className="p-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center"
                title="Edit item"
                aria-label="Edit item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <DeleteItemButton itemId={item.id} itemName={item.name} />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Location</h2>
          {item.location ? (
            <Link
              href={`/location/${item.location.slug}`}
              className="flex items-center gap-3 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg hover:bg-blue-800/40 transition-colors"
            >
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium text-slate-100">{item.location.name}</h3>
                <p className="text-sm text-slate-400">Click to view location details</p>
              </div>
              <svg
                className="ml-auto h-5 w-5 text-slate-400"
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
            <div className="p-4 bg-slate-700 rounded-lg text-center">
              <p className="text-slate-400 mb-3">
                This item is not assigned to any location
              </p>
              <Link
                href={`/item/${slug}/edit`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-sm"
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
