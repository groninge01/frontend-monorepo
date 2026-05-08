import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.*.*', '10.*.*.*', '172.*.*.*'],
  experimental: {
    viewTransition: true,
  },
  reactCompiler: true,
  transpilePackages: ['@repo/lib'],
  turbopack: {
    root: path.resolve(appDir, '../..'),
  },
}

export default nextConfig
