export default function SkeletonDetailHeader() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>

      {/* Title */}
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    </div>
  )
}
