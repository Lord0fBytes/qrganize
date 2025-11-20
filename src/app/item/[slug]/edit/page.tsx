import { getItem, updateItem } from '@/app/actions/items'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ItemForm } from '@/components/ItemForm'

async function getAllLocations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('locations')
    .select('id, name, parent_id')
    .order('name', { ascending: true })

  return data || []
}

export default async function EditItemPage({
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
  const { item, error } = await getItem(slug)

  if (error || !item) {
    redirect('/items')
  }

  const allLocations = await getAllLocations()

  async function updateItemWithId(formData: FormData) {
    'use server'
    return updateItem(item.id, formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="mt-2 text-gray-600">Update item details and location</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ItemForm
            mode="edit"
            initialData={{
              name: item.name,
              slug: item.slug,
              description: item.description,
              quantity: item.quantity,
              location_id: item.location_id
            }}
            allLocations={allLocations}
            onSubmit={updateItemWithId}
            cancelHref={`/item/${slug}`}
          />
        </div>
      </div>
    </div>
  )
}
