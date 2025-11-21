export default function SkeletonListItem() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-3"></div>

          {/* Description/metadata */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
          </div>
        </div>

        {/* Action button placeholder */}
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded ml-4"></div>
      </div>
    </div>
  )
}
