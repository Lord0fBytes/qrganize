import { createItem } from '@/app/actions/items'
import { getLocations } from '@/app/actions/locations'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function getAllLocations(): Promise<Array<{ id: string; name: string; parent_id: string | null }>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('locations')
    .select('id, name, parent_id')
    .order('name', { ascending: true })

  return data || []
}

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const locationId = params.location

  // Get all locations for the dropdown
  const allLocations = await getAllLocations()

  // If there's a pre-selected location, get its name
  let selectedLocation = null
  if (locationId) {
    selectedLocation = allLocations.find(loc => loc.id === locationId)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Item
          </h1>
          {selectedLocation && (
            <p className="mt-2 text-gray-600">
              In location: <span className="font-medium">{selectedLocation.name}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Item Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g., Winter Clothes, Tools, Documents"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                  placeholder="Add any additional details about this item"
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity (optional)
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  defaultValue="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="location_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location (optional)
                </label>
                <select
                  id="location_id"
                  name="location_id"
                  defaultValue={locationId || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">No location (unassigned)</option>
                  {allLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  You can assign or change the location later
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                formAction={createItem}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Create Item
              </button>
              <Link
                href={locationId ? `/location/${locationId}` : '/items'}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
