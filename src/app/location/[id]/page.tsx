import { getLocation, getLocations, getLocationPath } from '@/app/actions/locations'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteLocationButton } from '@/components/DeleteLocationButton'

export default async function LocationDetailPage({
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
  const { location, error } = await getLocation(id)

  if (error || !location) {
    redirect('/locations')
  }

  // Get child locations
  const { locations: childLocations } = await getLocations(id)

  // Get items in this location
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('location_id', id)
    .order('name', { ascending: true })

  // Get breadcrumb path
  const path = await getLocationPath(id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center text-sm text-gray-600">
          <Link href="/locations" className="hover:text-gray-900">
            Locations
          </Link>
          {path.map((item, index) => (
            <span key={item.id} className="flex items-center">
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
              {index === path.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link href={`/location/${item.id}`} className="hover:text-gray-900">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Location Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {location.name}
              </h1>
              {location.description && (
                <p className="mt-2 text-gray-600">{location.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Created {new Date(location.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <Link
                href={`/location/${id}/edit`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
              >
                Edit
              </Link>
              <DeleteLocationButton locationId={id} locationName={location.name} />
            </div>
          </div>
        </div>

        {/* Child Locations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Child Locations ({childLocations.length})
            </h2>
            <Link
              href={`/locations/new?parent=${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
            >
              + Add Location Here
            </Link>
          </div>

          {childLocations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              No child locations yet
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {childLocations.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/location/${child.id}`}
                      className="block hover:bg-gray-50 transition-colors px-6 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            📍 {child.name}
                          </h3>
                          {child.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {child.description}
                            </p>
                          )}
                        </div>
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
            <h2 className="text-xl font-semibold text-gray-900">
              Items ({items?.length || 0})
            </h2>
            <Link
              href={`/items/new?location=${id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
            >
              + Add Item Here
            </Link>
          </div>

          {!items || items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              No items in this location yet
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/item/${item.id}`}
                      className="block hover:bg-gray-50 transition-colors px-6 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            📦 {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                          {item.quantity && (
                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          )}
                        </div>
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
