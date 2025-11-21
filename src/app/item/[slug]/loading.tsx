import SkeletonDetailHeader from '@/components/SkeletonDetailHeader'

export default function ItemDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Item Detail Header */}
      <SkeletonDetailHeader />

      {/* Location Section */}
      <div className="mt-8">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4 animate-pulse"></div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 animate-pulse">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
        </div>
      </div>
    </div>
  )
}
