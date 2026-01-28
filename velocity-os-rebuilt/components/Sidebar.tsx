'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Customers', path: '/customers', icon: '👥' },
  { name: 'Communications', path: '/communications', icon: '💬' },
  { name: 'Reports', path: '/reports', icon: '📈' },
  { name: 'Terminal', path: '/terminal', icon: '⌨️' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gradient-to-br from-[#7B61FF] to-[#00D4FF] text-white fixed h-screen p-8">
      <h1 className="text-3xl font-bold mb-10">VelocityOS</h1>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
