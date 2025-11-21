export default function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      {/* Title */}
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4"></div>

      {/* Number/stat */}
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-4"></div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>
    </div>
  )
}
