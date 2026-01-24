import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function ReportsPage() {
  return (
    <AuthenticatedLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
        <p className="text-gray-600">
          View detailed analytics and generate custom reports.
        </p>
        
        {/* Placeholder for reports */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Sales Report</h3>
            <p className="text-sm text-gray-500">Generate monthly sales reports</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Customer Insights</h3>
            <p className="text-sm text-gray-500">Analyze customer behavior</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
