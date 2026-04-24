import { createItem } from '@/app/actions/items'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ItemForm } from '@/components/ItemForm'

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
  searchParams: Promise<{ location?: string; slug?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const locationId = params.location
  const prefilledSlug = params.slug

  // Get all locations for the dropdown
  const allLocations = await getAllLocations()

  // If there's a pre-selected location, get its name
  let selectedLocation = null
  if (locationId) {
    selectedLocation = allLocations.find(loc => loc.id === locationId)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Create New Item
          </h1>
          {selectedLocation && (
            <p className="mt-2 text-slate-400">
              In location: <span className="font-medium">{selectedLocation.name}</span>
            </p>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          {prefilledSlug && (
            <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <p className="text-sm text-blue-200">
                <span className="font-medium">Legacy QR Code detected!</span> Creating item with slug: <code className="bg-blue-800/50 px-2 py-1 rounded">{prefilledSlug}</code>
              </p>
            </div>
          )}
          <ItemForm
            mode="new"
            allLocations={allLocations}
            preselectedLocationId={locationId}
            prefilledSlug={prefilledSlug}
            onSubmit={createItem}
            cancelHref={locationId ? `/location/${locationId}` : '/items'}
          />
        </div>
      </div>
    </div>
  )
}
