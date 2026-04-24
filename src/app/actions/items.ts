'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { generateSlug } from '@/lib/slugify'

export async function getItems(locationId?: string | null) {
  try {
    let items
    if (locationId === null) {
      items = await sql`
        SELECT i.*, row_to_json(l) as location
        FROM items i
        LEFT JOIN locations l ON i.location_id = l.id
        WHERE i.location_id IS NULL
        ORDER BY i.name ASC
      `
    } else if (locationId) {
      items = await sql`
        SELECT i.*, row_to_json(l) as location
        FROM items i
        LEFT JOIN locations l ON i.location_id = l.id
        WHERE i.location_id = ${locationId}
        ORDER BY i.name ASC
      `
    } else {
      items = await sql`
        SELECT i.*, row_to_json(l) as location
        FROM items i
        LEFT JOIN locations l ON i.location_id = l.id
        ORDER BY i.name ASC
      `
    }
    return { items, error: null }
  } catch (e: any) {
    return { items: [], error: e.message }
  }
}

export async function getItem(slug: string) {
  try {
    const [item] = await sql`
      SELECT i.*, row_to_json(l) as location
      FROM items i
      LEFT JOIN locations l ON i.location_id = l.id
      WHERE i.slug = ${slug}
    `
    return { item: item || null, error: null }
  } catch (e: any) {
    return { item: null, error: e.message }
  }
}

export async function createItem(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string
  const customSlug = formData.get('slug') as string

  let slug = customSlug?.trim() ? customSlug.trim() : generateSlug(name)
  let finalSlug = slug
  let counter = 0

  while (true) {
    const [existing] = await sql`SELECT id FROM items WHERE slug = ${finalSlug}`
    if (!existing) break
    counter++
    finalSlug = `${slug}-${counter}`
  }

  let locationSlug: string | null = null
  if (locationId) {
    const [loc] = await sql`SELECT slug FROM locations WHERE id = ${locationId}`
    locationSlug = loc?.slug || null
  }

  const [data] = await sql`
    INSERT INTO items (name, slug, description, location_id, quantity)
    VALUES (${name}, ${finalSlug}, ${description || null}, ${locationId || null}, ${quantity ? parseInt(quantity) : 1})
    RETURNING *
  `

  revalidatePath('/items')
  if (locationSlug) revalidatePath(`/location/${locationSlug}`)

  redirect(`/item/${data.slug}`)
}

export async function updateItem(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string
  const customSlug = formData.get('slug') as string

  let slug = customSlug?.trim() ? customSlug.trim() : generateSlug(name)
  let finalSlug = slug
  let counter = 0

  while (true) {
    const [existing] = await sql`SELECT id FROM items WHERE slug = ${finalSlug} AND id != ${id}`
    if (!existing) break
    counter++
    finalSlug = `${slug}-${counter}`
  }

  const [oldItem] = await sql`SELECT location_id FROM items WHERE id = ${id}`
  let oldLocationSlug: string | null = null
  let newLocationSlug: string | null = null

  if (oldItem?.location_id) {
    const [loc] = await sql`SELECT slug FROM locations WHERE id = ${oldItem.location_id}`
    oldLocationSlug = loc?.slug || null
  }
  if (locationId) {
    const [loc] = await sql`SELECT slug FROM locations WHERE id = ${locationId}`
    newLocationSlug = loc?.slug || null
  }

  await sql`
    UPDATE items
    SET name = ${name}, slug = ${finalSlug}, description = ${description || null},
        location_id = ${locationId || null}, quantity = ${quantity ? parseInt(quantity) : 1}
    WHERE id = ${id}
  `

  revalidatePath('/items')
  revalidatePath(`/item/${finalSlug}`)
  if (oldLocationSlug) revalidatePath(`/location/${oldLocationSlug}`)
  if (newLocationSlug) revalidatePath(`/location/${newLocationSlug}`)

  redirect(`/item/${finalSlug}`)
}

export async function deleteItem(id: string) {
  const [item] = await sql`SELECT location_id FROM items WHERE id = ${id}`

  let locationSlug: string | null = null
  if (item?.location_id) {
    const [loc] = await sql`SELECT slug FROM locations WHERE id = ${item.location_id}`
    locationSlug = loc?.slug || null
  }

  await sql`DELETE FROM items WHERE id = ${id}`

  revalidatePath('/items')
  if (locationSlug) {
    revalidatePath(`/location/${locationSlug}`)
    redirect(`/location/${locationSlug}`)
  } else {
    redirect('/items')
  }
}
