'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Communications', href: '/communications', icon: '💬' },
    { name: 'Reports', href: '/reports', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Feedback', href: '/feedback', icon: '⭐' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] bg-clip-text text-transparent">
          VelocityOS
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <div className="font-medium text-gray-800">User</div>
            <div className="text-sm text-gray-500">user@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
