import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function CommunicationsPage() {
  return (
    <AuthenticatedLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communications Hub</h2>
        <p className="text-gray-600">
          Manage all your customer communications in one place.
        </p>
        
        {/* Placeholder for communications */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">No recent communications</p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
