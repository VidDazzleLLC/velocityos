import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VelocityOS - AI-Powered Business Operating System',
  description: 'The AI-powered business operating system that automates your workflow, unifies your data, and accelerates your growth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
