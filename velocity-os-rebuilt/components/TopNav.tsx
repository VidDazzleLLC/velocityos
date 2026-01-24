'use client'

export default function TopNav() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] w-64"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-xl">🔔</span>
        </button>
      </div>
    </div>
  )
}
