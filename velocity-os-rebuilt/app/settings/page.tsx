import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
        <p className="text-gray-600">
          Configure your account and application preferences.
        </p>
        
        {/* Settings sections */}
        <div className="mt-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Settings</h3>
            <p className="text-sm text-gray-500">Update your profile information</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
            <p className="text-sm text-gray-500">Manage your password and security settings</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
            <p className="text-sm text-gray-500">Configure notification preferences</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
