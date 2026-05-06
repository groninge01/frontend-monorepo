import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Balancer Mobile',
    short_name: 'Balancer',
    description: 'A mobile-first PWA for watching Balancer portfolio positions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#12161f',
    theme_color: '#12161f',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
