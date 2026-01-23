'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { AnalyticsDashboard } from '@/types/api';

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

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard</h1>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '1rem' }}>Loading dashboard...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard</h1>
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px'
        }}>
          <p style={{ color: '#c00', fontWeight: 'bold' }}>Error: {error}</p>
          <button 
            onClick={fetchDashboard}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      
      <div style={{ 
        marginTop: '2rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Total Customers
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
            {data?.totalCustomers || 0}
          </p>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Active Campaigns
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {data?.activeCampaigns || 0}
          </p>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Revenue
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            ${data?.revenue?.toLocaleString() || 0}
          </p>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Conversion Rate
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
            {data?.conversionRate || 0}%
          </p>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            Tasks Completed
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
            {data?.tasksCompleted || 0}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
      </div>
    </div>
  );
}
