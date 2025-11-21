'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Home, MapPin, Package, Search, ScanLine, Settings, Menu, X } from 'lucide-react'

interface SidebarProps {
  user: {
    email?: string | undefined
  } | null
}

export function Sidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const pathname = usePathname()

  const userName = user?.email?.split('@')[0] || 'Guest'

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/locations', label: 'Locations', icon: MapPin },
    { href: '/items', label: 'Items', icon: Package },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/scan', label: 'Scan', icon: ScanLine },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const createOptions = [
    { href: '/items/new', label: 'Item / Asset' },
    { href: '/locations/new', label: 'Location' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white
          w-72 z-40 transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
          flex flex-col
        `}
      >
        {/* User Section */}
        <div className="p-6 border-b border-gray-800">
          <p className="text-sm text-gray-400 mb-3 text-center">Welcome, {userName}</p>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Create Button with Dropdown */}
        <div className="p-4">
          <div className="relative">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="text-xl">+</span>
              <span>Create</span>
            </button>

            {/* Dropdown Menu */}
            {isCreateOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsCreateOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
                  {createOptions.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      onClick={() => {
                        setIsCreateOpen(false)
                        setIsOpen(false)
                      }}
                      className="block px-4 py-3 text-sm hover:bg-gray-700 transition-colors"
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors
                  ${
                    isActive(item.href)
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Only: User Info & Sign Out */}
        <div className="lg:hidden p-4 border-t border-gray-800">
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-1">Signed in as</p>
            <p className="text-sm text-white truncate">{user?.email}</p>
          </div>
          <form>
            <button
              formAction={logout}
              className="w-full text-sm px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Desktop Only: Version Footer */}
        <div className="hidden lg:block p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">
            QRganize v0.7.0
          </div>
        </div>
      </aside>
    </>
  )
}
