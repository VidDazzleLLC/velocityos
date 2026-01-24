import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function ReportsPage() {
  return (
    <AuthenticatedLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-2">View and generate business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Report */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Report</h3>
          <p className="text-gray-600 mb-4">Track your revenue over time</p>
          <button className="w-full py-2 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Generate
          </button>
        </div>

        {/* Customer Analytics */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Analytics</h3>
          <p className="text-gray-600 mb-4">Analyze customer behavior and trends</p>
          <button className="w-full py-2 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Generate
          </button>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h3>
          <p className="text-gray-600 mb-4">Review marketing campaign results</p>
          <button className="w-full py-2 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Generate
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No reports generated yet</p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
