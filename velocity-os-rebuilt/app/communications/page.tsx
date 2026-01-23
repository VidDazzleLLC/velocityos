import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function CommunicationsPage() {
  // Mock communication campaigns
  const campaigns = [
    { id: 1, name: 'Welcome Series', type: 'Email', status: 'Active', sent: 1250, opened: 850 },
    { id: 2, name: 'Product Launch', type: 'Email', status: 'Scheduled', sent: 0, opened: 0 },
    { id: 3, name: 'Customer Survey', type: 'SMS', status: 'Active', sent: 500, opened: 320 },
  ]

  return (
    <AuthenticatedLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Communications</h1>
        <button className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
          + New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                campaign.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-800">{campaign.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sent:</span>
                <span className="font-medium text-gray-800">{campaign.sent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Opened:</span>
                <span className="font-medium text-gray-800">{campaign.opened}</span>
              </div>
              {campaign.sent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Open Rate:</span>
                  <span className="font-medium text-green-600">
                    {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <button className="w-full py-2 border-2 border-[#667eea] text-[#667eea] font-medium rounded-lg hover:bg-[#667eea] hover:text-white transition-all">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Message Templates Section - Placeholder for future implementation */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Message Templates</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No message templates yet</p>
          <button className="mt-4 px-6 py-2 border-2 border-[#667eea] text-[#667eea] font-medium rounded-lg hover:bg-[#667eea] hover:text-white transition-all">
            Create Template
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
