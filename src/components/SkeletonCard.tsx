export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>

      {/* Footer/metadata */}
      <div className="flex gap-4 mt-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    </div>
  )
}
