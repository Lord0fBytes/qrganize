import SkeletonCard from '@/components/SkeletonCard'

export default function LocationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-72 animate-pulse"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-40 animate-pulse"></div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
