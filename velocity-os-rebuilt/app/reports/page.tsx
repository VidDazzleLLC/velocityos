import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function ReportsPage() {
  return (
    <AuthenticatedLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sales Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Track sales performance, revenue trends, and conversion metrics.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">
            Analyze customer behavior, retention, and lifetime value.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Growth Metrics</h3>
          <p className="text-sm text-gray-600 mb-4">
            Monitor user growth, engagement, and key business metrics.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Campaign Performance</h3>
          <p className="text-sm text-gray-600 mb-4">
            Measure email, SMS, and marketing campaign effectiveness.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Insights</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get AI-powered recommendations and predictive analytics.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Financial Overview</h3>
          <p className="text-sm text-gray-600 mb-4">
            Review revenue, expenses, and profitability metrics.
          </p>
          <button className="text-[#667eea] font-medium hover:text-[#764ba2]">
            View Report →
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Reports</h2>
        <p className="text-gray-600 mb-4">
          Generate and download reports in various formats.
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Export to PDF
          </button>
          <button className="px-6 py-2 border-2 border-[#667eea] text-[#667eea] font-semibold rounded-lg hover:bg-[#667eea] hover:text-white transition-all">
            Export to CSV
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
