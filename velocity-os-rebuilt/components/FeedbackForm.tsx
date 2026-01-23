'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import type { SubmitFeedbackPayload } from '@/types/api';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps = {}) {
  const [formData, setFormData] = useState<SubmitFeedbackPayload>({
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.comment.trim()) {
      setError('Please provide a comment');
      return;
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await apiClient.submitFeedback(formData);
      
      // Success: reset form
      setFormData({ rating: 5, comment: '' });
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Share Your Feedback</h2>
      
      {success && (
        <div style={{
          padding: '1rem',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#155724',
        }}>
          ✓ Thank you for your feedback!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold' }}>
            How would you rate your experience? *
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                style={{
                  fontSize: '2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: star <= formData.rating ? '#ffc107' : '#ddd',
                  transition: 'color 0.2s',
                }}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Your Comments *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Tell us about your experience..."
            rows={5}
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
            background: submitting ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
