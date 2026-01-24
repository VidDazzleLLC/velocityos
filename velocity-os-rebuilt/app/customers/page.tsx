'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Customer, CreateCustomerPayload } from '@/types/api';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

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
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            {showForm ? 'Cancel' : '+ Add Customer'}
          </button>
        </div>

        {formSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-green-800">
            ✓ Customer created successfully!
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Customer</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors"
                />
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-red-800">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  formSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:shadow-lg'
                }`}
              >
                {formSubmitting ? 'Creating...' : 'Create Customer'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-[#00D4FF] rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800 font-semibold">Error: {error}</p>
            <button
              onClick={fetchCustomers}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-xl text-gray-600">No customers yet</p>
            <p className="mt-2 text-gray-500">
              Click "Add Customer" to create your first customer
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Created At</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{customer.name}</td>
                    <td className="px-6 py-4">{customer.email}</td>
                    <td className="px-6 py-4">{customer.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
