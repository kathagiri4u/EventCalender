import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { QueryProvider } from '@/components/providers/QueryProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "SportsCal — Austin's Game Day Guide",
    template: '%s | SportsCal',
  },
  description:
    'All sports schedules in one place. NFL, NBA, MLB, NHL, Soccer and more — updated twice daily for sports bar in Austin, TX.',
  keywords: ['sports schedule', 'Austin TX', 'NFL', 'NBA', 'MLB', 'NHL', 'game day'],
  openGraph: {
    type: 'website',
    siteName: 'SportsCal',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${inter.variable} font-body bg-background text-text-primary antialiased`}>
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
