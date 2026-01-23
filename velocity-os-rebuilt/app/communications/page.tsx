'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import type { StartCampaignPayload } from '@/types/api';

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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Communications</h1>

      {success && (
        <div style={{
          padding: '1rem',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '2rem',
          color: '#155724',
        }}>
          ✓ Campaign started successfully! Your message is being sent.
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Start New Campaign</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Campaign Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Spring Sale 2024"
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
              Recipients * 
              <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.875rem' }}>
                {' '}(comma or newline separated emails)
              </span>
            </label>
            <textarea
              value={recipientsText}
              onChange={handleRecipientsChange}
              placeholder="user1@example.com, user2@example.com&#10;user3@example.com"
              rows={5}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }}
            />
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
              {formData.recipients.length} recipient(s)
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your campaign message here..."
              rows={8}
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

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#c00',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.75rem 2rem',
              background: submitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Starting Campaign...' : 'Start Campaign'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
      </div>
    </div>
  );
}
