import { redirect } from 'next/navigation'
import { getSettings } from '@/app/actions/settings'
import { sql } from '@/lib/db'

export default async function LegacyQRRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { settings, error } = await getSettings()

  if (error || !settings || !settings.legacy_qr_enabled) {
    redirect('/')
  }

  if (settings.legacy_qr_target === 'items') {
    const [item] = await sql`SELECT slug FROM items WHERE slug = ${slug}`
    redirect(item ? `/item/${slug}` : `/items/new?slug=${encodeURIComponent(slug)}`)
  } else {
    const [location] = await sql`SELECT slug FROM locations WHERE slug = ${slug}`
    redirect(location ? `/location/${slug}` : `/locations/new?slug=${encodeURIComponent(slug)}`)
  }
}
