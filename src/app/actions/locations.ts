'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { generateSlug } from '@/lib/slugify'

export async function getLocations(parentId?: string | null) {
  try {
    let locations
    if (parentId === null) {
      locations = await sql`
        SELECT * FROM locations WHERE parent_id IS NULL ORDER BY name ASC
      `
    } else if (parentId) {
      locations = await sql`
        SELECT * FROM locations WHERE parent_id = ${parentId} ORDER BY name ASC
      `
    } else {
      locations = await sql`
        SELECT * FROM locations ORDER BY name ASC
      `
    }
    return { locations, error: null }
  } catch (e: any) {
    return { locations: [], error: e.message }
  }
}

export async function getLocation(slug: string) {
  try {
    const [location] = await sql`
      SELECT * FROM locations WHERE slug = ${slug}
    `
    return { location: location || null, error: null }
  } catch (e: any) {
    return { location: null, error: e.message }
  }
}

export async function getLocationPath(locationId: string): Promise<Array<{ id: string; slug: string; name: string }>> {
  const path: Array<{ id: string; slug: string; name: string }> = []
  let currentId: string | null = locationId

  while (currentId) {
    const rows: Array<{ id: string; slug: string; name: string; parent_id: string | null }> = await sql`
      SELECT id, slug, name, parent_id FROM locations WHERE id = ${currentId}
    `
    const row = rows[0]
    if (!row) break
    path.unshift({ id: row.id, slug: row.slug, name: row.name })
    currentId = row.parent_id
  }

  return path
}

export async function createLocation(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const parentId = formData.get('parent_id') as string | null
  const customSlug = formData.get('slug') as string

  let slug = customSlug?.trim() ? customSlug.trim() : generateSlug(name)
  let finalSlug = slug
  let counter = 0

  while (true) {
    const [existing] = await sql`SELECT id FROM locations WHERE slug = ${finalSlug}`
    if (!existing) break
    counter++
    finalSlug = `${slug}-${counter}`
  }

  const [data] = await sql`
    INSERT INTO locations (name, slug, description, parent_id)
    VALUES (${name}, ${finalSlug}, ${description || null}, ${parentId || null})
    RETURNING *
  `

  revalidatePath('/locations')
  if (parentId) revalidatePath(`/location/${parentId}`)

  redirect(`/location/${data.slug}`)
}

export async function updateLocation(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const customSlug = formData.get('slug') as string

  let slug = customSlug?.trim() ? customSlug.trim() : generateSlug(name)
  let finalSlug = slug
  let counter = 0

  while (true) {
    const [existing] = await sql`SELECT id FROM locations WHERE slug = ${finalSlug} AND id != ${id}`
    if (!existing) break
    counter++
    finalSlug = `${slug}-${counter}`
  }

  await sql`
    UPDATE locations
    SET name = ${name}, slug = ${finalSlug}, description = ${description || null}
    WHERE id = ${id}
  `

  revalidatePath('/locations')
  revalidatePath(`/location/${finalSlug}`)

  redirect(`/location/${finalSlug}`)
}

export async function deleteLocation(id: string) {
  const [location] = await sql`SELECT parent_id FROM locations WHERE id = ${id}`

  let parentSlug: string | null = null
  if (location?.parent_id) {
    const [parent] = await sql`SELECT slug FROM locations WHERE id = ${location.parent_id}`
    parentSlug = parent?.slug || null
  }

  await sql`DELETE FROM locations WHERE id = ${id}`

  revalidatePath('/locations')
  if (parentSlug) {
    revalidatePath(`/location/${parentSlug}`)
    redirect(`/location/${parentSlug}`)
  } else {
    redirect('/locations')
  }
}
