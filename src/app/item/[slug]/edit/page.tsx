import { getItem, updateItem } from '@/app/actions/items'
import { getLocations } from '@/app/actions/locations'
import { redirect } from 'next/navigation'
import { ItemForm } from '@/components/ItemForm'

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { item, error } = await getItem(slug)

  if (error || !item) {
    redirect('/items')
  }

  const itemId = item!.id
  const { locations: allLocationsRaw } = await getLocations()
  const allLocations = allLocationsRaw as Array<{ id: string; name: string }>

  async function updateItemWithId(formData: FormData) {
    'use server'
    return updateItem(itemId, formData)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Edit Item</h1>
          <p className="mt-2 text-slate-400">Update item details and location</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
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
