import FeedbackForm from '@/components/FeedbackForm';

export default function FeedbackPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Feedback</h1>
      
      <FeedbackForm />
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
      </div>
    </div>
  );
}
