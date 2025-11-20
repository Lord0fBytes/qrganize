import { createLocation } from '@/app/actions/locations'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const parentId = params.parent

  // If there's a parent, get its name for display
  let parentName = null
  if (parentId) {
    const { data } = await supabase
      .from('locations')
      .select('name')
      .eq('id', parentId)
      .single()
    parentName = data?.name
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Location
          </h1>
          {parentName && (
            <p className="mt-2 text-gray-600">
              Inside: <span className="font-medium">{parentName}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form>
            <input type="hidden" name="parent_id" value={parentId || ''} />

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g., Living Room, Garage, Box #12"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="Add any additional details about this location"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                formAction={createLocation}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Create Location
              </button>
              <Link
                href={parentId ? `/location/${parentId}` : '/locations'}
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
