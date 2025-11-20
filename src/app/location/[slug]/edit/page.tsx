import { getLocation, updateLocation } from '@/app/actions/locations'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LocationForm } from '@/components/LocationForm'

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { slug } = await params
  const { location, error } = await getLocation(slug)

  if (error || !location) {
    redirect('/locations')
  }

  async function updateLocationWithId(formData: FormData) {
    'use server'
    return updateLocation(location.id, formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Location</h1>
          <p className="mt-2 text-gray-600">Update location details</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <LocationForm
            mode="edit"
            initialData={{
              name: location.name,
              slug: location.slug,
              description: location.description
            }}
            onSubmit={updateLocationWithId}
            cancelHref={`/location/${slug}`}
          />
        </div>
      </div>
    </div>
  )
}
