import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getStats(supabase: any) {
  // Get counts
  const [locationsResult, itemsResult, unassignedItemsResult] = await Promise.all([
    supabase.from('locations').select('id', { count: 'exact', head: true }),
    supabase.from('items').select('id', { count: 'exact', head: true }),
    supabase.from('items').select('id', { count: 'exact', head: true }).is('location_id', null),
  ])

  return {
    totalLocations: locationsResult.count || 0,
    totalItems: itemsResult.count || 0,
    unassignedItems: unassignedItemsResult.count || 0,
  }
}

async function getRecentActivity(supabase: any) {
  const [recentLocations, recentItems] = await Promise.all([
    supabase
      .from('locations')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('items')
      .select('id, name, created_at, location:locations(id, name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    recentLocations: recentLocations.data || [],
    recentItems: recentItems.data || [],
  }
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let stats = null
  let recentActivity = null

  if (user) {
    stats = await getStats(supabase)
    recentActivity = await getRecentActivity(supabase)
  }

  return (
    <>
      {user ? (
        /* Authenticated User View - Dashboard */
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.email?.split('@')[0]}! Here&apos;s an overview of your inventory.
            </p>
          </div>
          {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Locations</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalLocations}</p>
                    </div>
                    <div className="text-4xl">📍</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/locations"
                      className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-medium text-sm transition-colors"
                    >
                      View all
                    </Link>
                    <Link
                      href="/locations/new"
                      className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                    >
                      + Create
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalItems}</p>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/items"
                      className="flex-1 text-center px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 font-medium text-sm transition-colors"
                    >
                      View all
                    </Link>
                    <Link
                      href="/items/new"
                      className="flex-1 text-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
                    >
                      + Create
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unassigned Items</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{stats.unassignedItems}</p>
                    </div>
                    <div className="text-4xl">⚠️</div>
                  </div>
                  {stats.unassignedItems > 0 ? (
                    <Link
                      href="/items"
                      className="text-sm text-orange-600 hover:text-orange-800 mt-4 inline-block"
                    >
                      Assign locations →
                    </Link>
                  ) : (
                    <p className="text-sm text-green-600 mt-4">All items assigned!</p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {recentActivity && (recentActivity.recentLocations.length > 0 || recentActivity.recentItems.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Recent Locations */}
                {recentActivity.recentLocations.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                      Recent Locations
                      <Link href="/locations" className="text-sm text-blue-600 hover:text-blue-800 font-normal">
                        View all →
                      </Link>
                    </h3>
                    <ul className="space-y-3">
                      {recentActivity.recentLocations.map((location: any) => (
                        <li key={location.id}>
                          <Link
                            href={`/location/${location.id}`}
                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-xl">📍</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {location.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(location.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Items */}
                {recentActivity.recentItems.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                      Recent Items
                      <Link href="/items" className="text-sm text-green-600 hover:text-green-800 font-normal">
                        View all →
                      </Link>
                    </h3>
                    <ul className="space-y-3">
                      {recentActivity.recentItems.map((item: any) => (
                        <li key={item.id}>
                          <Link
                            href={`/item/${item.id}`}
                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-xl">📦</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.location ? `📍 ${item.location.name}` : 'Unassigned'} • {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
      ) : (
        /* Unauthenticated User View */
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Welcome to QRganize
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Smart location & item tracking with QR codes
              </p>
            </div>

            <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Get started with QRganize
              </h2>
              <p className="text-gray-600 mb-8">
                Sign up for a free account to start organizing your items with QR codes
              </p>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold mb-2">Hierarchical Organization</h3>
                <p className="text-gray-600 text-sm">
                  Organize locations in a tree structure - house, room, shelf, box
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2">QR Code Scanning</h3>
                <p className="text-gray-600 text-sm">
                  Instantly find items by scanning QR codes with your phone
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-lg font-semibold mb-2">Cloud Sync</h3>
                <p className="text-gray-600 text-sm">
                  Access your inventory from anywhere, on any device
                </p>
              </div>
            </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
