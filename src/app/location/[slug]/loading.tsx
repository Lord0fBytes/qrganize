import SkeletonDetailHeader from '@/components/SkeletonDetailHeader'
import SkeletonCard from '@/components/SkeletonCard'

export default function LocationDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Location Detail Header */}
      <SkeletonDetailHeader />

      {/* Child Locations Section */}
      <div className="mt-8">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={`loc-${i}`} />
          ))}
        </div>
      </div>

      {/* Items in Location Section */}
      <div className="mt-8">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={`item-${i}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
