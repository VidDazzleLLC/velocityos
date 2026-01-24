import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white p-6 rounded-xl mb-8">
        <h4 className="text-lg font-semibold mb-2">🤖 AI Insight</h4>
        <p className="text-white/90">
          Your conversion rate is up 15% this week. Consider scaling your marketing budget on high-performing campaigns.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">$45,231</div>
          <div className="text-sm text-green-600">↑ 12% from last month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">2,345</div>
          <div className="text-sm text-green-600">↑ 8% from last month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">3.2%</div>
          <div className="text-sm text-green-600">↑ 15% from last week</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Tasks Completed</h3>
          <div className="text-3xl font-bold text-gray-800 mb-2">89</div>
          <div className="text-sm text-red-600">↓ 3% from last week</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">New customer onboarded</div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
              <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Complete
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">AI analyzed sales pipeline</div>
                <div className="text-sm text-gray-500">5 hours ago</div>
              </div>
              <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Complete
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">Email campaign sent</div>
                <div className="text-sm text-gray-500">1 day ago</div>
              </div>
              <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Complete
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full py-3 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
              Create Task
            </button>
            <button className="w-full py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-white transition-all">
              AI Report
            </button>
            <button className="w-full py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-white transition-all">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
