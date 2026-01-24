'use client'

import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { clearAuthCookie } from '@/lib/auth'
import { signOut } from 'firebase/auth'

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
  const router = useRouter()
  const title = getPageTitle(pathname)

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      await clearAuthCookie()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00D4FF] flex items-center justify-center text-white font-semibold">
            {auth?.currentUser?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">{auth?.currentUser?.email || 'User'}</p>
            <button 
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
