import { createLocation } from '@/app/actions/locations'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LocationForm } from '@/components/LocationForm'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string; slug?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const parentId = params.parent
  const prefilledSlug = params.slug

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
          {prefilledSlug && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Legacy QR Code detected!</span> Creating location with slug: <code className="bg-blue-100 px-2 py-1 rounded">{prefilledSlug}</code>
              </p>
            </div>
          )}
          <LocationForm
            mode="new"
            parentId={parentId}
            prefilledSlug={prefilledSlug}
            onSubmit={createLocation}
            cancelHref={parentId ? `/location/${parentId}` : '/locations'}
          />
        </div>
      </div>
    </div>
  )
}
