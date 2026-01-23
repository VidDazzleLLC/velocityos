export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>VelocityOS</h1>
      <p>AI Business OS</p>
      <nav style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/dashboard" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', borderRadius: '4px' }}>
          Dashboard
        </a>
        <a href="/customers" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', borderRadius: '4px' }}>
          Customers
        </a>
        <a href="/communications" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', borderRadius: '4px' }}>
          Communications
        </a>
        <a href="/feedback" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', borderRadius: '4px' }}>
          Feedback
        </a>
      </nav>
    </main>
  )
}
