import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-slate-100">
            QRganize
          </Link>
        </div>
      </div>
    </header>
  )
}
