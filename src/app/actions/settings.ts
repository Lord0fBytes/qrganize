'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type LegacyQRTarget = 'items' | 'locations'

export interface UserSettings {
  legacy_qr_enabled: boolean
  legacy_qr_target: LegacyQRTarget
  legacy_qr_domain: string | null
  updated_at: string
}

export async function getSettings(): Promise<{ settings: UserSettings | null; error: string | null }> {
  try {
    const rows: UserSettings[] = await sql`SELECT * FROM settings WHERE id = 1`
    return { settings: rows[0] || null, error: null }
  } catch (e: any) {
    return { settings: null, error: e.message }
  }
}

export async function updateSettings(formData: FormData) {
  const legacy_qr_enabled = formData.get('legacy_qr_enabled') === 'true'
  const legacy_qr_target = formData.get('legacy_qr_target') as LegacyQRTarget
  const legacy_qr_domain = formData.get('legacy_qr_domain') as string | null

  if (legacy_qr_target !== 'items' && legacy_qr_target !== 'locations') {
    return { error: 'Invalid target type' }
  }

  const cleanDomain = legacy_qr_domain?.trim().replace(/\/$/, '') || null

  await sql`
    INSERT INTO settings (id, legacy_qr_enabled, legacy_qr_target, legacy_qr_domain)
    VALUES (1, ${legacy_qr_enabled}, ${legacy_qr_target}, ${cleanDomain})
    ON CONFLICT (id) DO UPDATE
    SET legacy_qr_enabled = ${legacy_qr_enabled},
        legacy_qr_target = ${legacy_qr_target},
        legacy_qr_domain = ${cleanDomain}
  `

  revalidatePath('/settings')
  return { error: null }
}
