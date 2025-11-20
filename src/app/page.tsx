import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
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

        {user ? (
          /* Authenticated User View */
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome back, {user.email}!
              </h2>
              <p className="text-gray-600 mb-6">
                Get started by creating your first location or item.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/locations"
                  className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="text-lg font-semibold mb-2">Locations</h3>
                  <p className="text-gray-600 text-sm">
                    Organize your spaces hierarchically - from rooms to boxes
                  </p>
                </Link>

                <Link
                  href="/items"
                  className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="text-3xl mb-2">📦</div>
                  <h3 className="text-lg font-semibold mb-2">Items</h3>
                  <p className="text-gray-600 text-sm">
                    Track your items and assign them to locations
                  </p>
                </Link>

                <Link
                  href="/scan"
                  className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="text-3xl mb-2">📷</div>
                  <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-gray-600 text-sm">
                    Instantly navigate to locations or items by scanning
                  </p>
                </Link>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🏷️</div>
                  <h3 className="text-lg font-semibold mb-2">Generate Labels</h3>
                  <p className="text-gray-600 text-sm">
                    Print QR code labels for your locations and items
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Coming soon:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dashboard with statistics</li>
                <li>• Search across all locations and items</li>
                <li>• Batch QR code generation</li>
                <li>• Export/import data</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Unauthenticated User View */
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
        )}
      </main>
    </div>
  );
}
