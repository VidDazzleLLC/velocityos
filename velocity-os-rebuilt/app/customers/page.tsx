'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Customer, CreateCustomerPayload } from '@/types/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: '',
    email: '',
    phone: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customerList = await apiClient.listCustomers();
      setCustomers(customerList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      setFormError('Name and email are required');
      return;
    }
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(false);
    
    try {
      await apiClient.createCustomer(formData);
      
      // Success: reset form and refresh list
      setFormData({ name: '', email: '', phone: '' });
      setFormSuccess(true);
      setShowForm(false);
      
      // Refresh customer list
      await fetchCustomers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Customers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>

      {formSuccess && (
        <div style={{
          padding: '1rem',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#155724',
        }}>
          ✓ Customer created successfully!
        </div>
      )}

      {showForm && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Create New Customer</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            {formError && (
              <div style={{
                padding: '1rem',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                marginBottom: '1rem',
                color: '#c00',
              }}>
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={formSubmitting}
              style={{
                padding: '0.75rem 2rem',
                background: formSubmitting ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: formSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {formSubmitting ? 'Creating...' : 'Create Customer'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{ marginTop: '1rem' }}>Loading customers...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div style={{
          padding: '2rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
        }}>
          <p style={{ color: '#c00', fontWeight: 'bold' }}>Error: {error}</p>
          <button
            onClick={fetchCustomers}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Retry
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>No customers yet</p>
          <p style={{ marginTop: '0.5rem', color: '#999' }}>
            Click "Add Customer" to create your first customer
          </p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{customer.name}</td>
                  <td style={{ padding: '1rem' }}>{customer.email}</td>
                  <td style={{ padding: '1rem' }}>{customer.phone || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
      </div>
    </div>
  );
}
