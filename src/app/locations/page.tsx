import { getLocations } from '../actions/locations'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LocationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { locations, error } = await getLocations(null)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Locations</h1>
            <p className="mt-2 text-slate-400">
              Manage your hierarchical locations
            </p>
          </div>
          <Link
            href="/locations/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            + New Location
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
            {error}
          </div>
        )}

        {locations.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">
              No locations yet
            </h2>
            <p className="text-slate-400 mb-6">
              Get started by creating your first location
            </p>
            <Link
              href="/locations/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              Create your first location
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <ul className="divide-y divide-slate-700">
              {locations.map((location) => (
                <li key={location.id}>
                  <Link
                    href={`/location/${location.slug}`}
                    className="block hover:bg-slate-700 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {location.name}
                          </h3>
                          {location.description && (
                            <p className="mt-1 text-sm text-slate-400">
                              {location.description}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">
                            Created {new Date(location.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
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
