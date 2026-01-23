'use client'

import { usePathname } from 'next/navigation'

const getPageTitle = (pathname: string) => {
  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/communications': 'Communications',
    '/reports': 'Reports & Analytics',
    '/settings': 'Settings',
  }
  return titles[pathname] || 'Dashboard'
}

export default function TopNav() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-xl">🔔</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
