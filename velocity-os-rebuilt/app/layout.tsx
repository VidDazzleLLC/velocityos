import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VelocityOS',
  description: 'Next-gen AI business OS that automates routine work',
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
