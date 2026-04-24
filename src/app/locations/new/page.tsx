import { createLocation, getLocation } from '@/app/actions/locations'
import { LocationForm } from '@/components/LocationForm'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string; slug?: string }>
}) {
  const params = await searchParams
  const parentId = params.parent
  const prefilledSlug = params.slug

  let parentName = null
  if (parentId) {
    const { location } = await getLocation(parentId)
    parentName = location?.name || null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Create New Location</h1>
          {parentName && (
            <p className="mt-2 text-slate-400">
              Inside: <span className="font-medium">{parentName}</span>
            </p>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          {prefilledSlug && (
            <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <p className="text-sm text-blue-200">
                <span className="font-medium">Legacy QR Code detected!</span> Creating location with slug: <code className="bg-blue-800/50 px-2 py-1 rounded">{prefilledSlug}</code>
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
