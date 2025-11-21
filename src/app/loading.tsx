import SkeletonStatCard from '@/components/SkeletonStatCard'
import SkeletonListItem from '@/components/SkeletonListItem'

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 animate-pulse"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Locations */}
        <div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        </div>

        {/* Recent Items */}
        <div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
