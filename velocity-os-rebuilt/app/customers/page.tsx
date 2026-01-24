import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function CustomersPage() {
  return (
    <AuthenticatedLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Management</h2>
        <p className="text-gray-600">
          Manage your customer relationships and track engagement.
        </p>
        
        {/* Placeholder for customer list */}
        <div className="mt-6 space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Example Customer</h3>
            <p className="text-sm text-gray-500">customer@example.com</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
