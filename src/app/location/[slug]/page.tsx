import { getLocation, getLocations, getLocationPath } from '@/app/actions/locations'
import { getItems } from '@/app/actions/items'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteLocationButton } from '@/components/DeleteLocationButton'
import { QRCodeModal } from '@/components/QRCodeModal'

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { location, error } = await getLocation(slug)

  if (error || !location) {
    redirect('/locations')
  }

  const [{ locations: childLocations }, { items }, path] = await Promise.all([
    getLocations(location.id),
    getItems(location.id),
    getLocationPath(location.id),
  ])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center text-sm text-slate-400">
          <Link href="/locations" className="hover:text-slate-100 flex items-center">
            Locations
          </Link>
          {path.map((item, index) => (
            <span key={item.id} className="flex items-center">
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
              {index === path.length - 1 ? (
                <span className="text-slate-100 font-medium flex items-center">{item.name}</span>
              ) : (
                <Link href={`/location/${item.slug}`} className="hover:text-slate-100 flex items-center">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Location Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-100">
                {location.name}
              </h1>
              {location.description && (
                <p className="mt-2 text-slate-400">{location.description}</p>
              )}
              <p className="mt-2 text-sm text-slate-500">
                Created {new Date(location.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <QRCodeModal path={`/location/${slug}`} label="Location QR Code" />
              <Link
                href={`/location/${slug}/edit`}
                className="p-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center"
                title="Edit location"
                aria-label="Edit location"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <DeleteLocationButton locationId={location.id} locationName={location.name} />
            </div>
          </div>
        </div>

        {/* Child Locations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100">
              Child Locations ({childLocations.length})
            </h2>
            <Link
              href={`/locations/new?parent=${location.id}`}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="Add location here"
              aria-label="Add location here"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {childLocations.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8 text-center text-slate-500">
              No child locations yet
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
              <ul className="divide-y divide-slate-700">
                {childLocations.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/location/${child.slug}`}
                      className="block hover:bg-slate-700 transition-colors px-6 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100">
                            📍 {child.name}
                          </h3>
                          {child.description && (
                            <p className="mt-1 text-sm text-slate-400">
                              {child.description}
                            </p>
                          )}
                        </div>
                        <svg
                          className="h-5 w-5 text-slate-400"
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
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100">
              Items ({items.length})
            </h2>
            <Link
              href={`/items/new?location=${location.id}`}
              className="p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center"
              title="Add item here"
              aria-label="Add item here"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8 text-center text-slate-500">
              No items in this location yet
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
              <ul className="divide-y divide-slate-700">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/item/${item.slug}`}
                      className="block hover:bg-slate-700 transition-colors px-6 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100">
                            📦 {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-slate-400">
                              {item.description}
                            </p>
                          )}
                          {item.quantity && (
                            <p className="mt-1 text-sm text-slate-500">
                              Quantity: {item.quantity}
                            </p>
                          )}
                        </div>
                        <svg
                          className="h-5 w-5 text-slate-400"
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
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
