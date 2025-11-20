import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSettings } from '@/app/actions/settings'

export default async function LegacyQRRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Require authentication
  if (!user) {
    redirect('/login')
  }

  const { slug } = await params

  // Get user settings
  const { settings, error: settingsError } = await getSettings()

  // If settings error or legacy QR is disabled, show 404
  if (settingsError || !settings || !settings.legacy_qr_enabled) {
    redirect('/')
  }

  const targetTable = settings.legacy_qr_target

  // Look up the slug in the target table
  if (targetTable === 'items') {
    const { data: item } = await supabase
      .from('items')
      .select('slug')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .single()

    if (item) {
      // Item found - redirect to item page
      redirect(`/item/${slug}`)
    } else {
      // Item not found - redirect to create form with pre-filled slug
      redirect(`/items/new?slug=${encodeURIComponent(slug)}`)
    }
  } else {
    // Target is locations
    const { data: location } = await supabase
      .from('locations')
      .select('slug')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .single()

    if (location) {
      // Location found - redirect to location page
      redirect(`/location/${slug}`)
    } else {
      // Location not found - redirect to create form with pre-filled slug
      redirect(`/locations/new?slug=${encodeURIComponent(slug)}`)
    }
  }
}
