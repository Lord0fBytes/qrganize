'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type LegacyQRTarget = 'items' | 'locations'

export interface UserSettings {
  user_id: string
  legacy_qr_enabled: boolean
  legacy_qr_target: LegacyQRTarget
  legacy_qr_domain: string | null
  created_at: string
  updated_at: string
}

/**
 * Get user settings, creating default settings if they don't exist
 */
export async function getSettings(): Promise<{ settings: UserSettings | null; error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { settings: null, error: 'Not authenticated' }
  }

  // Try to fetch existing settings
  const { data: existingSettings, error: fetchError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (existingSettings) {
    return { settings: existingSettings, error: null }
  }

  // If settings don't exist, create default settings
  if (fetchError && fetchError.code === 'PGRST116') {
    const { data: newSettings, error: insertError } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
        legacy_qr_enabled: false,
        legacy_qr_target: 'items',
        legacy_qr_domain: null
      })
      .select()
      .single()

    if (insertError) {
      return { settings: null, error: insertError.message }
    }

    return { settings: newSettings, error: null }
  }

  return { settings: null, error: fetchError?.message || 'Unknown error' }
}

/**
 * Update user settings
 */
export async function updateSettings(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const legacy_qr_enabled = formData.get('legacy_qr_enabled') === 'true'
  const legacy_qr_target = formData.get('legacy_qr_target') as LegacyQRTarget
  const legacy_qr_domain = formData.get('legacy_qr_domain') as string | null

  // Validate legacy_qr_target
  if (legacy_qr_target !== 'items' && legacy_qr_target !== 'locations') {
    return { error: 'Invalid target type' }
  }

  // Clean up domain (remove trailing slash, whitespace)
  const cleanDomain = legacy_qr_domain?.trim().replace(/\/$/, '') || null

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      legacy_qr_enabled,
      legacy_qr_target,
      legacy_qr_domain: cleanDomain,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { error: null }
}
