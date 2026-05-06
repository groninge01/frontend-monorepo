import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@repo/lib'],
  turbopack: {
    root: '../..',
  },
}

export default nextConfig
