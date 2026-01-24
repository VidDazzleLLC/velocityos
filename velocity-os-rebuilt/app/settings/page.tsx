import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              placeholder="Company Name"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Email notifications</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Push notifications</span>
            <input type="checkbox" className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Weekly reports</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
          Save Changes
        </button>
      </div>
    </AuthenticatedLayout>
  )
}
