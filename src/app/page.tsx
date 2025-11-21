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
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400">
              Welcome back, {user.email?.split('@')[0]}! Here&apos;s an overview of your inventory.
            </p>
          </div>
          {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Total Locations</p>
                      <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalLocations}</p>
                    </div>
                    <div className="text-4xl">📍</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/locations"
                      className="flex-1 text-center px-3 py-2 bg-slate-700 text-blue-400 rounded-md hover:bg-slate-600 font-medium text-sm transition-colors"
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

                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Total Items</p>
                      <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.totalItems}</p>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/items"
                      className="flex-1 text-center px-3 py-2 bg-slate-700 text-emerald-400 rounded-md hover:bg-slate-600 font-medium text-sm transition-colors"
                    >
                      View all
                    </Link>
                    <Link
                      href="/items/new"
                      className="flex-1 text-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium text-sm transition-colors"
                    >
                      + Create
                    </Link>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Unassigned Items</p>
                      <p className="text-3xl font-bold text-orange-400 mt-2">{stats.unassignedItems}</p>
                    </div>
                    <div className="text-4xl">⚠️</div>
                  </div>
                  {stats.unassignedItems > 0 ? (
                    <Link
                      href="/items"
                      className="text-sm text-orange-400 hover:text-orange-300 mt-4 inline-block"
                    >
                      Assign locations →
                    </Link>
                  ) : (
                    <p className="text-sm text-emerald-400 mt-4">All items assigned!</p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {recentActivity && (recentActivity.recentLocations.length > 0 || recentActivity.recentItems.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Recent Locations */}
                {recentActivity.recentLocations.length > 0 && (
                  <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-slate-100">
                      Recent Locations
                      <Link href="/locations" className="text-sm text-blue-400 hover:text-blue-300 font-normal">
                        View all →
                      </Link>
                    </h3>
                    <ul className="space-y-3">
                      {recentActivity.recentLocations.map((location: any) => (
                        <li key={location.id}>
                          <Link
                            href={`/location/${location.id}`}
                            className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          >
                            <span className="text-2xl">📍</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {location.name}
                              </p>
                              <p className="text-xs text-slate-400">
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
                  <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-slate-100">
                      Recent Items
                      <Link href="/items" className="text-sm text-emerald-400 hover:text-emerald-300 font-normal">
                        View all →
                      </Link>
                    </h3>
                    <ul className="space-y-3">
                      {recentActivity.recentItems.map((item: any) => (
                        <li key={item.id}>
                          <Link
                            href={`/item/${item.id}`}
                            className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          >
                            <span className="text-2xl">📦</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400">
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
        <div className="min-h-screen">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-100 mb-4">
                Welcome to QRganize
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Smart location & item tracking with QR codes
              </p>
            </div>

            <div className="mt-12">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-slate-100">
                Get started with QRganize
              </h2>
              <p className="text-slate-400 mb-8">
                Sign up for a free account to start organizing your items with QR codes
              </p>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 font-semibold"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold mb-2 text-slate-100">Hierarchical Organization</h3>
                <p className="text-slate-400 text-sm">
                  Organize locations in a tree structure - house, room, shelf, box
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2 text-slate-100">QR Code Scanning</h3>
                <p className="text-slate-400 text-sm">
                  Instantly find items by scanning QR codes with your phone
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-lg font-semibold mb-2 text-slate-100">Cloud Sync</h3>
                <p className="text-slate-400 text-sm">
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
