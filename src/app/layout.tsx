import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Humility Recovery — The Recovery OS for founders and fellowship leaders',
    template: '%s · Humility Recovery',
  },
  description: 'Operationalize the Recovery Plan with AI, Supabase, and handcrafted rituals. Keep calls, meetings, prayer, bodywork, and service in flow.',
  keywords: ['recovery', 'sobriety', '12-step', 'supabase', 'gemini', 'ai', 'rituals', 'spiritual formation', 'dashboard'],
  openGraph: {
    title: 'Humility Recovery — The Recovery OS for founders and fellowship leaders',
    description:
      'Operationalize the Recovery Plan with AI, Supabase, and handcrafted rituals. Keep calls, meetings, prayer, bodywork, and service in flow.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humility Recovery',
    description:
      'Operationalize the Recovery Plan with AI, Supabase, and handcrafted rituals.',
    creator: '@humility_recovery',
  },
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
