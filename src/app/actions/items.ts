'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getItems(locationId?: string | null) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { items: [], error: 'Not authenticated' }
  }

  const query = supabase
    .from('items')
    .select('*, location:locations(id, name)')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (locationId !== undefined) {
    if (locationId === null) {
      query.is('location_id', null)
    } else {
      query.eq('location_id', locationId)
    }
  }

  const { data, error } = await query

  if (error) {
    return { items: [], error: error.message }
  }

  return { items: data || [], error: null }
}

export async function getItem(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { item: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('items')
    .select('*, location:locations(id, name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { item: null, error: error.message }
  }

  return { item: data, error: null }
}

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string

  const { data, error } = await supabase
    .from('items')
    .insert({
      name,
      description: description || null,
      location_id: locationId || null,
      quantity: quantity ? parseInt(quantity) : 1,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  if (locationId) {
    revalidatePath(`/location/${locationId}`)
  }

  redirect(`/item/${data.id}`)
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const locationId = formData.get('location_id') as string | null
  const quantity = formData.get('quantity') as string

  // Get old location for cache invalidation
  const { data: oldItem } = await supabase
    .from('items')
    .select('location_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('items')
    .update({
      name,
      description: description || null,
      location_id: locationId || null,
      quantity: quantity ? parseInt(quantity) : 1,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  revalidatePath(`/item/${id}`)

  // Invalidate old and new location pages
  if (oldItem?.location_id) {
    revalidatePath(`/location/${oldItem.location_id}`)
  }
  if (locationId) {
    revalidatePath(`/location/${locationId}`)
  }

  redirect(`/item/${id}`)
}

export async function deleteItem(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get the location_id before deleting
  const { data: item } = await supabase
    .from('items')
    .select('location_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/items')
  if (item?.location_id) {
    revalidatePath(`/location/${item.location_id}`)
    redirect(`/location/${item.location_id}`)
  } else {
    redirect('/items')
  }
}
