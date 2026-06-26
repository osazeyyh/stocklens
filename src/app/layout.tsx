import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'StockLens — NGX & US Returns Estimator',
  description:
    'Enter any amount and instantly see what the top-performing stocks in Nigeria and the US would have returned. Includes confidence ratings, hold advice, and hidden gems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>{children}</body>
    </html>
  )
}
