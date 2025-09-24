import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ROI Calculator | Automation Return on Investment Analysis',
  description: 'Calculate and analyze the return on investment for automation projects with detailed scenarios, risk assessment, and executive reporting.',
  keywords: 'ROI calculator, automation, return on investment, business analysis, productivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}