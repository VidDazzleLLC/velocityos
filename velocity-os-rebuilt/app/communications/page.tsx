'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import type { StartCampaignPayload } from '@/types/api';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function CommunicationsPage() {
  const [formData, setFormData] = useState<StartCampaignPayload>({
    name: '',
    recipients: [],
    message: '',
  });
  const [recipientsText, setRecipientsText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRecipientsText(text);
    
    // Parse recipients (comma or newline separated emails)
    const emails = text
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setFormData(prev => ({ ...prev, recipients: emails }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) {
      setError('Campaign name is required');
      return;
    }
    
    if (formData.recipients.length === 0) {
      setError('At least one recipient is required');
      return;
    }
    
    if (!formData.message) {
      setError('Message is required');
      return;
    }
    
    // Validate email format for all recipients
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = formData.recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      setError(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await apiClient.startCampaign(formData);
      
      // Success: reset form
      setFormData({ name: '', recipients: [], message: '' });
      setRecipientsText('');
      setSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Communications</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-green-800">
            ✓ Campaign started successfully! Your message is being sent.
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Start New Campaign</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Campaign Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Spring Sale 2024"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Recipients * 
                <span className="font-normal text-gray-600 text-sm">
                  {' '}(comma or newline separated emails)
                </span>
              </label>
              <textarea
                value={recipientsText}
                onChange={handleRecipientsChange}
                placeholder="user1@example.com, user2@example.com&#10;user3@example.com"
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors font-mono"
              />
              <p className="text-sm text-gray-600 mt-2">
                {formData.recipients.length} recipient(s)
              </p>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your campaign message here..."
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:shadow-lg'
              }`}
            >
              {submitting ? 'Starting Campaign...' : 'Start Campaign'}
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
