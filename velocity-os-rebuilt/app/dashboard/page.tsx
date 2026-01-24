'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { AnalyticsDashboard } from '@/types/api';
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboardData = await apiClient.getAnalyticsDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <AuthenticatedLayout>
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white p-6 rounded-xl mb-8">
        <h4 className="text-lg font-semibold mb-2">🤖 AI Insight</h4>
        <p className="text-white/90">
          Your conversion rate is up 15% this week. Consider scaling your marketing budget on high-performing campaigns.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800 font-semibold mb-4">Error: {error}</p>
          <button 
            onClick={fetchDashboard}
            className="px-6 py-2 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Total Customers</h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">{data?.totalCustomers || 0}</div>
              <div className="text-sm text-green-600">↑ Active</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Active Campaigns</h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">{data?.activeCampaigns || 0}</div>
              <div className="text-sm text-green-600">↑ Running</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                ${data?.revenue?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-green-600">↑ 12% from last month</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Conversion Rate</h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">{data?.conversionRate || 0}%</div>
              <div className="text-sm text-green-600">↑ 15% from last week</div>
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
                    <div className="font-medium text-gray-800">Dashboard metrics loaded</div>
                    <div className="text-sm text-gray-500">Just now</div>
                  </div>
                  <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Complete
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-800">API connected successfully</div>
                    <div className="text-sm text-gray-500">Just now</div>
                  </div>
                  <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Complete
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">System ready</div>
                    <div className="text-sm text-gray-500">Now</div>
                  </div>
                  <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <a href="/customers" className="block w-full py-3 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center">
                  View Customers
                </a>
                <a href="/communications" className="block w-full py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-white transition-all text-center">
                  Start Campaign
                </a>
                <a href="/feedback" className="block w-full py-3 border-2 border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-white transition-all text-center">
                  Give Feedback
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthenticatedLayout>
  )
}
