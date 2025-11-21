export default function SkeletonSearchResults() {
  return (
    <div className="space-y-6">
      {/* Items Section */}
      <div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-3 animate-pulse"></div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm divide-y divide-slate-200 dark:divide-slate-700">
          {[...Array(3)].map((_, i) => (
            <div key={`item-${i}`} className="p-4 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded ml-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locations Section */}
      <div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-3 animate-pulse"></div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm divide-y divide-slate-200 dark:divide-slate-700">
          {[...Array(3)].map((_, i) => (
            <div key={`loc-${i}`} className="p-4 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded ml-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
