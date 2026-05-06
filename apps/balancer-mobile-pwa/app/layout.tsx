import type { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import { MobilePwaProviders } from '@repo/lib/modules/mobile-pwa/providers/MobilePwaProviders'
import '@mobile/app/globals.css'

export const metadata: Metadata = {
  title: 'Balancer Mobile',
  description: 'A mobile-first PWA for watching Balancer portfolio positions.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Balancer',
  },
}

export const viewport: Viewport = {
  themeColor: '#12161f',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <MobilePwaProviders>{children}</MobilePwaProviders>
      </body>
    </html>
  )
}
