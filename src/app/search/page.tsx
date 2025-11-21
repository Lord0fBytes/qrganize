import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SearchInterface } from '@/components/SearchInterface'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const initialQuery = params.q || ''
  const initialFilter = (params.filter as 'all' | 'items' | 'locations') || 'all'

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Search</h1>
          <p className="mt-2 text-slate-400">
            Search for items and locations by name or description
          </p>
        </div>

        <SearchInterface initialQuery={initialQuery} initialFilter={initialFilter} />
      </div>
    </div>
  )
}
