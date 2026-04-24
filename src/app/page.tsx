import { sql } from '@/lib/db'
import Link from 'next/link'

async function getStats() {
  const [locationsResult] = await sql`SELECT COUNT(*) as count FROM locations`
  const [itemsResult] = await sql`SELECT COUNT(*) as count FROM items`
  const [unassignedResult] = await sql`SELECT COUNT(*) as count FROM items WHERE location_id IS NULL`

  return {
    totalLocations: parseInt(locationsResult.count),
    totalItems: parseInt(itemsResult.count),
    unassignedItems: parseInt(unassignedResult.count),
  }
}

async function getRecentActivity() {
  const recentLocations = await sql`
    SELECT id, name, slug, created_at FROM locations ORDER BY created_at DESC LIMIT 5
  `
  const recentItems = await sql`
    SELECT i.id, i.name, i.slug, i.created_at, l.name as location_name
    FROM items i
    LEFT JOIN locations l ON i.location_id = l.id
    ORDER BY i.created_at DESC LIMIT 5
  `
  return { recentLocations, recentItems }
}

export default async function Home() {
  const [stats, recentActivity] = await Promise.all([getStats(), getRecentActivity()])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">Here&apos;s an overview of your inventory.</p>
      </div>

      {/* Statistics */}
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
            <Link href="/locations" className="flex-1 text-center px-3 py-2 bg-slate-700 text-blue-400 rounded-md hover:bg-slate-600 font-medium text-sm transition-colors">
              View all
            </Link>
            <Link href="/locations/new" className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors">
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
            <Link href="/items" className="flex-1 text-center px-3 py-2 bg-slate-700 text-emerald-400 rounded-md hover:bg-slate-600 font-medium text-sm transition-colors">
              View all
            </Link>
            <Link href="/items/new" className="flex-1 text-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium text-sm transition-colors">
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
            <Link href="/items" className="text-sm text-orange-400 hover:text-orange-300 mt-4 inline-block">
              Assign locations →
            </Link>
          ) : (
            <p className="text-sm text-emerald-400 mt-4">All items assigned!</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {(recentActivity.recentLocations.length > 0 || recentActivity.recentItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentActivity.recentLocations.length > 0 && (
            <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-slate-100">
                Recent Locations
                <Link href="/locations" className="text-sm text-blue-400 hover:text-blue-300 font-normal">View all →</Link>
              </h3>
              <ul className="space-y-3">
                {recentActivity.recentLocations.map((location: any) => (
                  <li key={location.id}>
                    <Link href={`/location/${location.slug}`} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors">
                      <span className="text-2xl">📍</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{location.name}</p>
                        <p className="text-xs text-slate-400">{new Date(location.created_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recentActivity.recentItems.length > 0 && (
            <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-slate-100">
                Recent Items
                <Link href="/items" className="text-sm text-emerald-400 hover:text-emerald-300 font-normal">View all →</Link>
              </h3>
              <ul className="space-y-3">
                {recentActivity.recentItems.map((item: any) => (
                  <li key={item.id}>
                    <Link href={`/item/${item.slug}`} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors">
                      <span className="text-2xl">📦</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.location_name ? `📍 ${item.location_name}` : 'Unassigned'} • {new Date(item.created_at).toLocaleDateString()}
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
  )
}
