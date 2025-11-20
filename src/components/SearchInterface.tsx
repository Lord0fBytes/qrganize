'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchItems, type SearchFilter, type SearchResults } from '@/app/actions/search'

interface SearchInterfaceProps {
  initialQuery: string
  initialFilter: SearchFilter
}

export function SearchInterface({ initialQuery, initialFilter }: SearchInterfaceProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<SearchFilter>(initialFilter)
  const [results, setResults] = useState<SearchResults>({ items: [], locations: [], totalCount: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialFilter)
    }
  }, [initialQuery, initialFilter])

  const performSearch = async (searchQuery: string, searchFilter: SearchFilter) => {
    if (!searchQuery.trim()) {
      setResults({ items: [], locations: [], totalCount: 0 })
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    const { results: searchResults, error: searchError } = await searchItems(searchQuery, searchFilter)

    if (searchError) {
      setError(searchError)
    } else {
      setResults(searchResults)
    }

    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filter !== 'all') params.set('filter', filter)
    router.push(`/search?${params.toString()}`)
    performSearch(query, filter)
  }

  const handleFilterChange = (newFilter: SearchFilter) => {
    setFilter(newFilter)
    if (query) {
      const params = new URLSearchParams()
      params.set('q', query)
      if (newFilter !== 'all') params.set('filter', newFilter)
      router.push(`/search?${params.toString()}`)
      performSearch(query, newFilter)
    }
  }

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items and locations..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({results.totalCount})
        </button>
        <button
          onClick={() => handleFilterChange('items')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            filter === 'items'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Items ({results.items.length})
        </button>
        <button
          onClick={() => handleFilterChange('locations')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            filter === 'locations'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Locations ({results.locations.length})
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && !error && (
        <div>
          {results.totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items Results */}
              {(filter === 'all' || filter === 'items') && results.items.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Items ({results.items.length})
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                    {results.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/item/${item.slug}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📦</span>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.name}
                              </h3>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                            {item.location && (
                              <p className="mt-1 text-sm text-gray-500">
                                Location: <span className="font-medium">{item.location.name}</span>
                              </p>
                            )}
                          </div>
                          <svg
                            className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations Results */}
              {(filter === 'all' || filter === 'locations') && results.locations.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Locations ({results.locations.length})
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                    {results.locations.map((location) => (
                      <Link
                        key={location.id}
                        href={`/location/${location.slug}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📍</span>
                              <h3 className="text-lg font-medium text-gray-900">
                                {location.name}
                              </h3>
                            </div>
                            {location.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {location.description}
                              </p>
                            )}
                            {location.parent && (
                              <p className="mt-1 text-sm text-gray-500">
                                Parent: <span className="font-medium">{location.parent.name}</span>
                              </p>
                            )}
                          </div>
                          <svg
                            className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-600">
            Enter a search term to find items and locations
          </p>
        </div>
      )}
    </div>
  )
}
